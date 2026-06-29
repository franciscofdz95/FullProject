IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Report_Delete') AND type = 'P ')
   DROP PROCEDURE [myreports].[Report_Delete]
GO

CREATE PROCEDURE [myreports].[Report_Delete]
(	@debug		bit				= 0
,	@ReportId	int				= null
,	@UserId		varchar(max)	= null
) AS
BEGIN

delete from dbo.MyReportsCF
where MyReportsId = @ReportId

delete from dbo.MyReportsParamCF
where MyReportsID = @ReportId

END