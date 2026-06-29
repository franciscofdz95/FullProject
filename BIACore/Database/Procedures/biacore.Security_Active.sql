IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_Active') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_Active]
GO

CREATE PROCEDURE [biacore].[Security_Active]
(	@debug			bit				= 0
-- paging
,	@start			int				= null
,	@limit			int				= null
,	@sort			varchar(max)	= 'created asc'
) AS
BEGIN
set nocount on;

declare @sSQL varchar(max)

set @sSQL = 'with AppList as (
select distinct
	SessionId
,	(select stuff((
		select '', '' + AppCode 
		from dbo.BIASecurity_Ctl_SessionApplication 
		where SessionId = sa.SessionId 
		order by AppCode 
		for xml path('''') 
	), 1, 2, '''')) [AppCodes]
from
	dbo.BIASecurity_Ctl_SessionApplication sa
where
	active = 1
), pager as (select row_number() over (order by ' + @sort + ') ROWNUMBER, x.* from (
select
	s.sessionId
,	s.[server] [env]
,	s.[source] [source]
,	s.created
,	s.modified
,	s.ipAddress
,	s.userId [UserId]
,	u1.F_Name [FirstName]
,	u1.L_Name [LastName]
,	case when s.authenticatedId = s.userId then null else s.authenticatedId end [Auth_UserId]
,	u2.F_Name [Auth_FirstName]
,	u2.L_Name [Auth_LastName]
,	al.AppCodes
from	dbo.BIASecurity_Ctl_Session s
inner join	dbo.BIASecurity_Users u1	on	s.userId = u1.sysm
left join	dbo.BIASecurity_Users u2	on	s.authenticatedId = u2.sysm and s.userId != s.authenticatedId
left join	applist al	on	s.sessionId = al.sessionId
where
	s.active = 1
) x )'

-- pager
if (@start is null AND @limit is null)
	SET @sSQL = @sSQL + '
select * from pager order by ROWNUMBER'
else
	SET @sSQL = @sSQL + '
select * from pager where ROWNUMBER > ' + cast(@start as varchar) + ' and ROWNUMBER <= ' + cast(@start + @limit as varchar) + '
union all
select count(ROWNUMBER) ROWNUMBER,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL from pager'

if (@debug = 1) print @sSQL

EXEC (@sSQL)

END
