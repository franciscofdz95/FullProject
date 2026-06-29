IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.LoginCache') AND type = 'P ')
   DROP PROCEDURE [sec].[LoginCache]
GO
CREATE PROCEDURE [sec].[LoginCache]
(	@userId		varchar(50)		= null
,	@hash		varchar(128)	= null
,	@ip			varchar(15)		= null
) AS
BEGIN
	SET NOCOUNT ON;

	-- 'expire' any old entries
	delete from sec.BIASecurity_Cache where UserId = @userId

	-- insert the new authoritative entry
	insert into sec.BIASecurity_Cache
	(	UserId
	,	[Hash]
	,	[Date]
	)
	values
	(	@userId
	,	@hash
	,	getutcdate()
	)

END
GO
