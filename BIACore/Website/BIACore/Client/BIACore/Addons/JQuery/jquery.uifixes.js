BIACore.define('BIACore.Addons.JQuery.UIFixes', {
	name: 'jquery.uifixes',
	plugin: function ($) {
		//var baseInit = $.ui.dialog.prototype._init;
		//$.ui.dialog.prototype._init = function () {
		//	baseInit.apply(this, arguments);

		//	// Make the close button a type "button" rather than "submit". This works
		//	// around an issue in IE9+ where pressing enter would trigger a click of
		//	// the close button.
		//	$('.ui-dialog-titlebar-close', this.uiDialogTitlebar).attr('type', 'button');
	    //};

	    $.widget("ui.dialog", $.ui.dialog, {
	        open: function () {
	            var z = $.topZIndex(),
                    d = this._super();
                // modal background - greys out everything else
	            $('.ui-widget-overlay').css('z-index', z + 1);
                // dialog itself
	            $('.ui-dialog').css('z-index', z + 2);
                // autocomplete picker
	            $('.ui-autocomplete').css('z-index', z + 3);
	            return d;
	        }
	    });
	}
});