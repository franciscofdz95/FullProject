/* ====================================================================================================
NAME:			[Company Code Filter Controller ]
BEHAVIOR:		Company Code filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.CompanyCode', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-CompanyCode clearCombo': {
                afterrender: this.CompanyCodeAfterRender,
                change: this.CompanyCodeChange,
                clear: this.CompanyCodeClear
            }
        });
    },
    CompanyCodeChange: function CompanyCodeChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setCompany_code(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setCompany_code('');
        }
        me.updateLayout();
    },
    CompanyCodeAfterRender: function CompanyCodeAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    CompanyCodeClear: function CompanyCodeClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setCompany_code('');
        this.CompanyCodeChange(me, '');
    }
});