Ext.define('App.Controller.Admin.BIANews', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'BIANewsList', selector: 'App-View-Admin-News-List' },
        { ref: 'BIANewsAddEditWindow', selector: 'App-View-Admin-News-AddEditView' },
        { ref: 'MessagesCnt', selector: 'App-View-Admin-News-Container' },
    ],
    init: function init() {
        this.control({
            'App-View-Admin-News-Container': {
                added: this.BIANewsContainerAdded                
            },
            'App-View-Admin-News-MenuItem': {
                beforerender: this.BIANewsMenuItemBeforeRender
            },    
            'App-View-Admin-News-AdminMenuItem': {
                beforerender: this.BIANewsMenuItemBeforeRender
            },   
            'App-View-Admin-News-Container grid': {
                afterlayout: this.BIANewsGridAfterLayout,
                cellclick: this.BIANewsGridCellClick,
                bianewsedit: this.BIANewsGridEdit,          
                
            },
            'App-View-Admin-News-AddEditView': {
                beforerender: this.BIANewsAddEditViewBeforeRender,
                boxready: this.AddEditViewWindowBoxReady
            },
            'App-View-Admin-News-AddEditView field': {
                keyup: this.DisplayPreviewText
            },
            'App-View-Admin-News-AddEditView connectionsComboBox': {
                storeload: { fn: this.AddEditViewWindowConnectionsComboBoxStoreLoad, delay: 25 }
            },           
            'App-View-Admin-News-AddEditView connectionsAddEditButtonContainer button#Cancel': {
                click: this.AddEditViewWindowCancelButtonClick
            },
            'App-View-Admin-News-AddEditView connectionsAddEditButtonContainer button#Save': {
                click: this.AddEditViewWindowSaveButtonClick
            },
            'App-View-Admin-News-Component-NewsIdDisplay': {
                beforerender: this.NewsIdDisplayBeforeRender
            },
            'App-View-Admin-News-Component-AddButton': {
                beforerender: this.AddButtonBeforeRender,
                click: this.AddButtonClick
            },
            'App-View-Admin-News-AddEditView #MessageTypeId': {
                select: this.DisplayPreviewText
            },
            'App-View-Admin-News-AddEditView #MessageDate': {
                select: this.DisplayPreviewText
            },
        });
    },

    BIANewsContainerAdded: function BIANewsContainerAdded(me) {
        if (!BIACore.Security.User.isSA()) me.hide();
        else me.show();
    },

    BIANewsMenuItemBeforeRender: function BIANewsMenuItemBeforeRender(me) {
        if (!BIACore.Security.User.isSA()) me.hide();
        else me.show();
    },  

    BIANewsGridAfterLayout: function BIANewsGridAfterLayout(me) {
        if (!me.store.isLoading() && !me.store.isLoaded()) {
            me.adjustPageSize(me);
            me.store.load();
        }
    },

    BIANewsGridCellClick: function BIANewsGridCellClick(gridView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var col = gridView.grid.getColumns()[cellIndex];
        if (col && !Ext.isEmpty(col.clickEvent)) gridView.grid.fireEvent(col.clickEvent, gridView.grid, col, record, rowIndex, td, tr);
    },

    BIANewsGridEdit: function BIANewsGridEdit(me, column, record, rowIndex, td, tr) {
        if (BIACore.Security.User.isSA()) this.BIANewsGridShowWindow(me, { xtype: 'App-View-Admin-News-AddEditView', NewsId: record.get('NewsId') });
    },

    BIANewsAddEditViewBeforeRender: function BIANewsAddEditViewBeforeRender(me) {
        if (!Ext.isEmpty(me.NewsId)) {
            me.store.getProxy().extraParams = { NewsId: me.NewsId };
            me.store.load();
        }
    },

    AddEditViewWindowBoxReady: function AddEditViewWindowBoxReady(me) {
        if (me.purpose != 'Add') {
            var comboBoxes = me.query('connectionsComboBox'), loaded = true;
            for (var i = 0; i < comboBoxes.length; i++) if (!comboBoxes[i].store.isLoaded()) { loaded = false; break; }

            if (loaded === false) me.mask('Loading');
        }
    },

    AddEditViewWindowConnectionsComboBoxStoreLoad: function AddEditViewWindowConnectionsComboBoxStoreLoad(me) {
        var addEditViewWindow = me.up('App-View-Admin-News-AddEditView');
        if (addEditViewWindow) {
            var comboBoxes = addEditViewWindow.query('connectionsComboBox'), loaded = true;
            for (var i = 0; i < comboBoxes.length; i++) if (!comboBoxes[i].store.isLoaded()) { loaded = false; break; }

            if (loaded === true && addEditViewWindow.isMasked()) addEditViewWindow.unmask();
        }
    },

    AddEditViewWindowCancelButtonClick: function AddEditViewWindowCancelButtonClick(me) {
        var win = me.up('App-View-Admin-News-AddEditView');
        if (win) win.close();
    },

    AddEditViewWindowSaveButtonClick: function AddEditViewWindowSaveButtonClick(me) {
        if (BIACore.Security.User.isSA()) {
            var addEditWindow = me.up('App-View-Admin-News-AddEditView');

            if (addEditWindow) {
                var newsRecord = {},
                    fields = addEditWindow.query('field[hidden=false],hiddenfield');
                for (var i = 0; i < fields.length; i++) newsRecord[fields[i].itemId] = Ext.isNumeric(fields[i].getValue()) ? fields[i].getValue() * 1 : fields[i].getValue();


                if (typeof newsRecord !== 'undefined' || newsRecord !== null) {

                    addEditWindow.mask('Saving BIA Message');

                    BIA.Ajax.request({
                        url: 'api/BIASecurity/UpsertBIAMessage',
                        method: 'POST',
                        jsonData: newsRecord,
                        success: function (response, request) {
                            if (response.status == 200) {
                                Ext.MessageBox.alert('BIA Message Save Success', 'The message was saved successfully.', function () {
                                    if (this.getBIANewsAddEditWindow()) this.getBIANewsAddEditWindow().close();
                                }, this);
                            }
                            else {
                                Ext.MessageBox.alert('BIA Message Save UnSuccess', 'The message was not saved, please try again later.');
                            }
                            var addEditWindow = this.getBIANewsAddEditWindow();
                            if (addEditWindow && addEditWindow.isMasked()) addEditWindow.unmask();
                        },
                        scope: this
                    });
                }
            }
        }
    },

    NewsIdDisplayBeforeRender: function NewsIdDisplayBeforeRender(me) {
        var newsAddEditView = this.getBIANewsAddEditWindow();
        if (BIACore.Security.User.isSA() && newsAddEditView && !Ext.isEmpty(newsAddEditView.NewsId)) {
            me.down('field').setValue(newsAddEditView.NewsId);
            me.show();
        }
        else me.hide();
    },

    AddButtonBeforeRender: function AddButtonBeforeRender(me) {
        if (me.displayType === 'NoText') me.setConfig({ text: null, arrowVisible: false });
    },

    AddButtonClick: function AddButtonClick(me) {       
        var windowXType = me.xtype.split('-');
        windowXType = windowXType[windowXType.length - 1];
        var win = Ext.create({ xtype: 'App-View-Admin-News-AddEditView', purpose: 'Add' }).show();
        if (!me.up('App-View-Admin-News-AddEditView')) {
            win.addListener({
                close: {
                    fn: function WindowClose() {
                        var messagesCnt = this.getMessagesCnt();
                        if (messagesCnt) {
                            var grid = messagesCnt.down('grid');
                            if (grid) grid.store.load();
                        }
                    },
                    scope: this
                }
            });
        }
    },
    
    BIANewsGridShowWindow: function BIANewsGridShowWindow(me, config) {
        var win = Ext.create(config).show();
        win.addListener({ close: { fn: function WindowClose() { me.store.load(); }, scope: this } });
    },

    DisplayPreviewText: function DisplayPreviewText(me, event, eOpts) {
        var newsAddEditView = this.getBIANewsAddEditWindow();

        if (newsAddEditView)
        {       
            newsAddEditView.down('App-View-Admin-News-Component-NewsPreview').setConfig({ html: '<div class="newHeader"><p>BIA NEWS AND ALERTS</p></div>' });

            if (newsAddEditView.down('#MessageTypeId').rawValue != '')
            {
                    newsAddEditView.down('App-View-Admin-News-Component-NewsPreview').setConfig({
                        html: '<div class="newHeader"><p>BIA NEWS AND ALERTS</p></div><div class="newsMessages"><div class="newsMessage'
                            + newsAddEditView.down('#MessageTypeId').rawValue + '"><p>' + newsAddEditView.down('#MessageTypeId').rawValue + ' '
                    + newsAddEditView.down('#MessageDate').rawValue + ' - ' + newsAddEditView.down('#MessageText').rawValue + '</p></div></div>' });  
            }
        }
    },
   
});