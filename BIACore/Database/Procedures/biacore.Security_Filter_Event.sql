IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_Filter_Event') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_Filter_Event]
GO

-- Only used by Log Viewer.
CREATE PROCEDURE [biacore].[Security_Filter_Event]
(	@search		varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)
	set @match = '%' + @search + '%'

	select distinct
		[Event] as Id
	,	[Event] as Name
	from
		sec.BIASecurity_Log
	where
		(@search is null or [Event] like (@match))
	order by
		Name asc

END
