
/* ====================================================================================================
NAME:			[UPSRef Type Name Filter Controller ]
BEHAVIOR:		UPSRef Type Name  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.UPSRefTypeName', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-UPSRefTypeName textfield': {
                change: this.UPSRefTypeNameChange
            }
        });
    },
    UPSRefTypeNameChange: function UPSRefTypeNameChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            PgAtt.setUpsRefType(newValue);
            this.showUpsType(me);
        } else {
            PgAtt.setUpsRefType('');
        }
        me.updateLayout();
    },
    showUpsType: function (me) {
        var htmlVal = '';
        var record = IProcessingSCls.getRecDetails();

        if (record != '' && record != null) {
            var pgType = record.get('pageType');
            if (pgType == 'Bills') {
                htmlVal = record.get("ReferenceFilter");
            } else if (pgType == 'CbolCC') {
                if (record.get('Type') == 'CBOL') {
                    htmlVal = record.get('Carrier_BOL');
                } else {
                    htmlVal = PgAtt.getMbl_iata_busid();
                }
            }
            else if (pgType == 'Containers') {
                htmlVal = record.get('Containers');
            }
        } else {
            record = IProcessingSCls.getNewRecDetails();
            htmlVal = record.ReferenceFilter;
        }
        var theElem = me.getEl();
        var theTip = Ext.create('Ext.tip.Tip', {
            html: htmlVal,
            margin: '0 0 0 60',
            shadow: false
        });

        me.getEl().on('mouseover', function () {
            theTip.showAt(theElem.getX(), theElem.getY());
        });

        me.getEl().on('mouseleave', function () {
            theTip.hide();
        });
    }
});