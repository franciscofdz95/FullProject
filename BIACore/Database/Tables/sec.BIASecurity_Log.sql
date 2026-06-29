CREATE TABLE sec.BIASecurity_Log (
	LogId			bigint				identity(1,1)
,	TransactionId	uniqueidentifier	not null
,	[Server]		varchar(20)			not null
,	Client			varchar(15)			not null
,	UserId			varchar(10)			not null
,	TargetId		varchar(10)			null
,	LogDate			datetime			not null
,	SqlDate			datetime			not null
,	[Event]			varchar(20)			not null
,	Detail			varchar(max)		not null
)
GO

alter table sec.BIASecurity_Log
	add primary key clustered (LogId asc)
go
