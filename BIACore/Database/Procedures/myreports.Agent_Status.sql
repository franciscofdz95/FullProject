IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Agent_Status') AND type = 'P ')
   DROP PROCEDURE [myreports].[Agent_Status]
GO

CREATE PROCEDURE [myreports].[Agent_Status]
(	@AppCode	varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

select
	[Enabled]
from
	myreports.Agents
where 1=1
	and AppCode = @AppCode

END
