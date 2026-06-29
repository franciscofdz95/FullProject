IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Browser_Chart') AND type = 'P ')
   DROP PROCEDURE [biacore].[Browser_Chart]
GO

CREATE PROCEDURE [biacore].[Browser_Chart]
(	@debug				bit				= 0
,	@AppCode			varchar(max)	= null
,	@UserId				varchar(max)	= null
,	@BeginDate			datetime		= null
,	@EndDate			datetime		= null
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

-- if no categories exist, go ahead and return without the pivot
if (len(@categories) = 0)
begin
	select null [Date] where 1=2
	return
end

declare @sSQL varchar(max)

select @sSQL = 'select
	[Date]
' + @categories + '
from (
select
	convert(varchar(10), dateadd(dd, 0, datediff(dd, 0, [Date])), 101) [Date]
,	Browser
,	count(distinct UserId) as [Users]
from
	biacore.BrowserLog
where 
	[Date] between ''' + convert(varchar, @BeginDate, 126) + ''' and ''' + convert(varchar, @EndDate, 126) + '''
'
set @sSQL = @sSQL + biacore.fnColumnFilter('AppCode', @AppCode)
set @sSQL = @sSQL + biacore.fnColumnFilter('UserId', @UserId)

set @sSQL = @sSQL + '
group by
	dateadd(dd, 0, datediff(dd, 0, [Date]))
,	Browser
) d pivot (
	sum(Users) for Browser in (' + substring(@categories, 2, len(@categories) - 1) + ')
) p'

if (@debug = 1) print @sSQL

exec (@sSQL)

END
