IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Log_Filter_Event') AND type = 'P ')
   DROP PROCEDURE [biacore].[Log_Filter_Event]
GO

-- Only used by Log Viewer.
CREATE PROCEDURE [biacore].[Log_Filter_Event]
(	@search		varchar(max)	= null
,	@appCode	varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)
	set @match = '%' + @search + '%'

	select distinct
		[Event] as Id
	,	[Event] as Name
	from
		biacore.ApplicationLog
	where
		(@search is null or [Event] like (@match))
		and AppCode in (
			select Id from biacore.fnListToTable(@appCode, ',')
		)
END
