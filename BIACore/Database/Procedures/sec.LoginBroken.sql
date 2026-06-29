IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.LoginBroken') AND type = 'P ')
   DROP PROCEDURE [sec].[LoginBroken]
GO

CREATE PROCEDURE [sec].[LoginBroken]
(	@sessionId		varchar(max)		= null
,	@ip				varchar(15)			= null
,	@env			varchar(6)			= null
) AS
BEGIN
	SET NOCOUNT ON;

-- we use having because the server considers any result to be 'broken'.
-- this way we control the 'broken' state through stored procedure, and don't
-- require a web service update.

	select
		count(LogId) as [Broken]
	from 
		sec.BIASecurity_Log
	where 1=1
		and UserId in (select userId from dbo.BIASecurity_Ctl_Session where sessionId = @sessionId)
		and [Event] = 'Active'
		and Client = @ip
		and SqlDate > dateadd(mi, -1, getutcdate())
	having
		count(LogId) > 4

END
GO
