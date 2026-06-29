IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.SessionUpdate') AND type = 'P ')
   DROP PROCEDURE sec.SessionUpdate
GO

CREATE PROCEDURE sec.SessionUpdate
(	@sessionId	uniqueidentifier	= null
,	@appCode	varchar(50)			= null
,	@ip			varchar(16)			= null
,	@env		varchar(10)			= null
) AS
BEGIN

	declare @userId varchar(max)
	declare @online	int, @offline int, @active int, @session int

	-- check for an existing session
	select
		@userId = userId
	,	@online = case when appCode = @appCode then appOnline else @online end	-- app online
	,	@active = case when appCode = @appCode then [status] else @active end	-- application session active
	,	@session = case when appCode = @appCode then [status] else @session end	-- session active (only matters if appsession is not active)
	from
		sec.ActiveSessions
	where
		sessionId = @sessionId

	-- if app is offline and session is active, check for offline-capable access
	if (@online = 0 and @active = 1)
	begin
		-- check for offline-capable access
		set @offline = sec.fnUserAccess(@userId, @appCode)
	end

	-- if app online or user offline-capable; and session is active, we're on the fast path
	if ((@online = 1 or @offline = 3) and @active = 1)
	begin
		-- update modified date to mark user as still active (session)
		update dbo.BIASecurity_Ctl_Session
			set modified = getdate(),
				active = 1 -- remove this pile of crap
		from dbo.BIASecurity_Ctl_Session s
			inner join sec.ActiveSessions a on s.sessionId = a.sessionId and (@appCode is null or a.appCode = @appCode)
		where s.sessionId = @sessionId and a.[status] = 1

		-- update modified date to mark user as still active (application)
		update dbo.BIASecurity_Ctl_SessionApplication
			set modified = getdate(),
				active = 1 -- remove this pile of crap
		from dbo.BIASecurity_Ctl_SessionApplication sa
			inner join sec.ActiveSessions a on sa.sessionId = a.sessionId and sa.appCode = a.appCode
		where sa.sessionId = @sessionId and sa.appCode = @appCode and a.[status] = 1

		-- return the requested session information
		select 
			sessionId
		,	ad_id
		,	empId
		,	userId
		,	authenticatedId
		,	appCode
		,	appOnline
		,	[status]
		,	case when @offline = 1 then 'Application Offline Override' else 'Session Updated' end msg
		from
			sec.ActiveSessions
		where
			sessionId = @sessionId
			and (appCode = @appCode
				or (@appCode is null and appCode is null)
			)
		return;
	end

	declare @pid int
	set @pid = @@spid
	-- no active session, so create one!
	exec sec.SessionStart @sessionId, @appCode, @ip, @pid

	select
		sessionId
	,	ad_id
	,	empId
	,	userId
	,	authenticatedId
	,	appCode
	,	appOnline
	,	[status]
	,	msg
	from
		sec.BIASecurity_Start
	where
		pid = @pid

END
GO
