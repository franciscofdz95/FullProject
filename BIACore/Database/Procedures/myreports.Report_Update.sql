IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Report_Update') AND type = 'P ')
   DROP PROCEDURE [myreports].[Report_Update]
GO

CREATE PROCEDURE [myreports].[Report_Update]
(	@debug			bit				= 0
,	@ReportId		int				= null
,	@Status			varchar(max)	= null
,	@Comments		varchar(max)	= null
,	@FileName		varchar(max)	= null
,	@FileType		varchar(max)	= null
) AS
BEGIN

update
	dbo.MyReportsCF
set
	[Status] = isnull(@Status, [Status])
,	StatusComments = isnull(@Comments, StatusComments)
,	BaseReportName = isnull(@FileName, BaseReportName)
,	OutputFormat = cast(isnull(@FileType, OutputFormat) as char(3))
,	DateProcessed = case 
		-- 'processing' started
		when DateProcessed is null and @Status in ('P') then getdate() 
		-- retrying, set processed back to null
		when @Status in ('Q') then null
		-- don't care
		else DateProcessed 
	end
,	DateComplete = case 
		when DateComplete is null and @Status in ('C', 'E') then getdate() 
		when @Status in ('Q') then null
		else DateComplete 
	end
where
	MyReportsId = @ReportId

END