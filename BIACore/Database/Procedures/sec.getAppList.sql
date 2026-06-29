IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.getAppList') AND type = 'P ')
   DROP PROCEDURE [sec].[getAppList]
GO

CREATE PROCEDURE [sec].[getAppList]
(	@userId			varchar(50)			= null
,	@level			varchar(max)		= 'Admin'
) AS 
BEGIN
	SET NOCOUNT ON;

select distinct
	application_code 
from
	biasecurity_applicationUser
where
	sysm = @userId
	and Security_Level in (
		select
			securityUserLevel_value
		from
			dbo.biasecurity_useraccesslevels
		where
			securityUserLevel_sort >= (
				select
					securityUserLevel_sort
				from
					dbo.biasecurity_useraccesslevels
				where
					securityUserLevel_value = @level
			)
		)

END
