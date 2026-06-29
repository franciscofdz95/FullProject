IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.fnColumnFilter') AND type = 'FN')
   DROP FUNCTION biacore.fnColumnFilter
GO

CREATE FUNCTION biacore.fnColumnFilter
(	@column				varchar(max)
,	@list				varchar(max)
)
RETURNS varchar(max)
AS
BEGIN
declare @result varchar(max)
set @result = ''

select @result = @result + ''',''' + id from biacore.fnListToTable(@list, ',')

if (len(@result) > 0) return ' AND ' + @column + ' in (''' + substring(@result, 4, len(@result) - 1) + ''')'

return @result
END
