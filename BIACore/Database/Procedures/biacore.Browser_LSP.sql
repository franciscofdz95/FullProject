IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Browser_LSP') AND type = 'P ')
   DROP PROCEDURE [biacore].[Browser_LSP]
GO

CREATE PROCEDURE [biacore].[Browser_LSP]
(	@debug				bit				= 0
,	@AppCode			varchar(max)	= null
,	@UserId				varchar(max)	= null
,	@BeginDate			datetime		= null
,	@EndDate			datetime		= null
,	@start				int				= null
,	@limit				int				= null
,	@sort				varchar(max)	= '[Date] desc'
) AS
BEGIN
	SET NOCOUNT ON;

if (@EndDate is null) set @EndDate = getutcdate()
if (@BeginDate is null) set @BeginDate = dateadd(dd, -7, getutcdate())
-- normalize dates to remove time component. set EndDate to 1 day later for 'between' usage.
select
	@BeginDate = dateadd(dd, 0, datediff(dd, 0, @BeginDate))
,	@EndDate = dateadd(dd, 1, datediff(dd, 0, @EndDate))

declare @categories varchar(max)
set @categories = ''

declare @cSQL nvarchar(max)
set @cSQL = N'select @categories = @categories + '',['' + Browser + '']'' from (
	select distinct
		Browser
	from
		biacore.BrowserLog
	where 
		[Date] between ''' + convert(varchar, @BeginDate, 126) + ''' and ''' + convert(varchar, @EndDate, 126) + '''
'
-- where
set @cSQL = @cSQL + biacore.fnColumnFilter('AppCode', @AppCode)
set @cSQL = @cSQL + biacore.fnColumnFilter('UserId', @UserId)

set @cSQL = @cSQL + '
) a'

if (@debug = 1) print @cSQL
exec sp_executesql @cSQL, N'@categories varchar(max) output', @categories output;

declare @sSQL varchar(max)

select @sSQL = 'with data as (
select distinct
	convert(varchar(10), dateadd(dd, 0, datediff(dd, 0, [Date])), 101) [Date]
,	Browser
,	UserId
from
	biacore.BrowserLog
where '

if (len(@categories) = 0)
	set @sSQL = @sSQL + '1=2'
else
	set @sSQL = @sSQL + '1=1'

-- filters
set @sSQL = @sSQL + '
and [Date] between ''' + convert(varchar, @BeginDate, 126) + ''' and ''' + convert(varchar, @EndDate, 126) + ''''
set @sSQL = @sSQL + biacore.fnColumnFilter('AppCode', @AppCode)
set @sSQL = @sSQL + biacore.fnColumnFilter('UserId', @UserId)

set @sSQL = @sSQL + '
), data_total as (
select distinct
	null [Date]
,	Browser
,	UserId
from
	data
), data_all as (
	select * from data
	union all
	select * from data_total
), pager as (select row_number() over (order by ' + @sort + ') ROWNUMBER, x.* from (
select
	[Date]
' + @categories + '
from data_all d pivot (
	count(UserId) for Browser in (' + substring(@categories, 2, len(@categories) - 1) + ')
) p ) x )'

-- pager
if (@start is null AND @limit is null)
	SET @sSQL = @sSQL + '
select * from pager where [Date] is not null order by ROWNUMBER'
else
	SET @sSQL = @sSQL + '
select * from pager where ROWNUMBER > ' + cast(@start as varchar) + ' and ROWNUMBER <= ' + cast(@start + @limit as varchar) + ' and [Date] is not null
union all
select ROWNUMBER - 1,[Date]' + @categories + ' from pager where [Date] is null'

if (@debug = 1) print @sSQL

exec (@sSQL)

END
