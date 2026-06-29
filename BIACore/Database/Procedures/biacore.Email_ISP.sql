IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Email_ISP') AND type = 'P ')
   DROP PROCEDURE [biacore].[Email_ISP]
GO

-- primary procedure for adding new Log Events to table.
CREATE PROCEDURE [biacore].[Email_ISP]
(	@Recipients			varchar(max)	= null
,	@LogIds				varchar(max)	= null
)
AS
BEGIN
	set nocount on;

	insert into biacore.EmailLog
	(	LogId
	,	Recipients
	,	[Date]
	)
	select
		id
	,	@Recipients
	,	getutcdate()
	from
		biacore.fnListToTable(@LogIds, ',')
	where
		-- prevent duplicate insertions.
		id not in (select LogId from biacore.EmailLog)

END
