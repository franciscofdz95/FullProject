IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_Stats') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_Stats]
GO

CREATE PROCEDURE [biacore].[Security_Stats]
AS
BEGIN

with data as (
select 
	SqlDate
,	[Event]
,	case when [Event] = 'End' then cast(Detail as float) / 1000 else null end [Time]
from 
	sec.BIASecurity_Log
where
	[Event] in ('End','CacheSuccess','ITAuthSuccess','ITAuthFail','ITAuthError','Lockout','Error')
	and SqlDate > dateadd(hh, -24, getutcdate())
)

	select
		'1 minute' as [Interval]
	,	sum(case when [Event] = 'CacheSuccess' then 1 else 0 end) [Cached]
	,	sum(case when [Event] = 'ITAuthSuccess' then 1 else 0 end) [Uncached]
	,	sum(case when [Event] = 'ITAuthFail' then 1 else 0 end) [Fail]
	,	sum(case when [Event] = 'ITAuthError' then 1 else 0 end) [Error]
	,	sum(case when [Event] = 'Lockout' then 1 else 0 end) [Lockout]
	,	count([Time]) as [Total]
	,	min([Time]) as [Min]
	,	max([Time]) as [Max]
	,	avg([Time]) as [Avg]
	,	stdev([Time]) as [Stdev]
	from
		data
	where 1=1
		and SqlDate > dateadd(mi, -1, getutcdate())
union all
	select
		'5 minute' as [Interval]
	,	sum(case when [Event] = 'CacheSuccess' then 1 else 0 end) [Cached]
	,	sum(case when [Event] = 'ITAuthSuccess' then 1 else 0 end) [Uncached]
	,	sum(case when [Event] = 'ITAuthFail' then 1 else 0 end) [Fail]
	,	sum(case when [Event] = 'ITAuthError' then 1 else 0 end) [Error]
	,	sum(case when [Event] = 'Lockout' then 1 else 0 end) [Lockout]
	,	count([Time]) as [Total]
	,	min([Time]) as [Min]
	,	max([Time]) as [Max]
	,	avg([Time]) as [Avg]
	,	stdev([Time]) as [Stdev]
	from
		data
	where 1=1
		and SqlDate > dateadd(mi, -5, getutcdate())
		and SqlDate <= dateadd(mi, -1, getutcdate())
union all
	select
		'10 minute' as [Interval]
	,	sum(case when [Event] = 'CacheSuccess' then 1 else 0 end) [Cached]
	,	sum(case when [Event] = 'ITAuthSuccess' then 1 else 0 end) [Uncached]
	,	sum(case when [Event] = 'ITAuthFail' then 1 else 0 end) [Fail]
	,	sum(case when [Event] = 'ITAuthError' then 1 else 0 end) [Error]
	,	sum(case when [Event] = 'Lockout' then 1 else 0 end) [Lockout]
	,	count([Time]) as [Total]
	,	min([Time]) as [Min]
	,	max([Time]) as [Max]
	,	avg([Time]) as [Avg]
	,	stdev([Time]) as [Stdev]
	from
		data
	where 1=1
		and SqlDate > dateadd(mi, -10, getutcdate())
		and SqlDate <= dateadd(mi, -5, getutcdate())
union all
	select
		'15 minute' as [Interval]
	,	sum(case when [Event] = 'CacheSuccess' then 1 else 0 end) [Cached]
	,	sum(case when [Event] = 'ITAuthSuccess' then 1 else 0 end) [Uncached]
	,	sum(case when [Event] = 'ITAuthFail' then 1 else 0 end) [Fail]
	,	sum(case when [Event] = 'ITAuthError' then 1 else 0 end) [Error]
	,	sum(case when [Event] = 'Lockout' then 1 else 0 end) [Lockout]
	,	count([Time]) as [Total]
	,	min([Time]) as [Min]
	,	max([Time]) as [Max]
	,	avg([Time]) as [Avg]
	,	stdev([Time]) as [Stdev]
	from
		data
	where 1=1
		and SqlDate > dateadd(mi, -15, getutcdate())
		and SqlDate <= dateadd(mi, -10, getutcdate())
