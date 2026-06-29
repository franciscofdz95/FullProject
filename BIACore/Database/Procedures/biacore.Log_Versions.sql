IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Log_Versions') AND type = 'P ')
   DROP PROCEDURE biacore.Log_Versions
GO

-- Only used by Log Viewer.
CREATE PROCEDURE biacore.Log_Versions
(	@debug		bit				= null
-- filter
,	@BeginDate	datetime		= null
,	@EndDate	datetime		= null
,	@AppCode	varchar(max)	= null
,	@Server		varchar(100)	= null
-- pager
,	@start		int				= null
,	@limit		int				= null
,	@sort		varchar(max)	= 'AppCode asc'
) AS
BEGIN
	SET NOCOUNT ON;

declare @sSQL varchar(max)

if (@EndDate is null) set @EndDate = getutcdate()
if (@BeginDate is null) set @BeginDate = dateadd(dd, -7, getutcdate())
-- normalize dates to remove time component. set EndDate to 1 day later for 'between' usage.
select
	@BeginDate = dateadd(dd, 0, datediff(dd, 0, @BeginDate))
,	@EndDate = dateadd(dd, 1, datediff(dd, 0, @EndDate))

set @sSQL = 'with pager as (select row_number() over (order by ' + @sort + ') ROWNUMBER, x.* from (
select
	z.*
from (
	select
		max(LogId) LogId
	,	[Server]
	,	AppCode
	from
		biacore.VersionLog
	where 
		[Date] between ''' + cast(@BeginDate as varchar) + ''' and ''' + cast(@EndDate as varchar) + '''
'
-- where
set @sSQL = @sSQL + biacore.fnColumnFilter('AppCode', @AppCode)
set @sSQL = @sSQL + biacore.fnColumnFilter('Server', @Server)

set @sSQL = @sSQL + '
	group by
		[Server]
	,	AppCode
) a
inner join
	biacore.VersionLog z
on	a.LogId = z.LogId
) x )'

-- pager
if (@start is null AND @limit is null)
	SET @sSQL = @sSQL + '
select * from pager order by ROWNUMBER'
else
	SET @sSQL = @sSQL + '
select * from pager where ROWNUMBER > ' + cast(@start as varchar(6)) + ' and ROWNUMBER <= ' + cast(@start + @limit as varchar(6)) + '
union all
select count(ROWNUMBER) ROWNUMBER,NULL,NULL,NULL,NULL,NULL from pager'

if (@debug = 1) print @sSQL

EXEC (@sSQL)

END
