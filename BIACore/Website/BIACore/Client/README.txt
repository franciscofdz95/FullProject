Client/
	This folder defines the client side BIACore.js. It is constructed from
	a bunch of pseudo-class like files in it's sub-folders. Descriptions
	to follow.

Client/Config
	The chosen config does 2 things,
		1) Define the global BIACore variable
		2) Define the location of the target web services
	At the moment, there are only 2 configs; RC and Everybody Else.
	RC is intended as a private development area where you can develop
	changes and break things at will without affecting other developers on
	DEV.

Client/Base
	This folder contains the "Base" attributes attached to the global 
	BIACore variable. Order is somewhat sensitive; for example the globally
	used BIACore.apply is defined in Base.

Client/BIACore
	This folder contains the "meat" of BIACore. Everything here can be added
	in pretty much whatever order you want it to be; the point is that there
	are no cross dependencies if you follow the currently defined convention
	for class definition.

Client/Final
	This folder contains any "Post" type events. At the moment it only
	contains 1 file, Startup.js, which is used to actually start the entire
	BIACore system. You can add other things here, but you may need to be
	careful what events you expect to have available.

All of this is compiled into the BIACore.js via Tools/compile.bat
A quick overview of this file's events:
	1) Add the correct Config
	2) Add a version number based on current datetime (used to determine if
		somebody has managed to load an "old" version, and also for cache-
		breaking).
	3) Recursively add Base/. The order is generally alphabetical.
	4) Recursively add BIACore/. The order is generally alphabetical.
	5) Recursively add Final/. The order is generally alphabetical.

BIACore.min.js is then generated from BIACore.js with Tools/jsmin.exe