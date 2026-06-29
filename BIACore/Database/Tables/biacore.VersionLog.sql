CREATE TABLE biacore.VersionLog (
	LogId			bigint				identity(1,1)
,	[Server]		varchar(max)		NOT NULL
,	AppCode			varchar(max)		NOT NULL
,	[Version]		varchar(max)		NOT NULL
,	[Date]			datetime			NOT NULL
)
GO

ALTER TABLE biacore.VersionLog
	ADD PRIMARY KEY CLUSTERED (LogId ASC)
GO
