create table myreports.Agents (
	AppCode			varchar(100)		not null
,	[Enabled]		bit					default(0)
,	ModifiedDate	datetime			not null
)
go

alter table myReports.Agents
	add primary key clustered (AppCode asc)
go

