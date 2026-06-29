IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.Agent_Update') AND type = 'P ')
   DROP PROCEDURE [myreports].[Agent_Update]
GO

CREATE PROCEDURE [myreports].[Agent_Update]
(	@UserId		varchar(max)	= null
,	@AppCode	varchar(max)	= null
,	@Enabled	bit				= 0
) AS
BEGIN
	SET NOCOUNT ON;

declare @date datetime
set @date = getutcdate()

update
	myreports.Agents
set
	[Enabled] = @Enabled
,	ModifiedDate = @date
where
	AppCode = @AppCode

if (@@rowcount = 0)
insert into myreports.Agents
(	AppCode
,	[Enabled]
,	ModifiedDate
)
values
(	@AppCode
,	@Enabled
,	@date
)

insert into myreports.AgentsLog
(	UserId
,	AppCode
,	[Enabled]
,	ModifiedDate
)
values
(	@UserId
,	@AppCode
,	@Enabled
,	@date
)

END
