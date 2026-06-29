IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.fnUserAccess') AND type = 'FN')
   DROP FUNCTION sec.fnUserAccess
GO

--
-- return types and meaning
-- 0	No Access
-- 1	User Access, App Online
-- 2	User Access, App Offline
-- 3	User Offline Exempt, App Offline
--
CREATE FUNCTION sec.fnUserAccess
(	@userId				varchar(max)
,	@appCode			varchar(max)
)
RETURNS int
AS
BEGIN
declare @result int
set @result = 0

if (exists(select sysm from dbo.BIASecurity_ApplicationUser where sysm = @userId and application_code = @appCode and Active = 'Y'))
begin -- access
	if (exists(select Application_Code from dbo.BIASecurity_ApplicationName where Application_Code = @appCode and Active = 'Y'))
	begin -- online, access
		set @result = 1
	end	-- online, access
	else
	begin -- offline
		if (exists(select sysm from dbo.BIASecurity_ApplicationOfflineUsers where application_code = @appCode and sysm = @userId))
		begin -- offline, exempt
			set @result = 3
		end -- offline, exempt
		else
		begin -- offline, not exempt
			set @result = 2
		end -- offline, not exempt
	end	-- offline
end -- access
else
begin -- no access
	set @result = 0
end -- no access

return @result
END
