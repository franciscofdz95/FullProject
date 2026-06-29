IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.ActiveSessions') AND type = 'V ')
   DROP VIEW [sec].[ActiveSessions]
GO

CREATE VIEW [sec].[ActiveSessions]
AS

-- list off the application-level sessions
SELECT 
	s.sessionId
,	u.ad_id
,	u.Emp_ID [empId]
,	u.sysm [userId]
,	au.sysm [authenticatedId]
,	sa.appCode
,	case when an.Active = 'Y' then 1 else 0 end [appOnline]
,	case when dateadd(dd, an.TimeoutDays, dateadd(hh, an.TimeoutHours, dateadd(mi, an.TimeoutMinutes, sa.modified))) > getdate() then 1 else 0 end [status]
,	case when an.Active != 'Y' then an.Active_Msg else null end [msg]
,	s.[source]
from		dbo.BIASecurity_Ctl_Session s
inner join	dbo.BIASecurity_Ctl_SessionApplication sa	on	s.SessionId = sa.SessionId
inner join	dbo.BIASecurity_Users u						on	sa.UserId = u.sysm
inner join	dbo.BIASecurity_Users au					on	s.authenticatedId = au.sysm
inner join	dbo.BIASecurity_ApplicationName an			on	sa.AppCode = an.Application_Code

union all

-- list off the global-level sessions
SELECT
	s.sessionId
,	coalesce(u.ad_id, s.userId) [ad_id]
,	u.Emp_ID [empId]
,	coalesce(u.sysm, s.userId) [userId]
,	au.sysm [authenticatedId]
,	null [appCode]
,	null [appOnline]
,	case when dateadd(mi, 30, s.modified) > getdate() then 1 else 0 end [status]
,	null [msg]
,	s.[source]
from		dbo.BIASecurity_Ctl_Session s
left join	dbo.BIASecurity_Users u						on	s.userId = u.sysm
left join	dbo.BIASecurity_Users au					on	s.authenticatedId = au.sysm
-- when a new user logs in, their session will show up but they do not exist
-- in the BIASecurity_Users table. Hence the left join here but not in the applications
-- select above.
