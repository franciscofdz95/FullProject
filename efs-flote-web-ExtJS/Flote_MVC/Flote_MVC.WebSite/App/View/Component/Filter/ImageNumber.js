/* ====================================================================================================
NAME:			[Image Number Filter]
BEHAVIOR:		Shows Image Number Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ImageNumber', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ImageNumber',
    name: 'ImageNumber',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Image Number:', baseCls: 'UPS_White', width: '48%' },
            {
                xtype: 'textfield',
                emptyText: 'Image Number',
                itemId: 'ImageNumber',
                allowBlank: true,
                width: '48%',
                inputWidth: 100,
                triggers: {
                    clear: {
                        weight: 0,
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        hidden: true,
                        handler: 'onClearClick',
                        scope: 'this'
                    }
                },

                /**
                    * @method onClearClick
                    * execute when  clear trigger is clicked
                    */
                onClearClick: function () {
                    var me = this;
                    me.reset();
                    me.getTrigger('clear').hide();
                    me.fireEvent('onclear', me, me.getValue());
                    me.updateLayout();
                    PgAtt.setImageNumber('');
                    this.onChange('');
                }

            }


    ],
    GetFilterDisplay: function () {
        var value = this.down('#ImageNumber').getRawValue();
        return (value) ? 'Image Number: ' + value : '';
    }
});