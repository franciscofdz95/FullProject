Ext.define('App.Controller.Component.Form.Field.ScrollingTag', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        this.control({
            'tagfield': {
                storeload: this.TagfieldStoreLoad
                //,expand: this.TagfieldExpand
                //collapse: this.ScrollTagCollapse,
                //,change: {
                //    fn: this.TagfieldChange_Blur,
                //    args: ['change']
                //}
                //,blur: {
                //    fn: this.TagfieldChange_Blur,
                //    args: ['blur']
                //}
            },
            'App-View-Component-Form-Field-ScrollingTag': {
                afterrender: this.ScrollingTagAfterRender
                //,expand: this.Expand
                //,storeload: this.StoreLoad
                //,change: {
                //    fn: this.Change_Blur,
                //    args: ['change']
                //}
                //,blur: {
                //    fn: this.Change_Blur,
                //    args: ['blur']
                //}
            }
        });
    },
    TagfieldStoreLoad: function TagfieldStoreLoad(me) {
        if (me.picker && !Ext.isEmpty(me.value)) me.picker.getSelectionModel().select(me.store.data.items.filter(function (itm) { return me.value.indexOf(itm.get(me.valueField)) > -1; }));
    },
    TagfieldExpand: function TagfieldExpand(me) {
        if (me.inputElCt) me.inputElCt.setStyle('display', 'block');
        if (me.inputEl) {
            me.inputEl.removeCls('x-tagfield-emptyinput');
            me.inputEl.focus();
        }
        if (me.emptyEl) me.emptyEl.setStyle('display', 'none');
    },
    TagfieldChange_Blur: function TagfieldChange_Blur(eventName, me) {
        if (eventName !== 'change' || (eventName === 'change' && (!me.picker || me.picker.isHidden()))) {
            if (Ext.isEmpty(me.getValue())) {
                if (me.inputElCt) me.inputElCt.setStyle('display', 'block');
                if (me.inputEl) me.inputEl.addCls('x-tagfield-emptyinput');
                if (me.emptyEl) me.emptyEl.setStyle('display', 'block');
            }
            else if (me.inputElCt) me.inputElCt.setStyle('display', 'none');
        }

        if (eventName === 'change' && me.picker && !me.picker.isHidden() && !Ext.isEmpty(me.inputEl.getValue()) && me.clearSearchAfterSelection === true) {
            me.inputEl.dom.value = null;
            me.store.load();
        }
    },
    ScrollingTagAfterRender: function ScrollingTagAfterRender(me) {
        me.grow = true;
        me.growMin = 0;
        me.growMax = me.getHeight() * (Ext.isEmpty(me.growFactor) ? 1 : me.growFactor);
        //me.scrollable = true;
    }
});