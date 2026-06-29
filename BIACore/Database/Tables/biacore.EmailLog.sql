CREATE TABLE biacore.EmailLog (
	LogId			bigint				not null
,	Recipients		varchar(max)			not null
,	[Date]			datetime			not null
)
GO

ALTER TABLE biacore.EmailLog 
	ADD CONSTRAINT fk_LogId 
	FOREIGN KEY (LogId) 
	REFERENCES biacore.ApplicationLog (LogId)
	ON DELETE CASCADE
GO

CREATE INDEX IX_LogId			ON biacore.EmailLog (UserId)