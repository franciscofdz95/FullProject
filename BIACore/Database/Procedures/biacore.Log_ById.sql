IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Log_ById') AND type = 'P ')
   DROP PROCEDURE [biacore].[Log_ById]
GO

CREATE PROCEDURE [biacore].[Log_ById]
(	@LogId		varchar(max)	= null
)
AS
BEGIN
set nocount on;

select
	LogId
,	TransactionId
,	[Date]
,	[Server]
,	UserId
,	AppCode
,	[Level]
,	[Event]
,	Detail
from
	biacore.ApplicationLog
where
	LogId = @LogId

END
