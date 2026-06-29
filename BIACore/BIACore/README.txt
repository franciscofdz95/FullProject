This project ends up by becoming biacore.dll which is included in pretty much every
other application. So it's kind of important that it work correctly.

It includes several things commonly used in the other apps; this is a feature left
over from the development in place when I inherited it.

BIACoreModule is most of the important part - it's the actual securing system. It is
broken into several sub-files, with each one handling it's specific part (logging,
security, etc).

Some notes about usage:
1. The sub folders tend to be descriptive of what the contents do, not so much the
	namespace.
2. The Extensions folder is a mish-mash of 3 different developer's extensions. I'm
	amazed they don't override each other.
