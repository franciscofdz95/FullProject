IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.ImpersonationSearch') AND type = 'P ')
   DROP PROCEDURE sec.ImpersonationSearch
GO

CREATE PROCEDURE sec.ImpersonationSearch
(	@sessionId		uniqueidentifier	= null
,	@appCode		varchar(25)			= null
,	@query			varchar(50)			= null
) AS 
BEGIN
	set nocount on;

	declare @search varchar(52)
	set @search = '%' + @query + '%'

	;with Impersonate as (
		select distinct top 10
			f.sysm as [userId]
		,	f.L_Name as [lastName]
		,	f.F_Name as [firstName]
		from	dbo.BIASecurity_Ctl_Session s
		join	dbo.BIASecurity_Users u					on u.sysm = s.authenticatedId
		join	dbo.BIASecurity_ApplicationUserGeos sa	on u.Sysm = sa.sysm
					and (application_code = 'BIA_UserMaint' or application_code = @appCode)
					and sa.AccessLevel = 'SA'
					and geoCode = 'CO'
		cross join dbo.BIASecurity_Users f
		where
			s.sessionId = @sessionId
			and s.active = 1
			and s.modified >= DATEADD(minute, -40, GETDATE())
			and (
				f.L_Name like @search
				or f.F_Name like @search
				or f.sysm like @search
				or f.AD_ID like @search
				or f.emp_Id like @search
				or f.L_Name + ' ' + f.F_Name like @search
				or f.F_Name + ' ' + f.L_Name like @search
			)
	),
	Delegate as (
	    select distinct top 10
			ip.Sysm as [userId]
		,	ip.L_Name as [lastName]
		,	ip.F_Name as [firstName]
		from	dbo.BIASecurity_Ctl_Session s
		join	dbo.BIASecurity_Users u			on u.sysm = s.authenticatedId
		join	dbo.BIASecurity_Delegates d		on u.sysm = d.sysm 
		join	dbo.BIASecurity_Users ip		on d.sysm_delegate = ip.sysm
    where
		s.sessionId = @sessionId
		and s.active = 1
		and s.modified >= DATEADD(minute, -40, GETDATE())
		and d.application_code = @appCode
		and (
			ip.L_Name like @search
			or ip.F_Name like @search
			or ip.sysm like @search
			or ip.AD_ID like @search
			or ip.emp_Id like @search
			or ip.L_Name + ' ' + ip.F_Name like @search
			or ip.F_Name + ' ' + ip.L_Name like @search
		)
	)

	-- so as not to overload the frontend, only return the top N records.
	select distinct top 10
		*
	from (
		select * from Impersonate
		union all
		select * from Delegate
	) list
	-- ensure that they had some sort of search
	where
		@query is not null and len(@query) > 0
END
