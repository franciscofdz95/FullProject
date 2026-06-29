IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_Filter_Client') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_Filter_Client]
GO

-- Only used by Log Viewer.
CREATE PROCEDURE [biacore].[Security_Filter_Client]
(	@search		varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)
	set @match = '%' + @search + '%'

	select distinct
		Client as Id
	,	Client as Name
	from
		sec.BIASecurity_Log
	where
		(@search is null or Client like (@match))
	order by
		Name asc

END
