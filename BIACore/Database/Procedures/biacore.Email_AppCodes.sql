IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Email_AppCodes') AND type = 'P ')
   DROP PROCEDURE [biacore].[Email_AppCodes]
GO

CREATE PROCEDURE [biacore].[Email_AppCodes]
AS
BEGIN
	set nocount on;

select
	a.AppCode 
from
	biacore.ApplicationLog a
left join
	biacore.EmailLog e
on	a.LogId = e.LogId
where 1=1
	and a.[Level] in ('Error', 'Exception')
	and e.LogId is null
group by
	a.AppCode

END
