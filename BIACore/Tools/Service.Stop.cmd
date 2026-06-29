@SET SERVER=%1
@SET SVCNAME=%2

@REM stop the running service.
:STOP_SVC
@echo Stopping Service %SVCNAME% on %SERVER%
@sc %SERVER% query "%SVCNAME%" | find "STATE" | find "RUNNING" >nul
@if errorlevel 1 GOTO :DONE

@sc %SERVER% stop "%SVCNAME%" >nul
:STOP_SVC_WAIT
@echo .
@ping 127.0.0.1 -n 5 -w 1000 > nul
@sc %SERVER% query "%SVCNAME%" | find "STATE" | find "STOPPED" >nul
@if errorlevel 1 GOTO :STOP_SVC_WAIT
@echo Service Stopped %SVCNAME% on %SERVER%

:DONE