IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.LoginStart') AND type = 'P ')
   DROP PROCEDURE [sec].[LoginStart]
GO
/*
AuthResult
Error	= -1
Failure = 0
Success = 1
NoData	= 2
LockOut = 3
NoAccess = 4
Offline = 5
NewUser = 6

Expected from this SP:
	0 (unable to impersonate)
	1 (with SessionId)
	4 (no access to appCode, with SessionId)
	5 (with SessionId)
	6 (with SessionId)
*/
CREATE PROCEDURE [sec].[LoginStart]
(	@userId		varchar(50)		= null
,	@targetId	varchar(50)		= null
,	@appCode	varchar(25)		= null
,	@source		varchar(10)		= 'unknown'
,	@ip			varchar(15)		= null
,	@env		varchar(6)		= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @appUrl varchar(max)
	declare @sessionId uniqueidentifier

	declare @sysm varchar(max)
	select @sysm = (
		select top 1 sysm from (
			-- assume userId is ad_id
			select sysm from dbo.BIASecurity_Users where ad_id = @userId
			union all
			-- backup is that they used their actual sysm
			select sysm from dbo.BIASecurity_Users where sysm = @userId
		) a )

	declare @target_sysm varchar(max)
	select @target_sysm = (
		select top 1 sysm from (
			-- assume targetId is ad_id
			select sysm from dbo.BIASecurity_Users where ad_id = @targetId
			union all
			-- backup is that they used their actual sysm
			select sysm from dbo.BIASecurity_Users where sysm = @targetId
		) a )

	-- clear failed list (can't put this in sec.LoginCache because they may auth against cache on success pass)
	delete from sec.BIASecurity_Fail where UserId = @userId

	-- loginAs ability test
	if (len(@targetId) > 0)
	begin
		declare @loginAs int
		set @loginAs = sec.fnLoginAs(@target_sysm, @sysm, @appCode)

		-- unable to loginAs, return null.
		if (@loginAs = 0)
		begin
			select	0 [AuthResult]
			return
		end
	end

	-- create sessionId
	set @sessionId = newid()
	-- start session
	insert into dbo.BIASecurity_Ctl_Session
	(	sessionId
	,	userId
	,	created
	,	modified
	,	ipAddress
	,	active
	,	authenticatedId
	,	[server]
	,	[source]
	)
	values
	(	@sessionId
	,	coalesce(@target_sysm, @sysm, @userId)
	,	getdate()
	,	getdate()
	,	@ip
	,	1
	,	coalesce(@sysm, @userId)
	,	@env
	,	@source
	)

	if (len(@sysm) is null)
	begin
		select
			6 [AuthResult] -- NewUser
		,	@sessionId [SessionId]
		return
	end

	-- log in to app
	if (len(@appCode) > 0)
	begin
		select @appUrl = ReturnPath from dbo.BIASecurity_ApplicationName where application_code = @appCode

		-- spin up the applicationSession
		declare @pid int
		set @pid = @@spid
		exec sec.SessionStart @sessionId, @appCode, @ip, @pid

		select
			case 
				when appOnline = 0 then 5		-- offline
				when [status] in (2,3) then 4	-- no access
				else 1
			end [AuthResult]
		,	sessionId [SessionId]
		,	@appUrl [AppUrl]
		from
			sec.BIASecurity_Start
		where
			pid = @pid

		return
	end

	-- and finally return results
	select
		1 [AuthResult]
	,	@sessionId [SessionId]
	,	@appUrl	[AppUrl]

END
GO
