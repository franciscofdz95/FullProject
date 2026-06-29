@set WEBSOURCE="../Reference/Web"
@set WEBDEPLOY="\\svrp000346ec\dev_root\Reference\BIACore\2.0"

@REM Deploy the Web
if not exist %WEBDEPLOY% mkdir %WEBDEPLOY%
del /S /Q  %WEBDEPLOY%\*.*
XCOPY %WEBSOURCE% %WEBDEPLOY% /S /H /Y /EXCLUDE:reference-excludes.txt

@pause