CREATE TABLE biacore.ApplicationLog (
	LogId			bigint				identity(1,1)
,	TransactionId	uniqueidentifier	NOT NULL
,	[Date]			datetime			NOT NULL
,	[Server]		varchar(20)			NOT NULL
,	UserId			varchar(10)			NOT NULL
,	AppCode			varchar(10)			NOT NULL
,	[Level]			varchar(15)			NOT NULL
,	[Event]			varchar(250)		NULL
,	Detail			varchar(max)		NULL
)
GO

ALTER TABLE biacore.ApplicationLog
	ADD PRIMARY KEY CLUSTERED (LogId ASC)
GO

CREATE INDEX IX_TransactionId	ON biacore.ApplicationLog (TransactionId)
CREATE INDEX IX_Date			ON biacore.ApplicationLog ([Date])
CREATE INDEX IX_AppCode			ON biacore.ApplicationLog (AppCode)
CREATE INDEX IX_UserId			ON biacore.ApplicationLog (UserId)
CREATE INDEX IX_Level			ON biacore.ApplicationLog ([Level])