union all
	select
		'30 minute' as [Interval]
	,	sum(case when [Event] = 'CacheSuccess' then 1 else 0 end) [Cached]
	,	sum(case when [Event] = 'ITAuthSuccess' then 1 else 0 end) [Uncached]
	,	sum(case when [Event] = 'ITAuthFail' then 1 else 0 end) [Fail]
	,	sum(case when [Event] = 'ITAuthError' then 1 else 0 end) [Error]
	,	sum(case when [Event] = 'Lockout' then 1 else 0 end) [Lockout]
	,	count([Time]) as [Total]
	,	min([Time]) as [Min]
	,	max([Time]) as [Max]
	,	avg([Time]) as [Avg]
	,	stdev([Time]) as [Stdev]
	from
		data
	where 1=1
		and SqlDate > dateadd(mi, -30, getutcdate())
		and SqlDate <= dateadd(mi, -15, getutcdate())
union all
	select
		'60 minute' as [Interval]
	,	sum(case when [Event] = 'CacheSuccess' then 1 else 0 end) [Cached]
	,	sum(case when [Event] = 'ITAuthSuccess' then 1 else 0 end) [Uncached]
	,	sum(case when [Event] = 'ITAuthFail' then 1 else 0 end) [Fail]
	,	sum(case when [Event] = 'ITAuthError' then 1 else 0 end) [Error]
	,	sum(case when [Event] = 'Lockout' then 1 else 0 end) [Lockout]
	,	count([Time]) as [Total]
	,	min([Time]) as [Min]
	,	max([Time]) as [Max]
	,	avg([Time]) as [Avg]
	,	stdev([Time]) as [Stdev]
	from
		data
	where 1=1
		and SqlDate > dateadd(mi, -60, getutcdate())
		and SqlDate <= dateadd(mi, -30, getutcdate())
union all
	select
		'12 hour' as [Interval]
	,	sum(case when [Event] = 'CacheSuccess' then 1 else 0 end) [Cached]
	,	sum(case when [Event] = 'ITAuthSuccess' then 1 else 0 end) [Uncached]
	,	sum(case when [Event] = 'ITAuthFail' then 1 else 0 end) [Fail]
	,	sum(case when [Event] = 'ITAuthError' then 1 else 0 end) [Error]
	,	sum(case when [Event] = 'Lockout' then 1 else 0 end) [Lockout]
	,	count([Time]) as [Total]
	,	min([Time]) as [Min]
	,	max([Time]) as [Max]
	,	avg([Time]) as [Avg]
	,	stdev([Time]) as [Stdev]
	from
		data
	where 1=1
		and SqlDate > dateadd(hh, -12, getutcdate())
		and SqlDate <= dateadd(hh, -1, getutcdate())
union all
	select
		'24 hour' as [Interval]
	,	sum(case when [Event] = 'CacheSuccess' then 1 else 0 end) [Cached]
	,	sum(case when [Event] = 'ITAuthSuccess' then 1 else 0 end) [Uncached]
	,	sum(case when [Event] = 'ITAuthFail' then 1 else 0 end) [Fail]
	,	sum(case when [Event] = 'ITAuthError' then 1 else 0 end) [Error]
	,	sum(case when [Event] = 'Lockout' then 1 else 0 end) [Lockout]
	,	count([Time]) as [Total]
	,	min([Time]) as [Min]
	,	max([Time]) as [Max]
	,	avg([Time]) as [Avg]
	,	stdev([Time]) as [Stdev]
	from
		data
	where 1=1
		and SqlDate > dateadd(hh, -24, getutcdate())
		and SqlDate <= dateadd(hh, -12, getutcdate())

END