IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_LSP') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_LSP]
GO

CREATE PROCEDURE [biacore].[Security_LSP]
(	@debug			bit				= 0
-- filters
,	@LogId			varchar(max)	= null
,	@BeginDate		datetime		= null
,	@EndDate		datetime		= null
,	@UserId			varchar(max)	= null
,	@TargetId		varchar(max)	= null
,	@Event			varchar(max)	= null
,	@Detail			varchar(max)	= null
,	@TransactionId	varchar(max)	= null
-- paging
,	@start			int				= null
,	@limit			int				= null
,	@sort			varchar(max)	= 'LogId asc'
) AS
BEGIN
set nocount on;

declare @sSQL varchar(max)
if (@TransactionId is null)
begin
	if (@EndDate is null) set @EndDate = getutcdate()
	if (@BeginDate is null) set @BeginDate = getutcdate()
end
---- normalize dates to remove time component. set EndDate to 1 day later for 'between' usage.
select
	@BeginDate = case when @BeginDate is null then null else dateadd(dd, 0, datediff(dd, 0, @BeginDate)) end
,	@EndDate = case when @EndDate is null then null else dateadd(dd, 1, datediff(dd, 0, @EndDate)) end

set @sSQL = 'with pager as (select row_number() over (order by ' + @sort + ') ROWNUMBER, x.* from (
select
	LogId
,	TransactionId
,	Server
,	Client
,	UserId
,	TargetId
,	LogDate
,	SqlDate
,	[Event]
,	Detail
from
	sec.BIASecurity_Log
where 1=1'

if (@BeginDate is not null and @EndDate is not null)
	set @sSQL = @sSQL + ' and LogDate between ''' + convert(varchar, @BeginDate, 126) + ''' and ''' + convert(varchar, @EndDate, 126) + ''''

set @sSQL = @sSQL + biacore.fnColumnFilter('UserId', @UserId)
set @sSQL = @sSQL + biacore.fnColumnFilter('TargetId', @TargetId)
set @sSQL = @sSQL + biacore.fnColumnFilter('Event', @Event)
set @sSQL = @sSQL + biacore.fnColumnFilter('TransactionId', @TransactionId)

if (@Detail is not null) set @sSQL = @sSQL + ' and Detail like ''' + @Detail + ''''
if (@LogId is not null) set @sSQL = @sSQL + ' and LogId <= ' + @LogId + '
'

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
