Ext.define('App.View.Admin.ActiveUser.Filter', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-ActiveUser-Filter',
    padding: '5 5',
    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'start'
    },
    defaults: {
        padding: '2 0'
    },
    items: [
        {
            xtype: 'filterContainer',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },
            items: [
                { xtype: 'App-View-Admin-ActiveUser-Component-Filter-Server', itemId: 'Server', width: 230 },
                { xtype: 'App-View-Admin-ActiveUser-Component-Filter-Environment', itemId: 'Environment', width: 230 },
                { xtype: 'App-View-Admin-ActiveUser-Component-Filter-AppCode', itemId: 'AppCode'}
                ]
        },
        {
            xtype: 'filterContainer',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },
            defaults: { padding: '5 10' },
            width: '100%',
            items: [
                { xtype: 'App-View-Admin-ActiveUser-Component-Filter-User', itemId: 'User', margin:'0 0 0 150' },
                        { xtype: 'App-View-Admin-ActiveUser-Component-Filter-ADID', itemId: 'ADID' },
                        { xtype: 'App-View-Admin-ActiveUser-Component-Filter-Name', itemId: 'Name' },
                        { xtype: 'App-View-Admin-ActiveUser-Component-Filter-VPNUsersOnly', itemId: 'VPNUsersOnly' },
            ]
        },
        {
            xtype: 'filterContainer',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },            
            items: [
                { xtype: 'button', itemId: 'ApplyBtn', text: 'Apply', margin: '0 5 0 10'},
                { xtype: 'button', itemId: 'ClearBtn', text: 'Clear', margin: '0 5 0 10' }
            ]
        },
    ],

    initComponent: function initComponent() {
        var _defaultParams = { server: null, environment: null, appcode:null, userList: null, userADIDList: null, userNameList: null, vpnUsersOnly: null },
            _params = Ext.clone(_defaultParams);

        Ext.apply(this, {
            fireFilterEvent: function fireFilterEvent(clearFilters) {
                var fields = this.query('field');
                if (clearFilters === true) {
                    for (var i = 0; i < fields.length; i++) {
                        if (Ext.isFunction(fields[i].clearValue)) fields[i].clearValue();
                        else fields[i].setValue(null);

                        fields[i].resetOriginalValue();
                        fields[i].checkDirty();
                    }
                }

                if (fields.filter(function (f) { return f.isDirty(); }).length > 0) {
                    for (var i = 0; i < fields.length; i++) {
                        fields[i].resetOriginalValue();
                        fields[i].checkDirty();
                    }
                }

                var params = Ext.clone(_defaultParams);
                for (var i = 0; i < fields.length; i++) {
                    if (Ext.isFunction(fields[i].getValueRecords)) {
                        params[fields[i].param] = new Array();
                        for (var ri = 0; ri < fields[i].getValueRecords().length; ri++)
                            params[fields[i].param].push(fields[i].getValueRecords()[ri].get(fields[i].valueField));
                    }
                    else if (fields[i].isXType('checkbox')) params[fields[i].param] = fields[i].getValue();
                    else if(!Ext.isEmpty(fields[i].getValue()))  {
                        var value = fields[i].getValue().split(',');
                        for (var vi = 0; vi < value.length; vi++) value[vi] = value[vi].trim();
                        params[fields[i].param] = value;
                    }
                }

                _params = Ext.clone(params);

                this.fireEvent('filterUpdate', this, Ext.clone(_params));
            },
            getParams: function getParams() {
                return Ext.clone(_params);
            }
        });

        this.callParent(arguments);
    }
});