if (Ext.getVersion().major === 5) {
    Ext.define('BIA.Component', {
        override: 'Ext.Component',
        //Add mixin to auto-create stores for all components
        mixins: [
            'Ext.mixin.Inheritable',
            'Ext.util.Floating',
            'Ext.util.Positionable',
            'Ext.util.Observable',
            'Ext.mixin.Bindable',
            'Ext.util.Animate',
            'Ext.util.ElementContainer',
            'Ext.util.Renderable',
            'Ext.state.Stateful',
            'Ext.util.Focusable',
            'BIA.mixin.StoreCreate'
        ]
    });
}
else if (Ext.getVersion().major >= 7 && Ext.platformTags &&  Ext.platformTags.classic) {
    Ext.define('BIA.Component', {
        override: 'Ext.Component',
        //Add mixin to auto-create stores for all components
        mixins: [
            'Ext.mixin.Inheritable',
            'Ext.util.Floating',
            'Ext.util.Positionable',
            'Ext.util.Observable',
            'Ext.mixin.Bindable',
            'Ext.util.Animate',
            'Ext.util.ElementContainer',
            'Ext.util.Renderable',
            'Ext.state.Stateful',
            'Ext.mixin.Focusable',
            'BIA.mixin.StoreCreate'
        ]
    });
}
else if (Ext.platformTags && Ext.platformTags.modern) {
    Ext.define('BIA.Component', {
        override: 'Ext.Component',
        //Add mixin to auto-create stores for all components
        mixins: [
            //'Ext.mixin.Inheritable',
            //'Ext.util.Floating',
            //'Ext.util.Positionable',
            //'Ext.util.Observable',
            //'Ext.mixin.Bindable',
            //'Ext.util.Animate',
            //'Ext.util.ElementContainer',
            //'Ext.util.Renderable',
            'Ext.state.Stateful',
            //'Ext.mixin.Focusable',
            'BIA.mixin.StoreCreate'
        ]
    });
}