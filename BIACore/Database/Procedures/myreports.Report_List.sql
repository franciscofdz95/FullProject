IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Report_List') AND type = 'P ')
   DROP PROCEDURE [myreports].[Report_List]
GO

CREATE PROCEDURE [myreports].[Report_List]
(	@debug		bit				= 0
-- filters
,	@AppCode	varchar(max)	= null
,	@UserId		varchar(max)	= null
,	@Date		datetime		= null
,	@Age		datetime		= null
,	@Status		varchar(max)	= null
,	@Type		varchar(max)	= null
-- paging
,	@start		int				= null
,	@limit		int				= null
,	@sort		varchar(max)	= 'ReportId desc'
) AS
BEGIN

declare @sSQL varchar(max)

set @sSQL = 'with pager as (select row_number() over (order by ' + @sort + ') ROWNUMBER, x.* from (
select
	MyReportsId [ReportId]
,	case when DateComplete is null then DateEntry else DateComplete end [Date]
,	RACF [UserId]
,	ROIName [ReportType]
,	[Description]
,	[Priority]
,	[Status]
,	StatusComments [Comments]
,	BaseReportName [FileName]
,	OutputFormat [FileType]
from
	dbo.MyReportsCF
where 1=1
'
-- where
if (@Date is not null)
	set @sSQL = @sSQL + ' and DateEntry >= ''' + convert(varchar, @Date, 113) + ''''

if (@Age is not null)
	set @sSQL = @sSQL + ' and DateEntry <= ''' + convert(varchar, @Age, 113) + ''''

set @sSQL = @sSQL + myreports.fnColumnFilter( 'ROXName', @AppCode )
set @sSQL = @sSQL + myreports.fnColumnFilter( 'RACF', @UserId )
set @sSQL = @sSQL + myreports.fnColumnFilter( '[Status]', @Status )
set @sSQL = @sSQL + myreports.fnColumnFilter( 'ROIName', @Type )

set @sSQL = @sSQL + '
) x )'

-- pager
if (@start is null AND @limit is null)
	SET @sSQL = @sSQL + '
select * from pager order by ROWNUMBER'
else
	SET @sSQL = @sSQL + '
select * from pager where ROWNUMBER > ' + cast(@start as varchar) + ' and ROWNUMBER <= ' + cast(@start + @limit as varchar) + '
union all
select count(ROWNUMBER) ROWNUMBER,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL from pager'

if (@debug = 1) print @sSQL

EXEC (@sSQL)

END