IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Report_Enqueue') AND type = 'P ')
   DROP PROCEDURE [myreports].[Report_Enqueue]
GO

CREATE PROCEDURE [myreports].[Report_Enqueue]
(	@debug			bit				= 0
,	@AppCode		varchar(max)	= null
,	@UserId			varchar(max)	= null

,	@ReportType		varchar(max)	= null
,	@Priority		int				= null
--,	@Status			varchar(max)	= null
--,	@Comments		varchar(max)	= null
,	@Description	varchar(max)	= null
,	@Parameters		varchar(max)	= null
--,	@FileName		varchar(max)	= null
--,	@FileType		varchar(max)	= null
) AS
BEGIN
set nocount on

declare @ReportId int

insert into
	dbo.MyReportsCF
(	ROXName
,	RACF
,	[Status]
,	ROIName
,	[Priority]
,	[Description]
,	DateEntry
,	ReportGroup
)
values
(	@AppCode
,	@UserId
,	'N'
,	@ReportType
,	@Priority
,	@Description
,	getdate()
,	@AppCode
)

select @ReportId = scope_identity()

if (@Parameters is not null)
	insert into
		dbo.MyReportsParamCF
	(	MyReportsID
	,	ParamName
	,	ParamValue
	)
	select
		@ReportId
	,	isnull(name, @AppCode)
	,	value
	from
		myreports.fnKvpListToTable(@Parameters, '||', '=')

END