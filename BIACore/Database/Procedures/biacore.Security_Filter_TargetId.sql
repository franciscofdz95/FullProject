IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_Filter_TargetId') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_Filter_TargetId]
GO

-- Only used by Log Viewer.
CREATE PROCEDURE [biacore].[Security_Filter_TargetId]
(	@search		varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)
	set @match = '%' + @search + '%'

	select distinct
		TargetId as Id
	,	TargetId as Name
	from
		sec.BIASecurity_Log
	where
		len(TargetId) > 0
		and (@search is null or TargetId like (@match))
	order by
		Name asc

END
