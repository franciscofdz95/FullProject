IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('sec.getUser2') AND type = 'P ')
   DROP PROCEDURE sec.getUser2
GO

CREATE PROCEDURE sec.getUser2
(	@sessionId		uniqueidentifier	= null
,	@appCode		varchar(25)			= null
,	@userId			varchar(50)			= null
) AS 
BEGIN
	SET NOCOUNT ON;

	-- since this will probably be looked at alot, the select priority is:
	-- 1. SessionId and AppCode (UserId ignored)
	-- 2. SessionId (UserId ignored)
	-- 3. UserId (AppCode ignored)

	-- will return nothing in the following scenarios:
	-- bad SessionId
	-- SessionId and bad AppCode
	-- bad UserId
	-- no input

	select
		sysm						as [userId]
	,	BusinessUnit_ID				as [businessUnitId]
	,	Emp_ID						as [employeeId]
	,	AD_ID						as [adId]
	,	F_Name						as [firstName]
	,	L_Name						as [lastName]
	,	RegionType					as [regionType]
	,	Region						as [region]
	,	District					as [district]
	,	SLIC						as [slic]
	,	Department					as [department]
	,	Joblevel					as [jobLevel]
	,	Phone						as [phone]
	,	Email						as [email]
	,	LastUpdated					as [lastUpdated]
	,	Lastactivity				as [lastActivity]
	,	CreatedDT					as [createdDT]
	,	LoginCount					as [loginCount]
	,	isActive					as [userActive]
	-- session information does not belong on the user object.
	--,	active						as [sessionActive]
	--,	authenticatedId				as [authenticatedId]
	--,	F_Name						as [authenticatedFirstName]
	--,	L_Name						as [authenticatedLastName]
	,	inactiveReason				as [inactiveReason]
	,	enforceTimeoutNotification	as [enforceTimeoutNotification]
	,	deactivationDate			as [deactivationDate]
	from	dbo.BIASecurity_Users with (nolock)
	where
		sysm in (
			select top 1
				case
					when (@sessionId is not null and @appCode is not null) then ba.userId
					when (@sessionId is not null) then bc.userId
					else @userId
				end
			from		dbo.BIASecurity_Ctl_Session bc with (nolock)
			left join	dbo.BIASecurity_Ctl_SessionApplication ba with (nolock)
				on	bc.sessionId = ba.sessionId
			where
				(@sessionId is null or bc.sessionId = @sessionId)
				and (@appCode is null or ba.appCode = @appCode)
		)
END
