IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Filter_User') AND type = 'P ')
   DROP PROCEDURE [myreports].[Filter_User]
GO

CREATE PROCEDURE [myreports].[Filter_User]
(	@search		varchar(max)	= null
,	@UserId		varchar(max)	= null
,	@AppCode	varchar(max)	= null
) AS
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)
	set @match = '%' + @search + '%'

select distinct
	RACF [Id]
,	RACF [Name]
from
	dbo.MyReportsCF
where 1=1
	and ROXName = @AppCode
	and (@UserId is null or RACF = @UserId)
	and (@search is null or RACF like (@match))
	and RACF is not null

END
