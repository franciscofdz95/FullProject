(function () {
    // fix a bug that gets fixed in 4.2.2
    // the change is the 'duringTriggerClick' value; it prevents other items from firing during this click.
    var version = Ext.getVersion() || {};
    if (version.major === 4 && version.minor === 2 && version.patch < 2) {
        Ext.override(Ext.form.field.ComboBox, {
            onTriggerClick: function () {
                var me = this;

                me.duringTriggerClick = true;
                if (!me.readOnly && !me.disabled) {
                    if (me.isExpanded) {
                        me.collapse();
                    } else {
                        me.onFocus({});
                        if (me.triggerAction === 'all') {
                            me.doQuery(me.allQuery, true);
                        } else if (me.triggerAction === 'last') {
                            me.doQuery(me.lastQuery, true);
                        } else {
                            me.doQuery(me.getRawValue(), false, true);
                        }
                    }
                    me.inputEl.focus();
                }
                delete me.duringTriggerClick;
            }
        });
    } else if (version.major >= 5) {
        if (version.minor < 2) {
            // Override to make all IEs as terrible as each other - Ext have an additional IE9 or less check.
            // This sorts out field mutation firing on setValue, and setRawValue causing a selection in the combo.
            //
            // From here: http://www.sencha.com/forum/showthread.php?295443-IE-11-Combobox-doDelegatedEvent-double-call-setValue&p=1078651&viewfull=1#post1078651
            Ext.override(Ext.form.field.ComboBox, {
                checkChangeEvents: Ext.isIE ?
                    ['change', 'propertychange', 'keyup'] :
                    ['change', 'input', 'textInput', 'keyup', 'dragdrop']
            });
        }
    }
}());