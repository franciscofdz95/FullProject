IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.ImpersonationList') AND type = 'P ')
   DROP PROCEDURE sec.ImpersonationList
GO

CREATE PROCEDURE sec.ImpersonationList
(	@sessionId		UNIQUEIDENTIFIER		= null
,	@appCode		VARCHAR(25)				= null
) AS 
BEGIN
	SET NOCOUNT ON;

	-- get the information for the authenticated user
	with AuthenticatedUser as (
		select 
			s.userId as [userId]
		,	u.L_Name as [lastName]
		,	u.F_Name as [firstName]
		,	'self' as [type]
		from	dbo.BIASecurity_Ctl_Session s
		join	dbo.BIASecurity_Ctl_SessionApplication sa on s.sessionId = sa.sessionId 
		join	dbo.BIASecurity_Users u			on s.userId = u.sysm
		where
			s.SessionID = @SessionID
			and sa.appCode = @appCode
			and s.userId != sa.userId -- return no row when session user = application user
	),
	-- get the impersonation history for the authenticated user
	ImpersonatedUser as (
		select top 4
			il.impersonationId as [userId]
		,	u.L_Name as [lastName]
		,	u.F_Name as [firstName]
		,	'impersonate' as [type]
		from	dbo.BIASecurity_Ctl_Session s
		join	dbo.BIASecurity_Ctl_ImpersonationLog il		on s.userId = il.userId
		join	dbo.BIASecurity_Users u 					on il.impersonationId = u.sysm
		where
			s.sessionId = @sessionId
			and il.appCode = @appCode
		group by
			il.impersonationId
		,	u.L_Name
		,	u.F_Name
		order by
			-- this is a weird order by.
			min(il.created) DESC
	),
	-- get the delegate list for the authenticated user
	DelegatedUser as (
		select top 4
			d.sysm as [userId]
		,	ip.L_Name as [lastName]
		,	ip.F_Name as [firstName]
		,	'delegate' as [type]
		from	dbo.BIASecurity_Ctl_Session s
        join	dbo.BIASecurity_Users u			on s.userId = u.sysm
        join	dbo.BIASecurity_Delegates d		on u.sysm = d.sysm_delegate 
		join	dbo.BIASecurity_Users ip		on d.sysm = ip.sysm
		where
			s.sessionId = @sessionId
            and s.active = 1
            and s.modified >= DATEADD(minute, -40, GETDATE())
            and d.activeFlag = 1
            and d.expirationDT >= GETDATE()
            and d.enabledFlag = 1
            and d.application_code = @appCode		
			and d.sysm not in (select userid from ImpersonatedUser)
	)

	select * from AuthenticatedUser
	union all
	select * from ImpersonatedUser
	union all
	select * from DelegatedUser
END
