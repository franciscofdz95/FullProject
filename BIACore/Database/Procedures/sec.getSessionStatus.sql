IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.getSessionStatus') AND type = 'P ')
   DROP PROCEDURE sec.getSessionStatus
GO

/*
=================================================================================================================
 Author:		Matthew Erdmann
 Create date:	10/25/2013 09:28
 Description:	Security getSessionStatus Stored Procedure, used by new .NET and ExtJS, jQuery applications

exec sec.getSessionStatus '64ddcc33-d63c-e311-9dd4-002655312d2e', 'Sales_Funnel'

 Return Query Options:
	appOnline	status		msg									detail
	0			0			No Session							Session record does not exist, redirect user to login!
	0			0			App Timeout							Application timeout, redirect to login!
	1			1			User Inactive						User is set to Inactive
	0			0			Application Inactive				Application is set to Inactive
	0			1			Application Inactive/User Exception	Application is set to Inactive, but User has an Exception entry.
	1			1			Session Updated						Session and SessionApplication records updated, user is authenticated.
	0			0			No SessionApplication				SessionApplication record does not exist and past timeout, redirect user to login!
	1			0			No App Permission					SessionApplication record does not exist user does not have permission to this application!

 History
	10/25/2013 09:28 (adm1mme) Created

=================================================================================================================
*/

CREATE PROCEDURE sec.getSessionStatus
(	@sessionId		uniqueidentifier
,	@appCode		varchar(50)
) AS
BEGIN
	SET NOCOUNT ON;

	select
		cast(sa.active as int) as [status]
	,	datediff(mi, getdate(),
			dateadd(dd, an.TimeoutDays,
				dateadd(hh, an.TimeoutHours,
					dateadd(mi, an.TimeoutMinutes, sa.modified)
				)
			)
		) as [minutesRemaining]
	from
		dbo.BIASecurity_Ctl_SessionApplication (nolock) sa
	inner join
		dbo.BIASecurity_ApplicationName (nolock) an
	on	sa.appCode = an.Application_Code
	where 1=1
		and sa.sessionId = @sessionId
		and sa.appCode = @appCode
END
