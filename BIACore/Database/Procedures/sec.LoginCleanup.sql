IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.LoginCleanup') AND type = 'P ')
   DROP PROCEDURE [sec].[LoginCleanup]
GO

CREATE PROCEDURE [sec].[LoginCleanup]
AS
BEGIN
	SET NOCOUNT ON;

	-- expire old cache entries
	delete from sec.BIASecurity_Cache where [Date] < dateadd(dd, -1, getutcdate())

	-- 
	delete from sec.BIASecurity_Fail where [Date] < dateadd(dd, -1, getutcdate())

END
GO
