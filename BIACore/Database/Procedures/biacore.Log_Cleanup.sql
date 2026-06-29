IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('biacore.Log_Cleanup') AND type = 'P ')
   DROP PROCEDURE biacore.Log_Cleanup
GO

-- procedure for trimming log table
CREATE PROCEDURE biacore.Log_Cleanup
AS
BEGIN

	delete
	from
		biacore.ApplicationLog
	where
		[Date] <= dateadd(mm, -1, getutcdate())

	-- biacore.EmailLog deletes are cascaded from biacore.ApplicationLog

	delete
	from
		biacore.BrowserLog
	where
		[Date] <= dateadd(yy, -3, getutcdate())

	delete
	from
		biacore.VersionLog
	where
		[Date] <= dateadd(yy, -3, getutcdate())

	-- update indexes
	alter index ALL on biacore.ApplicationLog reorganize 
	alter index ALL on biacore.EmailLog reorganize
	alter index ALL on biacore.BrowserLog reorganize
	alter index ALL on biacore.VersionLog reorganize

	-- update statistics
	update statistics biacore.ApplicationLog
	update statistics biacore.EmailLog
	update statistics biacore.BrowserLog
	update statistics biacore.VersionLog
END
