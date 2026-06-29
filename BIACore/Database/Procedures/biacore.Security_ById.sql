IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_ById') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_ById]
GO

CREATE PROCEDURE [biacore].[Security_ById]
(	@LogId			varchar(max)	= null
)
AS
BEGIN
set nocount on;

select
	LogId
,	TransactionId
,	[Server]
,	Client
,	UserId
,	TargetId
,	LogDate
,	SqlDate
,	[Event]
,	Detail
from
	sec.BIASecurity_Log
where
	LogId = @LogId

END
