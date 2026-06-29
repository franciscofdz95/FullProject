Ext.define('BIA.Components.IconButton', {
    extend: 'Ext.container.Container',
    alias: 'widget.BIA-Components-IconButton',
    xtype: 'iconbutton',
    componentCls: 'BIAIconButton',
    colorTheme: 'default',
    icon: '',
    stackedIcon: null,
    /*
    stackedIcon: {
        bottom: 'square',
        top: 'exclamation'
    }
     */
    initComponent: function initComponent() {

        //Add code to handle color themes
        var colorThemes = [
            { name: 'default', cls: 'Default' },
            { name: 'orange', cls: 'Orange' },
            { name: 'grass', cls: 'Grass' },
            { name: 'fire', cls: 'Fire' },
        ],
            matchingColorTheme = Ext.Array.findBy(colorThemes, function (ct) { return ct.name = this.colorTheme; },this);
        if (Ext.isEmpty(matchingColorTheme)) {
            matchingColorTheme = Ext.Array.findBy(colorThemes, function (ct) { return ct.name = 'default'; }, this);
        }

        this.cls = (Ext.isEmpty(this.cls) ? '' : this.cls + ' ') + matchingColorTheme.cls;

        if (!Ext.isEmpty(this.stackedIcon)) {
            this.html = '<span class="fa-stack">' +
                '<i class="fa fa-' + this.stackedIcon.bottom + ' fa-stack-2x"></i>' +
                '<i calss="fa fa-' + this.stackedIcon.top + ' fa-stack-2x"></i>' +
                '</span>';
        }
        else if (!Ext.isEmpty(this.icon)) {
            this.html = '<i class="fa fa-' + this.icon + '"></i>';
        }

        this.callParent(arguments);
    }
});

Ext.define('BIA.Controller.IconButton', {
    extend: 'Ext.app.Controller',
    init: function init() {
        this.control({
            'BIA-Components-IconButton': {
                afterrender: {
                    fn: this.IconButtonAfterRender,
                    priority: 9999
                }
            }
        });
    },
    IconButtonAfterRender: function IconButtonAfterRender(me) {
        var iconDOM = me.getEl().down('span.fa-stack') || me.getEl().down('i.fa');
        if (iconDOM) {
            iconDOM.addListener({
                click: {
                    fn: function fn(btn) {
                        btn.fireEvent('click', me);
                    },
                    scope: this,
                    args: [me]
                }
            });
        }
    }
});