IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('myreports.fnListToTable') AND type = 'TF')
   DROP FUNCTION [myreports].[fnListToTable]
GO

CREATE FUNCTION [myreports].[fnListToTable]
(	@list			varchar(max)
,	@delim			varchar(max)
)
RETURNS @results TABLE (id varchar(max))
AS
BEGIN
	declare @tempResults table (id varchar(max))
	declare @text varchar(max), @value varchar(max)
	select @text = @delim + @list, @value = ''

	while (len(@text) > 0)
	begin
		select	@value = case
					when (charindex(@delim, @text) = 0) then @text
					--when (charindex('"', @text) < charindex(@delim, @text)) then -- quoted string?
					else left(@text, charindex(@delim, @text) - 1) 
				end
			,	@text = case
					when (charindex(@delim, @text) = 0) then null
					--when (charindex('"', @text) < charindex(@delim, @text)) then -- quoted string?
					else right(@text, len(@text) - charindex(@delim, @text) - (len(@delim) - 1))
				end
		insert @tempResults select @value where len(@value) > 0
	end

	insert @results select distinct id from @tempResults
	return
END
