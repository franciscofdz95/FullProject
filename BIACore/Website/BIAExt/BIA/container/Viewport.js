// Add a window Focus/window Blur event to Viewports.
// Used to update data when focus is gained.
/**
 * Extend the default Viewport container to add a 'windowfocus' and 'windowblur' event.
 * This is useful for turning on/off tasks that update the screen; no sense updating something
 * that isn't being looked at.
 */
Ext.define('BIA.container.Viewport', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.viewport.Default' : 'Ext.container.Viewport',
    alias: 'widget.biaviewport',

    initComponent: function () {
        var me = this,
            focusEl = window,
            events = ['focus', 'blur'];

        if (Ext.isIE) {
            focusEl = document;
            events = ['focusin', 'focusout'];
        }

        //me.addEvents(
        //    /**
        //     * @event windowfocus
        //     * Fires when the browser window is focused by the user.
        //     */
        //    'windowfocus',
        //    /**
        //     * @event windowblur
        //     * Fires when the browser window loses focus.
        //     */
        //    'windowblur');

        Ext.get(focusEl).addListener(events[0], function () {
        //Ext.EventManager.on(focusEl, events[0], function (e) {
            var me = this;
            if (me._hasFocus) { return; }

            me._hasFocus = true;
            me.fireEvent('windowfocus', me, me._activeElement);
        }, this, { stopPropagation: true });

        Ext.get(focusEl).addListener(events[1], function () {
            //Ext.EventManager.on(focusEl, events[1], function (e) {
            var me = this;
            if (me._activeElement !== document.activeElement) {
                me._activeElement = document.activeElement;
                if (Ext.isIE) { return; }
            }
            me._hasFocus = false;
            me.fireEvent('windowblur', me, me._activeElement);
        }, this, { stopPropagation: true });

        me._activeElement = document.activeElement;

        me.callOverridden(arguments);
    }
});
