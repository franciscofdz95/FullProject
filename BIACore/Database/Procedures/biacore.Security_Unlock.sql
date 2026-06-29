IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_Unlock') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_Unlock]
GO

CREATE PROCEDURE [biacore].[Security_Unlock]
(	@UserId			varchar(max)	= null
)
AS
BEGIN
set nocount on;

delete from sec.BIASecurity_Fail where UserId = @UserId

END
