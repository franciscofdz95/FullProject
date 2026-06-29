IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.fnLoginAs') AND type = 'FN')
   DROP FUNCTION sec.fnLoginAs
GO

--
-- return types and meaning
-- 0	authId is not allowed to login as userId for app
-- 1	authId is allowed to login as userId for app
--
CREATE FUNCTION sec.fnLoginAs
(	@userId				varchar(max)
,	@authId				varchar(max)
,	@appCode			varchar(max)
)
RETURNS int
AS
BEGIN
declare @result int
set @result = 0

select	@result = 1
from	dbo.BIASecurity_Users u 
join	dbo.BIASecurity_ApplicationUserGeos ug
	on	u.sysm = ug.sysm
where 1=1
	and u.sysm = @authId
	and u.isActive in ('Y', '1')
	and ug.AccessLevel = 'SA'
	and ((@appCode is not null and ug.application_code = @appCode)		-- Application SA
		or (ug.application_code = 'BIA_UserMaint')						-- User Maintenance SA
		or (@appCode is null and ug.application_code = 'BIA_UserMaint')) --

-- potentially add delegate support here?

return @result
END
