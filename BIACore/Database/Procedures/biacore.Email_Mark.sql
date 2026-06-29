IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Email_Mark') AND type = 'P ')
   DROP PROCEDURE [biacore].[Email_Mark]
GO

CREATE PROCEDURE [biacore].[Email_Mark]
(	@AppCode		varchar(max)	= null
,	@Recipients		varchar(max)	= null
) AS
BEGIN
	set nocount on;

insert into
	biacore.EmailLog
(	LogId
,	Recipients
,	[Date]
)
select 
	a.LogId
,	@Recipients
,	getutcdate()
from
	biacore.ApplicationLog a
left join
	biacore.EmailLog e
on	a.LogId = e.LogId
where 1=1
	and a.[Level] in ('Error', 'Exception')
	and a.AppCode = @AppCode
	and e.LogId is null

END
