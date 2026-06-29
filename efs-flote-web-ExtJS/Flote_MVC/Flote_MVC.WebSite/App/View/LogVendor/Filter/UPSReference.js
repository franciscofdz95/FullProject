/* ====================================================================================================
NAME:			[LV UPS Reference]
BEHAVIOR:		Shows LV UPS Reference Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modificationsf t
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/

var shows = Ext.create('Ext.data.Store', {
    fields: ['displayField'],
    data: [
        [''], ['']
    ]
});
Ext.define('App.View.LogVendor.Filter.UPSReference', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-UPSReference',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'UPS Reference:', baseCls: 'UPS_Black' },
        {
            xtype: 'tagfield',           
            allowBlank: false,
            valueField: 'displayField',
            displayField: 'displayField',
            queryMode: 'local',           
            store: shows,
            maxShowItem: 10,
            maxSelectedTags: 10,          
            width: 220,
            inputWidth: 220,
            forceSelection: false,
            createNewOnBlur: true,
            createNewOnEnter: true,            
            editable: true,
            minChars: 3,
            listeners: {
                change: function (textfield, newvalue, oldvalue, options) {
                    var win = this.up('window');
                    if (textfield.getValue().length > 0) {
                        var retValue = LogVendorSCls.checkUPSRefNum(win);
                        if (retValue != "") {
                            win.down('#invalidRefListId').setText(retValue);
                        } else {
                            win.down('#invalidRefListId').setText("");
                        }
                        if (textfield.getValue().length > 10) {
                            alert("Please enter only 10 different UPS Ref entries.")
                        }
                    } else { win.down('#invalidRefListId').setText(""); }

                }
                
            }
        },
         { xtype: 'label', text: '(Enter comma-seperated values)', baseCls: 'UPS_Black' },
         { xtype: 'label', itemId: 'invalidRefListId', text: '', style: 'background-color:red;word-wrap:break-word;', width: 220 } // Kaizen #14118  Sriram
    ]   
});



