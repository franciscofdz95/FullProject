IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_Logout') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_Logout]
GO

CREATE PROCEDURE [biacore].[Security_Logout]
(	@SessionId			uniqueidentifier	= null
)
AS
BEGIN
set nocount on;



END
