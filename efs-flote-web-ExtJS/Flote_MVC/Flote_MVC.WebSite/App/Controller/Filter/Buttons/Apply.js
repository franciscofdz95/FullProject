Ext.define('App.Controller.Filter.Buttons.Apply', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' },
        { ref: 'ApplyButton', selector: 'App-View-Component-FilterFields #ApplyButton' }
    ],
    init: function () {
        var me = this;
        me.control({
            'App-View-Component-Container-FilterPanelBase #ApplyButton': {
                click: me.Apply_Click
            },
            'filterContainer field': {
                change: me.FilterDirty
            }
        });
    },
    FilterDirty: function (field, newValue, oldValue, eOpts) {
        var me = this,
            button = me.getApplyButton();
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }

        // once we go dirty, only 'click' will mark us clean.
        if (button && !button.hasCls('red-btn') && (field.itemId != 'searchTextId' || field.itemId != 'searchTextIdPop')) {
            button.addCls('red-btn');
        }

        // Changed Error Message when Home Page Loads by Sriram
        var pageName='';
        if (localStorage) { pageName = localStorage.getItem('pageName'); }
        filter.down('#msgWarning').show();
        filter.down('#msgWarning').setHtml('');
        
        if (pageName == 'Home' || pageName ==null) {
            filter.down('#msgWarning').setHtml('<Div style= "background-color : white;color:red;font-weight:bold; font-size:12px;border: 1px solid white;border-color:#FFFFFF;">Click GO to Apply Filter Changes.</Div>');
        } else {


            filter.down('#msgWarning').setHtml('<Div style= "background-color : white;color:red;font-weight:bold; font-size:12px;border: 1px solid white;border-color:#FFFFFF;">Filters changed but not applied!<BR> Click Go to Apply.</Div>');
        }
        // Changed Error Message when Home Page Loads by Sriram
        
    },
    Apply_Click: function (button, event, eOpts) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        // remove the red css.
        button.removeCls('red-btn');
        filter.down('#msgWarning').hide();
    }
});