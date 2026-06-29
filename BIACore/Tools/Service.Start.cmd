@SET SERVER=%1
@SET SVCNAME=%2

@REM start the stopped service.
:START_SVC
@echo Starting Service %SVCNAME% on %SERVER%
@sc %SERVER% start "%SVCNAME%" > nul
:START_SVC_WAIT
@echo .
@ping 127.0.0.1 -n 5 -w 1000 > nul
@sc %SERVER% query "%SVCNAME%" | find "STATE" | find "RUNNING" >nul
@if errorlevel 1 GOTO :START_SVC_WAIT
@echo Service Started %SVCNAME% on %SERVER%

