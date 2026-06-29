IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Show_Performance') AND type = 'P ')
   DROP PROCEDURE biacore.Show_Performance
GO

-- procedure for quickly seeing the last N
CREATE PROCEDURE biacore.Show_Performance
(	@period		int		= 60
) AS
BEGIN
	set nocount on;

	select 
		[Event] as [Procedure]
	,	min(cast(Detail as float)) as [Min]
	,	max(cast(Detail as float)) as [Max]
	,	avg(cast(Detail as float)) as [Avg]
	,	var(cast(Detail as float)) as [Var]
	,	stdev(cast(Detail as float)) as [StdDev]
	,	count(*) as [Count]
	from
		biacore.ApplicationLog
	where
		[Level] = 'Performance'
		and [Event] not like 'biacore%'
		and [Date] >= dateadd(mi, -@period, getutcdate())
	group by
		[Event]
END
