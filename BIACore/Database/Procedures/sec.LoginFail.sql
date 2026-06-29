IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.LoginFail') AND type = 'P ')
   DROP PROCEDURE [sec].[LoginFail]
GO
CREATE PROCEDURE [sec].[LoginFail]
(	@userId		varchar(50)		= null
,	@ip			varchar(15)		= null
) AS
BEGIN
	SET NOCOUNT ON;

	insert into sec.BIASecurity_Fail
	(	UserId
	,	[Date]
	)
	values
	(	@userId
	,	getutcdate()
	)

	declare @count int
	select @count = count(*) from sec.BIASecurity_Fail where UserId = @userId

	select
		case
			when @count < 3 then 'Login failed: Attempt ' + cast(@count + 1 as varchar) + ' out of 3 before 15 minute lockout.'
			when @count = 3 then 'Login failed: Account locked out for 15 minutes.'
			when @count < 6 then 'Login failed: Attempt ' + cast(@count + 1 as varchar) + ' out of 6 before 2 hour lockout.'
			when @count = 6 then 'Login failed: Account locked out for 2 hours.'
			else 'Login failed, exceeded fail attempts.'
		end [Message]
	,	case 
			when @count = 3 then 900
			when @count = 6 then 7200
			else 0
		end [Timeout]
	from
		sec.BIASecurity_Fail
	where
		UserId = @userId

END
GO
