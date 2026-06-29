IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Report_ById') AND type = 'P ')
   DROP PROCEDURE [myreports].[Report_ById]
GO

CREATE PROCEDURE [myreports].[Report_ById]
(	@debug		bit				= 0
-- filters
,	@ReportId	int				= null
) AS
BEGIN

select
	MyReportsId [ReportId]
,	case when DateComplete is null then DateEntry else DateComplete end [Date]
,	RACF [UserId]
,	ROIName [ReportType]
,	[Description]
,	[Priority]
,	[Status]
,	StatusComments [Comments]
,	BaseReportName [FileName]
,	OutputFormat [FileType]
from
	dbo.MyReportsCF
where
	MyReportsId = @ReportId

END