This directory contains all of the features and functions pertinent to 
BIACore.dll and BIACore.js.

Client/
	This folder transformed into BIACore.js
	(see: /tools/compile.bat for details. It is referenced in the VS
	"post-build event command line" property).
Server/ contains all of the WebAPI routes used by both BIACore.dll and 
	BIACore.js when looking up sessions/users/applications.

We put all of this here (as opposed to embedding it in biacore.dll/biacore.js) 
	for the following reasons:

1.	BIACore.dll is included locally in other apps; when a change to the
	user/session/application structure/logic/connection information would need
	to be made, all other apps would have to recompile in order to accept that
	change. Instead, BIACore.dll is a "dumb pipe" that repeats whatever we
	send over the wire.

2.	Security information is kept out of the hands of client applications (and
	therefore client developers), giving "security" full control over structure
	and shape of security process.