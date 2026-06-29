IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Version_ISP') AND type = 'P ')
   DROP PROCEDURE biacore.Version_ISP
GO

-- primary procedure for adding new Log Events to table.
CREATE PROCEDURE biacore.Version_ISP
(	@Server			varchar(max)		= null
,	@AppCode		varchar(max)		= null
,	@Version		varchar(max)		= null
)
AS
BEGIN
	set nocount on;

	insert into biacore.VersionLog
	(	[Server]
	,	AppCode
	,	[Version]
	,	[Date]
	)
	values
	(	@Server	
	,	@AppCode
	,	@Version
	,	getdate()
	)
END
