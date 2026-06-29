IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Email_Digest') AND type = 'P ')
   DROP PROCEDURE [biacore].[Email_Digest]
GO

CREATE PROCEDURE [biacore].[Email_Digest]
(	@debug		bit				= 0
,	@AppCode	varchar(max)	= null
) AS
BEGIN
	set nocount on;

with pager as (select row_number() over (order by LogId asc) ROWNUMBER, * from (
	select
		a.LogId
	,	a.TransactionId
	,	a.AppCode
	,	a.UserId
	,	a.[Date]
	,	a.[Server]
	,	a.[Level]
	,	cast(a.Detail as varchar(140)) + case when len(a.Detail) > 140 then '...' else '' end [Detail]
	from
		biacore.ApplicationLog a
	left join
		biacore.EmailLog e
	on	a.LogId = e.LogId
	where 1=1
		and a.AppCode = @AppCode
		and a.[Level] in ('Exception', 'Error')
		and e.LogId is null
) x )

select * from pager where ROWNUMBER > 0 and ROWNUMBER < 100

END
