IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Log_Filter_UserId') AND type = 'P ')
   DROP PROCEDURE [biacore].[Log_Filter_UserId]
GO

-- Only used by Log Viewer.
CREATE PROCEDURE [biacore].[Log_Filter_UserId]
(	@search		varchar(max)	= null
,	@appCode	varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)
	set @match = '%' + @search + '%'

	select distinct
		UserId as Id
	,	UserId as Name
	from
		biacore.ApplicationLog
	where
		(@search is null or UserId like (@match))
		and AppCode in (
			select Id from biacore.fnListToTable(@appCode, ',')
		)
	order by
		Id asc
END
