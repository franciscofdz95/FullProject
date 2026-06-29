/* ====================================================================================================
NAME:			[Refrence Filter Filter]
BEHAVIOR:		Shows RefrenceFilter Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ReferenceFilter', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ReferenceFilter',
    name: 'ReferenceFilter',
    items: [        
        {
            xtype: 'hiddenfield',
            itemId: 'ReferenceFilter',           
            allowBlank: false,           
            value: ''      
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#ReferenceFilter').getRawValue();
        // forceSelection: true makes this a bit retarded.
        return (value) ? 'Reference Filter: ' + value : '';
    }
});