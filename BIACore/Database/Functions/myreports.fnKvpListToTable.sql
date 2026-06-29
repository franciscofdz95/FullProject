IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.fnKvpListToTable') AND type = 'TF')
   DROP FUNCTION [myreports].[fnKvpListToTable]
GO

CREATE FUNCTION [myreports].[fnKvpListToTable]
(	@list			varchar(max)
,	@list_delim		varchar(max)
,	@kvp_delim		varchar(max)
)
RETURNS @results TABLE (name varchar(max), value varchar(max))
AS
BEGIN
	declare @tempResults table (name varchar(max), value varchar(max))
	declare @l_text varchar(max), @kvp_text varchar(max)

	declare @text varchar(max), @value varchar(max)
	select @l_text = @list_delim + @list, @value = ''

	while (len(@l_text) > 0)
	begin
		select	@kvp_text = case
					when (charindex(@list_delim, @l_text) = 0) then @l_text
					--when (charindex('"', @text) < charindex(@delim, @text)) then -- quoted string?
					else left(@l_text, charindex(@list_delim, @l_text) - 1) 
				end
			,	@l_text = case
					when (charindex(@list_delim, @l_text) = 0) then null
					--when (charindex('"', @text) < charindex(@delim, @text)) then -- quoted string?
					else right(@l_text, len(@l_text) - charindex(@list_delim, @l_text) - (len(@list_delim) - 1))
				end
		insert @tempResults (name, value)
		select
			case when (charindex(@kvp_delim, @kvp_text) = 0) then null
				else left(@kvp_text, charindex(@kvp_delim, @kvp_text) - 1) end
		,	case when (charindex(@kvp_delim, @kvp_text) = 0) then @kvp_text
				else right(@kvp_text, len(@kvp_text) - charindex(@kvp_delim, @kvp_text) - (len(@kvp_delim) - 1)) end
		where
			len(@kvp_text) > 0
	end

	insert @results select distinct name, value from @tempResults
	return
END
