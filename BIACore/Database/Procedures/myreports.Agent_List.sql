IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Agent_List') AND type = 'P ')
   DROP PROCEDURE [myreports].[Agent_List]
GO

CREATE PROCEDURE [myreports].[Agent_List]
AS
BEGIN
	SET NOCOUNT ON;

select distinct 
	AppCode 
from
	myreports.Agents

END
