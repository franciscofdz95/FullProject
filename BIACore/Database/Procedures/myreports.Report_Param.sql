IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Report_Param') AND type = 'P ')
   DROP PROCEDURE [myreports].[Report_Param]
GO

CREATE PROCEDURE [myreports].[Report_Param]
(	@debug		bit				= 0
,	@ReportId	int				= null
) AS
BEGIN

select
	ParamValue as [Parameter]
from
	dbo.MyReportsParamCF
where
	MyReportsId = @ReportId

END