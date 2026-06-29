IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Browser_ISP') AND type = 'P ')
   DROP PROCEDURE [biacore].[Browser_ISP]
GO

-- primary procedure for tracking application browser statistics
CREATE PROCEDURE [biacore].[Browser_ISP]
(	@UserId			varchar(max)		= null
,	@AppCode		varchar(max)		= null
,	@Browser		varchar(max)		= null
)
AS
BEGIN
	set nocount on;

	if (@UserId = 'Unknown' or @AppCode = '') return;

	insert into biacore.BrowserLog
	(	UserId
	,	AppCode
	,	Browser
	,	[Date]
	)
	values
	(	@UserId	
	,	@AppCode
	,	@Browser
	,	getutcdate()
	)
END
