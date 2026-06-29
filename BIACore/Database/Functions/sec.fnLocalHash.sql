IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.fnLocalHash') AND type = 'FN')
   DROP FUNCTION sec.fnLocalHash
GO

CREATE FUNCTION sec.fnLocalHash
(	@userId				varchar(max)
)
RETURNS varchar(max)
AS
BEGIN
declare @result varchar(max)
set @result = null

;with localAuth as (
select
	hashbytes('sha1', cast(datepart(yyyy, getutcdate()) as varchar) 
		+ cast(datepart(wk, getutcdate()) as varchar) 
		+ lower(sysm) 
		+ [Password]) AS bin
from 
	dbo.BIASecurity_Users 
where 1=1
	and AD_ID is null
	and Emp_ID is null
	and isActive in ('Y', '1')
	and Lastactivity > dateadd(yy, -1, getutcdate())
	and sysm = @userId
)

select
	@result = CAST(N'' as xml).value('xs:base64Binary(xs:hexBinary(sql:column("bin")))', 'VARCHAR(MAX)')
from 
	localAuth

return @result
END
