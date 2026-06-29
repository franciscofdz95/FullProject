/*
BIA javascript utility
The purpose of this file is to define variables and functions that are globally available for use in 
any application that includes the file.

The self evoking function serves the purpose of overriding and or adding to native javascript functionality.

The object literal BIA.Library namespace is where utility methods are to be added.
*/

(function () {
	//Begin define console object and log method for IE
	if (typeof (console) === 'undefined') {
        console = { 
			log: function () { return '' } 
		};
	}
	//End define console object and log method for IE
	
	//Begin add capitalize method to string
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
	//End add capitalize method to string
})();

//BIA.Library namespace
var BIA = {
	Library: {
		breakOut: function () {
			if (self != top){
				window.open("my URL", "_top", "");
			}
		},
		padNumber: function (number){
			return ( number >= 10 )? number.toString() : '0' + number;
		}
	},
    consoleLogDebug: true,
    consoleLog: function(mssg){ 
	    if (!window.console || typeof (console) === 'undefined') {
            this.consoleLogDebug = false;
            console = { log: function () { return '' } }
            return;
            }

        if (this.consoleLogDebug === true) {
            console.log(mssg);
        }
	}
}

