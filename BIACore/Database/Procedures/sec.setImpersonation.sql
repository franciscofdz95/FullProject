IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.setImpersonation') AND type = 'P ')
   DROP PROCEDURE sec.setImpersonation
GO

CREATE PROCEDURE sec.setImpersonation
(	@sessionId		uniqueidentifier
,	@appCode		varchar(25)
,	@impersonateId	varchar(50)
,	@clientIp		varchar(15)			= '0.0.0.0'
) AS 
BEGIN
	SET NOCOUNT ON;

	-- target output
	-- SessionId - either current or new SessionId
	-- Error - integer, 0 for no error
	-- Message - string, user-friendly message for what happened

	declare
		@userId	varchar(50), @appId varchar(50), @targetId varchar(50)
	,	@newSessionId uniqueidentifier

	-- find current user and application id
	select
		@userId = s.userId
	,	@appId = sa.userId
	from	dbo.BIASecurity_Ctl_Session s
	join	dbo.BIASecurity_Ctl_SessionApplication sa	on s.sessionId = sa.sessionId
	where
		s.sessionId = @sessionId
		and sa.appCode = @appCode
		and s.active = 1

	if (@userId is null)
	begin
		select @sessionId [SessionId], 1 [Error], 'Your session is currently inactive, please log in again.' [Message]
		return
	end

	-- convert impersonateId from ad_id to sysm
	select	@targetId = u.sysm
	from	BIASecurity_Users u
	where	u.AD_ID = @impersonateId or u.sysm = @impersonateId

	-- verify the target exists
	if (@targetId is null)
	begin
		select @sessionId [SessionId], 2 [Error], 'Cannot find user to impersonate.' [Message]
		return
	end

	-- verify that @userId can impersonate @targetId
	if (not exists(
	-- session user is SA
		SELECT distinct sysm
		FROM BIASecurity_ApplicationUser
		WHERE sysm = @userId
		and (Application_Code = 'BIA_UserMaint' or Application_Code = @appCode)
		and Security_Level = 'SA'
		UNION ALL
	-- session user is impersonate all capable
		--Newer model requires this table be used.
		--TODO: Perform conversion to eliminate the above query??  Might require UI changes.
		SELECT sysm
		FROM BIASecurity_UserLoginAs imp
		WHERE imp.sysm = @userId
		and imp.application_code IN (@appCode, 'All')
		and imp.activeFlag = 1
		and (imp.expirationDT >= GETDATE() or imp.expirationDT is NULL)
		UNION ALL
	-- session user is allowed to log in as target user
		--Check for delegated permission.
		SELECT sysm_delegate
		FROM dbo.BIASecurity_Delegates dlg
		WHERE dlg.sysm = @targetId
		and dlg.sysm_delegate = @userId
		and dlg.application_code = @appCode
		and dlg.enabledFlag = 1 and dlg.activeFlag = 1
		and (dlg.expirationDT >= GETDATE() or dlg.expirationDT is NULL)
		UNION ALL
	-- session user is target user (when returning from delegate mode)
		select @userId where @userId = @targetId
		))
	begin
		select @sessionId [SessionId], 4 [Error], 'You do not have the required permissions to impersonate.' [Message]
		return
	end

	-- generate our new sessionId
	select @newSessionId = newid()

	-- update Application Id
	update BIASecurity_Ctl_SessionApplication
	set	userId = @targetId
	,	modified = dateadd(mi, -3, getdate())
	,	active = 1
	where sessionId = @sessionId and appCode = @appCode

	-- update Session with new Session Id
	update BIASecurity_Ctl_Session
	set	sessionId = @newSessionId
	where sessionId = @sessionId

	-- log the event
	insert into dbo.BIASecurity_Ctl_ImpersonationLog (userId, impersonationId, appCode, created, ipAddress)
	values	(@userId, @targetId, @appCode, getdate(), @clientIp)

	-- return success
	select @newSessionId [SessionId], 0 [Error], 'Success' [Message]

END
