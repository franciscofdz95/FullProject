CREATE TABLE biacore.BrowserLog (
	LogId			bigint				identity(1,1)
,	[Date]			datetime			NOT NULL
,	UserId			varchar(15)			NOT NULL
,	AppCode			varchar(15)			NOT NULL
,	Browser			varchar(30)			NOT NULL
)
GO

ALTER TABLE biacore.BrowserLog
	ADD PRIMARY KEY CLUSTERED (LogId ASC)
GO

CREATE INDEX IX_Date			ON biacore.BrowserLog ([Date])
CREATE INDEX IX_AppCode			ON biacore.BrowserLog (AppCode)
CREATE INDEX IX_UserId			ON biacore.BrowserLog (UserId)
CREATE INDEX IX_Browser			ON biacore.BrowserLog (Browser)