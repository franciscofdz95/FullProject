var locationTreeStore = Ext.create('Ext.data.TreeStore', {
    root: {
        id: 'ALL',
        text: 'ALL LOCATIONS',
        expanded: true,
        children: [{
            id: 'LATAM_AMERICAS',
            text: 'AMERICAS',
            checked: false,
            children: [],
            leaf: true,
        }, {
            id: 'APAC_APAC',
            text: 'APAC',
            checked: false,
            children: [],
            leaf: true
        }, {
            id: 'ISMEA_EM',
            text: 'EM',
            checked: false,
            children: [],
            leaf: true
        }, {
            id: 'EMEA_EUROPE',
            text: 'EUROPE',
            checked: false,
            children: [],
            leaf: true
        }, {
            id: 'US_USA',
            text: 'USA',
            checked: false,
            children: [],
            leaf: true
        }]
    }
});

var tradeLaneAccessTreeStore = Ext.create('Ext.data.TreeStore', {
    root: {
        id: 'ALL',
        text: 'All Trade Lanes',
        expanded: true
    }
});

Ext.define('App.View.EA.EAQuoteAssist', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EAQuoteAssist',
    itemId: 'EAQuoteAssistPanelId',
    closable: true,
    hidden: true,
    scrollable: false,
    minWidth: 500,
    minHeight: 500,
    bodyPadding: 10,
    collapsible: true,
    autoScroll: true,
    layout: 'absolute',
    initComponent: function () {
        var colHeight = 160;
        this.items = [{
            xtype: 'form',
            defaults: {
                anchor: '100%',
                margin: 5,
                enableKeyEvents: true
            },
            layout: 'anchor',
            items: [{
                layout: 'column',
                defaults: {
                    height: colHeight - 95,
                },
                items: [{
                    id: 'clmQAUsrSelection',
                    columnWidth: 1
                }]
            }, {
                layout: 'column',
                defaults: {
                    height: colHeight,
                    autoScroll: true
                },
                items: [{
                    id: 'clmQtAssist',
                    title: 'Quote Assist / EZQuote',
                    columnWidth: 0.25
                }, {
                    id: 'clmCstmrPrfle',
                    title: 'Customer Profile',
                    columnWidth: 0.25
                }, {
                    id: 'clmTliAdj',
                    title: 'TLI Adjustments',
                    columnWidth: 0.25
                }, {
                    id: 'clmReqot',
                    title: 'Requoting',
                    columnWidth: 0.25
                }]
            }, {
                layout: 'column',
                defaults: {
                    height: colHeight,
                    width: 150,
                    autoScroll: true
                },
                items: [{
                    id: 'clmQRecon',
                    title: 'QRecon',
                    columnWidth: 0.3
                }, {
                    id: 'clmQReconTree',
                    title: '&nbsp',
                    autoLoad: false,
                    columnWidth: 0.3,
                    style: { 'overflow-x': 'hidden' },
                    items: [{
                        xtype: 'treepanel',
                        id: 'reconLocationTree',
                        border: false,
                        store: locationTreeStore,
                        rootVisible: true,
                        mode: 'SINGLE'
                    }]
                }, {
                    id: 'clmUsrTrdLneAcs',
                    title: 'User Trade Lane Access',
                    columnWidth: 0.4,
                    style: { 'overflow-x': 'hidden' },
                    items: [{
                        xtype: 'treepanel',
                        id: 'tradeLaneAccessTree',
                        border: false,
                        store: tradeLaneAccessTreeStore,
                        rootVisible: true,
                        mode: 'SINGLE',
                        style: { 'overflow-x': 'hidden' }
                    }]
                }]
            }, {
                layout: 'column',
                defaults: { height: 20 },
                items: [{
                    title: '&nbsp',
                    columnWidth: 1
                }]
            }, {
                layout: 'column',
                defaults: { height: 28 },
                items: [{
                    columnWidth: 1,
                    xtype: 'panel',
                    style: { 'padding': '0% 0% 0px 82%' },
                    items: [{
                        xtype: 'button',
                        id: 'btnSave',
                        name: 'btnSave',
                        text: 'Save',
                        style: {
                            'vertical-align': 'middle',
                            'margin': '0px 2px 0px 0px'
                        },
                        iconCls: 'fa fa-save'
                    }, {
                        xtype: 'button',
                        id: 'btnCancel',
                        name: 'btnCancel',
                        text: 'Cancel',
                        style: {
                            'vertical-align': 'middle',
                            'margin': '0px 8px 0px 2px'
                        }
                    }]
                }]
            }]
        }]
        this.callParent(arguments);
    }
});