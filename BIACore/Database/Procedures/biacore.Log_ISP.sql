IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Log_ISP') AND type = 'P ')
   DROP PROCEDURE biacore.Log_ISP
GO

-- primary procedure for adding new Log Events to table.
CREATE PROCEDURE biacore.Log_ISP
(	@TransactionId	uniqueidentifier	= null
,	@Date			datetime			= null
,	@Server			varchar(20)			= null
,	@UserID			varchar(10)			= null
,	@AppCode		varchar(25)			= null
,	@Level			varchar(15)			= null
,	@Event			varchar(250)		= null
,	@Detail			varchar(max)		= null
)
AS
BEGIN
	set nocount on;

	-- rate limiter to prevent somebody from looping excessively.
	declare @rate int
	select
		@rate = count(*)
	from 
		biacore.ApplicationLog
	where 1=1
		and AppCode = @AppCode
		and [Date] > dateadd(mi, -1, getutcdate())

	if (@rate > 600)
	begin
		set @rate = 0
		-- check if the limiter was hit in the last minute
		select
			@rate = count(*) 
		from 
			biacore.ApplicationLog
		where 1=1
			and AppCode = @AppCode
			and [Date] > dateadd(mi, -1, getutcdate())
			and [Level] = 'RateLimit'

		-- log the fact that rate limit was exceeded.
		if (@rate < 1)
		begin
			insert into biacore.ApplicationLog
			(	TransactionId
			,	[Date]
			,	[Server]
			,	UserID
			,	AppCode
			,	[Level]
			,	[Event]
			,	Detail
			)
			values
			(	'00000000-0000-0000-0000-000000000000'
			,	@Date
			,	@Server
			,	'Unknown'
			,	@AppCode
			,	'RateLimit'
			,	'BIACore Log Insert'
			,	'Messages lost due to exceeding message rate limit.'
			)
		end

		return
	end

	insert into biacore.ApplicationLog
	(	TransactionId
	,	[Date]
	,	[Server]
	,	UserID
	,	AppCode
	,	[Level]
	,	[Event]
	,	Detail
	)
	values
	(	@TransactionId
	,	@Date
	,	@Server
	,	@UserID
	,	@AppCode
	,	@Level
	,	@Event
	,	@Detail
	)
END
