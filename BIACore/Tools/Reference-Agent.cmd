@set AGENTSOURCE="../Reference/Agent"
@set AGENTDEPLOY="\\svrp000346ec\dev_root\Reference\BIACore\Agent"

@REM Deploy the Agent
if not exist %AGENTDEPLOY% mkdir %AGENTDEPLOY%
del /S /Q  %AGENTDEPLOY%\*.*
XCOPY %AGENTSOURCE% %AGENTDEPLOY% /S /H /Y /EXCLUDE:reference-excludes.txt

@pause