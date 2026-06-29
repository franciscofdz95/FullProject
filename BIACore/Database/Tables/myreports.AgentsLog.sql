create table myreports.AgentsLog (
	LogId			bigint				identity(1,1)
,	UserId			varchar(max)		not null
,	AppCode			varchar(100)		not null
,	[Enabled]		bit					default(0)
,	ModifiedDate	datetime			not null
)
go

alter table myreports.AgentsLog
	add primary key clustered (LogId asc)
go
