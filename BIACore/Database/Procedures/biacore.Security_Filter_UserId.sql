IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Security_Filter_UserId') AND type = 'P ')
   DROP PROCEDURE [biacore].[Security_Filter_UserId]
GO

-- Only used by Log Viewer.
CREATE PROCEDURE [biacore].[Security_Filter_UserId]
(	@search		varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)
	set @match = '%' + @search + '%'

	select distinct
		UserId as Id
	,	UserId as Name
	from
		sec.BIASecurity_Log
	where
		len(UserId) > 0
		and (@search is null or UserId like (@match))
	order by
		Name asc

END
