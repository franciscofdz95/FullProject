@set WEBSOURCE="../Reference/Web"
@set WEBDEPLOY="\\svrp000346ec\dev_root\Reference\BIACore\2.0"
@set AGENTSOURCE="../Reference/Agent"
@set AGENTDEPLOY="\\svrp000346ec\dev_root\Reference\BIACore\Agent"

@REM Deploy the Web
if not exist %WEBDEPLOY% mkdir %WEBDEPLOY%
del /S /Q  %WEBDEPLOY%\*.*
XCOPY %WEBSOURCE% %WEBDEPLOY% /S /H /Y /EXCLUDE:reference-excludes.txt

@echo %ERRORLEVEL%

@REM Deploy the Agent
if not exist %AGENTDEPLOY% mkdir %AGENTDEPLOY%
del /S /Q  %AGENTDEPLOY%\*.*
XCOPY %AGENTSOURCE% %AGENTDEPLOY% /S /H /Y /EXCLUDE:reference-excludes.txt

@pause