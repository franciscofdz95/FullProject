IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.getUserList2') AND type = 'P ')
   DROP PROCEDURE [sec].[getUserList2]
GO

CREATE PROCEDURE [sec].[getUserList2]
(	@appCode		varchar(25)			= null
,	@level			varchar(max)		= null
,	@search			varchar(max)		= null
) AS 
BEGIN
	SET NOCOUNT ON;

	declare @match varchar(max)

set @match = '%' + @search + '%'

select
	u.sysm						as [userId]
,	u.AD_ID						as [adId]
,	u.Emp_ID					as [employeeId]
,	u.F_Name					as [firstName]
,	u.L_Name					as [lastName]
,	u.Email						as [email]
,	u.Phone						as [phone]
,	u.Department				as [department]
,	u.RegionType				as [regionType]
,	u.Region					as [region]
,	u.District					as [district]
,	u.Joblevel					as [jobLevel]
,	cast(case when a.Records > 1 then 1 else 0 end as bit)		as [multiple]
from
	dbo.BIASecurity_Users u
inner join
	(select
		sysm
	,	count(*) as [Records]
	from
		dbo.uvw_ApplicationUserGeoAccess
	where
		application_code = @AppCode
		and (@Level is null or AccessLevel = @Level)
	group by
		sysm
	) a
on	u.sysm = a.sysm
where
	(	@Search is null 
	or	u.sysm like @match
	or	u.F_Name like @match
	or	u.L_Name like @match
	)
order by
	lastName
,	firstName

END
