@SET SERVER=%1
@SET SVCNAME=%2
@SET SOURCEPATH=%3
@SET DEPLOYPATH=%4

@REM deploy the updated binaries.
@ECHO Deploying %SVCNAME% to %SERVER% at %DEPLOYPATH%
if not exist %DEPLOYPATH% mkdir %DEPLOYPATH%
del /S /Q  %DEPLOYPATH%\*.*
XCOPY %SOURCEPATH% %DEPLOYPATH% /S /H /Y /EXCLUDE:deploy-excludes.txt
