IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.LoginCheck') AND type = 'P ')
   DROP PROCEDURE [sec].[LoginCheck]
GO
/*
AuthResult
Error	= -1
Failure = 0
Success = 1
NoData	= 2
LockOut = 3

Expected from this SP:
	0 non-authoritative hash failure
	1 success
	2 no data to verify against
	3 user has exceeded lockout quota (with time remaining)
*/
CREATE PROCEDURE [sec].[LoginCheck]
(	@userId		varchar(50)		= null
,	@hash		varchar(128)	= null
,	@ip			varchar(15)		= null
) AS
BEGIN
	SET NOCOUNT ON;

	-- lockout test
	declare @count int, @timeout int
	select @count = count(UserId) from sec.BIASecurity_Fail where UserId = @userId

	if (@count >= 6)
		-- in a 2 hour lockout
		select @timeout = 7200 - datediff(s, max([Date]), getutcdate())
		from sec.BIASecurity_Fail 
		where UserId = @userId
	else if (@count >= 3)
		-- in a 15 minute lockout
		select @timeout = 900 - datediff(s, max([Date]), getutcdate())
		from sec.BIASecurity_Fail 
		where UserId = @userId

	-- lockout is supposed to be 15 minutes, 2 hours, 15 minutes, 2 hours, etc..
	if (@count >= 6 and @timeout <= 0) -- they have served their 2 hour timeout, reset the counter.
		delete from sec.BIASecurity_Fail where UserId = @userId
	else if (@timeout > 0)
		select	@timeout [Timeout]
		, 3 [AuthResult]
		, 'Account locked out' [Message]

	-- cache test
	declare @cache int
	set @cache = 2 -- no data
	select
		@cache = case 
			when [Hash] = @hash then 1 -- success
			else 0 -- "fail"
		end
	from
		sec.BIASecurity_Cache
	where
		UserId = @userId
		and [Date] > dateadd(hh, -8, getutcdate())

	-- static account test
	if (@cache = 2)
		select @cache = case when @hash = sec.fnLocalHash(@userId) then 1 else 2 end

	select 0 [Timeout], @cache [AuthResult]

END
GO
