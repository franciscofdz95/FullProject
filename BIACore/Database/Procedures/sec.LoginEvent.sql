IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.LoginEvent') AND type = 'P ')
   DROP PROCEDURE [sec].[LoginEvent]
GO
CREATE PROCEDURE [sec].[LoginEvent]
(	@TransactionId	uniqueidentifier	= null
,	@Server			varchar(20)			= null
,	@Ip				varchar(15)			= null
,	@UserId			varchar(10)			= null
,	@TargetId		varchar(10)			= null
,	@LogDate		datetime			= null
,	@Event			varchar(20)			= null
,	@Detail			varchar(max)		= null
) AS
BEGIN
	SET NOCOUNT ON;

	insert into sec.BIASecurity_Log
	(	TransactionId
	,	[Server]
	,	Client
	,	UserId
	,	TargetId
	,	LogDate
	,	SqlDate
	,	[Event]
	,	Detail
	)
	values
	(	@TransactionId
	,	@Server
	,	@Ip
	,	@UserId
	,	@TargetId
	,	@LogDate
	,	getutcdate()
	,	@Event
	,	@Detail
	)

END
GO
