IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_Lockout') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_Lockout]
GO

CREATE PROCEDURE [biacore].[Security_Lockout]
(	@debug			bit				= 0
-- filters
,	@search			varchar(max)	= null
-- paging
,	@start			int				= null
,	@limit			int				= null
,	@sort			varchar(max)	= 'UserId asc'
)
AS
BEGIN
set nocount on;

declare @sSQL varchar(max)
declare @match varchar(max)

set @match = '''%' + @search + '%'''

set @sSQL = 'with pager as (select row_number() over (order by ' + @sort + ') ROWNUMBER, x.* from (
select
	f.UserId
,	u.L_Name as [LastName]
,	u.F_Name as [FirstName]
,	count(*) as [Failures]
,	case 
		when count(f.UserId) >= 6 then 7200 - datediff(s, max(f.[Date]), getutcdate()) 
		when count(f.UserId) >= 3 then 900 - datediff(s, max(f.[Date]), getutcdate()) 
		else 0 
	end as [Lockout]
from
	sec.BIASecurity_Fail f
left join 
	dbo.BIASecurity_Users u
on f.UserId = u.ad_id or f.UserId = u.sysm'

if (len(@search) > 0) set @sSQL = @sSQL + '
where
	f.UserId like ' + @match + '
	or u.L_Name like ' + @match + '
	or u.F_Name like ' + @match + '
	or u.F_Name + '' '' + u.L_Name like ' + @match + '
	or u.L_Name + '', '' + u.F_Name like ' + @match

set @sSQL = @sSQL + '
group by
	f.UserId
,	u.L_Name
,	u.F_Name
) x )'

-- pager
if (@start is null AND @limit is null)
	SET @sSQL = @sSQL + '
select * from pager order by ROWNUMBER'
else
	SET @sSQL = @sSQL + '
select * from pager where ROWNUMBER > ' + cast(@start as varchar) + ' and ROWNUMBER <= ' + cast(@start + @limit as varchar) + '
union all
select count(ROWNUMBER) ROWNUMBER,NULL,NULL,NULL,NULL,NULL from pager'

if (@debug = 1) print @sSQL

EXEC (@sSQL)
END
