IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Filter_Type') AND type = 'P ')
   DROP PROCEDURE [myreports].[Filter_Type]
GO

CREATE PROCEDURE [myreports].[Filter_Type]
(	@search		varchar(max)	= null
,	@UserId		varchar(max)	= null
,	@AppCode	varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)
	set @match = '%' + @search + '%'

select distinct
	ROIName [Id]
,	ROIName [Name]
from
	dbo.MyReportsCF
where 1=1
	and ROXName = @AppCode
	and (@UserId is null or RACF = @UserId)
	and (@search is null or ROIName like (@match))

END
