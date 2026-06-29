IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Log_Digest') AND type = 'P ')
   DROP PROCEDURE biacore.Log_Digest
GO

-- Only used by Log Viewer.
CREATE PROCEDURE biacore.Log_Digest
(	@debug		bit				= 0
-- filters
,	@LogId		bigint			= null
,	@Level		varchar(max)	= 'Exception'
)
AS
BEGIN
set nocount on;

with pager as (
	select
		LogId
	,	[Date]
	,	AppCode
	,	Detail
	from 
		biacore.ApplicationLog
	where 
		[Level] = @Level
		and (@LogId is null or LogId > @LogId)
)

select
	AppCode
,	count(*) as [Count]
,	Detail
from
	pager
group by
	AppCode
,	Detail
union all
select null,coalesce(max(LogId), @LogId),null from pager

END
