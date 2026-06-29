IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Log_Filter_Level') AND type = 'P ')
   DROP PROCEDURE [biacore].[Log_Filter_Level]
GO

-- Only used by Log Viewer.
CREATE PROCEDURE [biacore].[Log_Filter_Level]
(	@search		varchar(max)	= null
,	@appCode	varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)
	set @match = '%' + @search + '%'

	select distinct
		[Level] as Id
	,	[Level] as Name
	from
		biacore.ApplicationLog
	where
		(@search is null or [Level] like (@match))
		and AppCode in (
			select Id from biacore.fnListToTable(@appCode, ',')
		)
END
