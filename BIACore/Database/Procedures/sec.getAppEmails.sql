IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.getAppEmails') AND type = 'P ')
   DROP PROCEDURE sec.getAppEmails
GO

CREATE PROCEDURE sec.getAppEmails
(	@AppCode	varchar(max)		= null
)
AS
BEGIN
set nocount on;

select
	u.Email
from 
	dbo.BIASecurity_ErrorEmail e
inner join
	dbo.BIASecurity_Users u
on	e.sysm = u.sysm
where 1=1
	and e.Application_Code = @AppCode

END
