This directory contains everything pertinent to BIAExt.js, which is a set of
Ext 4.x and Ext 5.x extensions specific to BIA.

0Ext/
	This folder contains a bunch of fixes and overrides for Ext 4/5. For
	logistics reasons, it *must* be included in BIAExt.js first, hence the
	leading '0'.

BIA/
	This is the core of the BIAExt additions. This contains items like
	'filterContainer' (an Ext Container extension that contains a recursive
	method for grabbing values from contained form items), 'graph' (an Ext
	Chart extension that makes using Cartesian Charts easier, and more
	consistent across the Ext versions).

css/
	These are the css items necessary to make BIAExt work.

MyReports/
	This folder contains items specific to MyReports. This includes the
	'report grid' - a listing of all reports available to a user, the
	ability to download a file from MyReports, and the ability to queue a
	report into MyReports.