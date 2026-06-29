@echo off
setlocal ENABLEDELAYEDEXPANSION

set base=%1
set tools=%2
set biacore=%base%\BIACore.js
set biacoretmp=%base%\BIACore_tmp.js
set biaextjs=%base%\BIACore.Ext.js
set biaextcss=%base%\BIACore.Ext.css

set biacoremin=%biacore:~0,-2%min.js
set biaextjsmin=%biaextjs:~0,-2%min.js

set t=%time: =0%
set d=%date: =0%
set year=%d:~10%
set month=%d:~4,2%
set date=%d:~7,2%
set time=%t:~0,2%%t:~3,2%
set version=%d:~10%%d:~4,2%%d:~7,2%%t:~0,2%%t:~3,2%
@echo Generated version number %version%

@echo Generate %biacore%
"%tools%\bindle.exe" "%base%\BIACore" "*.js" "%biacore%"
REM echo BIACore.Config.version = %version%; >> %biacore%
echo BIABuild = { version: %version% }; > %biacoretmp%
type %biacore% >> %biacoretmp%
type %biacoretmp% > %biacore%
del %biacoretmp%

@echo Generate %biaextjs%
"%tools%\bindle.exe" "%base%\BIAExt" "*.js" "%biaextjs%"

@echo Generate %biaextcss%
"%tools%\bindle.exe" "%base%\BIAExt" "*.css" "%biaextcss%"

@echo JSMin ^< %biacore% ^> %biacoremin%
"%tools%\jsmin.exe" < "%biacore%" > "%biacoremin%"

@echo JSMin ^< %biaextjs% ^> %biaextjsmin%
"%tools%\jsmin.exe" < "%biaextjs%" > "%biaextjsmin%"
