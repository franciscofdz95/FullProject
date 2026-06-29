IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.Logout') AND type = 'P ')
   DROP PROCEDURE [sec].[Logout]
GO

CREATE PROCEDURE [sec].[Logout]
(	@sessionId	uniqueidentifier	= null
,	@ip			varchar(15)		= null
,	@env		varchar(6)		= null
) AS
BEGIN
	SET NOCOUNT ON;

	/* mark status as logged out */
	delete from dbo.BIASecurity_Ctl_Session	where SessionId = @sessionId
	delete from dbo.BIASecurity_Ctl_SessionApplication where SessionId = @sessionId

END
GO
