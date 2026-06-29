IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.SessionStart') AND type = 'P ')
   DROP PROCEDURE sec.SessionStart
GO

CREATE PROCEDURE sec.SessionStart
(	@sessionId		uniqueidentifier	= null
,	@appCode		varchar(50)			= null
,	@ip				varchar(16)			= null
,	@pid			int					= null
) AS
BEGIN

	-- clean up the global temporary table
	delete from sec.BIASecurity_Start where pid = @pid

	-- we are called because no session appears to exist for the given sessionId/appCode.
	-- determine if one can be created (and create it), or if the user needs to be redirected to login.
	delete from dbo.BIASecurity_Ctl_SessionApplication where sessionId = @sessionId and appCode = @appCode

	-- we assume an active session exists for the user. if not, return
	if (not exists(select sessionId from sec.ActiveSessions where sessionId = @sessionId and appCode is null and [status] = 1))
	begin
		-- no active parent session, redirect to login
		insert into sec.BIASecurity_Start (pid, sessionId, appCode, appOnline, [status], msg)
		values 
		(	@pid
		,	@sessionId
		,	@appCode
		,	0 --appOnline
		,	0 --[status]
		,	'Session record does not exist, redirect user to login!'
		)
		return
	end

	-- they have an active parent session
	-- grab important info from that session.
	declare @userId varchar(max), @authId varchar(max)
	select @userId = userId, @authId = authenticatedId from sec.ActiveSessions	where sessionId = @sessionId and appCode is null

	-- check application access
	declare @access int
	set @access = sec.fnUserAccess(@userId, @appCode)

	if (@access != 1 and @access != 3)
	begin -- user access denied
		set @access = sec.fnUserAccess(@authId, @appCode)

		if (@access != 1 and @access != 3)
		begin -- auth access denied
			-- access denied for user and authenticated user

			-- determine if the userId has any outstanding requests for the app
			declare @requests int
			set @requests = 0
			select @requests = count(sysm) from dbo.BIASecurity_ApplicationUserGeoRequest WHERE application_code = @appCode and sysm = @userId

			insert into sec.BIASecurity_Start (pid, sessionId, appCode, appOnline, [status], msg)
			values
			(	@pid
			,	@sessionId
			,	@appCode
			,	case
					when @access = 2 then 0		-- offline
					else 1						-- online
				end -- appOnline
			,	case 
					when @requests > 0 then 3	-- pending requests
					else 2						-- no pending requests
				end -- [status]
			,	case 
					when @requests > 0 then 'No App Permission, Pending Request' 
					else 'No App Permission, No Request' 
				end
			)
			return
		end -- auth access denied
		else
		begin -- auth access
			-- authenticated user has access; switch to them.
			set @userId = @authId
		end -- auth access
	end -- user access denied

	-- active parent session, and @userId has access to the app; create the session
	insert into dbo.BIASecurity_Ctl_SessionApplication
	(	applicationId
	,	sessionId
	,	appCode
	,	created
	,	modified
	,	active
	,	userId
	)
	values
	(	newid()
	,	@sessionId
	,	@appCode
	,	getdate()
	,	getdate()
	,	1
	,	@userId
	)

	-- login audit
	insert into dbo.BIASecurity_Audit
	(	sysm
	,	TimeOfVisit
	,	Application_Code
	,	Entry_Type
	,	IP_Address
	,	Comment
	) values 
	(	@userId
	,	getdate()
	,	@appCode
	,	'Valid Login'
	,	@ip
	,	'Valid Login'
	)

	-- and finally return the new session
	insert into sec.BIASecurity_Start (pid, sessionId, ad_id, empId, userId, authenticatedId, appCode, appOnline, [status], msg)
	select 
		@pid
	,	sessionId
	,	ad_id
	,	empId
	,	userId
	,	authenticatedId
	,	appCode
	,	appOnline
	,	[status]
	,	'Session Started' msg
	from
		sec.ActiveSessions
	where 1=1
		and sessionId = @sessionId
		and appCode = @appCode

END
