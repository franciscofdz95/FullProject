CREATE TABLE sec.BIASecurity_Cache (
	UserId			varchar(50)			not null
,	[Hash]			varchar(128)		not null
,	[Date]			datetime			not null
)
GO

alter table sec.BIASecurity_Cache
	add primary key clustered (UserId asc)
go
