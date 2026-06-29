create table sec.BIASecurity_Start
(	pid				int					not null
,	sessionId		uniqueidentifier	null
,	ad_id			varchar(16)			null
,	empId			varchar(15)			null
,	userId			varchar(50)			null
,	authenticatedid	varchar(50)			null
,	appCode			varchar(25)			null
,	appOnline		int					null
,	[status]		int					null
,	msg				varchar(max)		null
,	dt				datetime			not null		default(getutcdate())
)
