Ext.define('BIA.BindingOverrides', {
    singleton: true,

    doOverrides: function () {
        Ext.override(Ext.app.bind.TemplateBinding, {
            react: function () {
                this.notify(this.value);
                var view = this.owner.getView();
                if ((view && view.fireEvent && Ext.isFunction(view.fireEvent))) {
                    //view.fireEvent('bindvaluecomplete', view, this.scope, this.owner);
                    if (this.scheduler && this.scheduler.scheduledCount == 0) view.fireEvent('bindingcomplete', view, this.scope);
                }
            }
        });

        Ext.override(Ext.app.bind.Multi, {
            react: function () {
                this.notify(this.lastValue);
                var view = this.owner.getView();
                if ((view && view.fireEvent && Ext.isFunction(view.fireEvent))) {
                    //view.fireEvent('bindvaluecomplete', view, this.scope, this.owner);
                    if (this.scheduler && this.scheduler.scheduledCount == 0) view.fireEvent('bindingcomplete', view, this.scope);
                }
            }
        });

        Ext.override(Ext.app.bind.AbstractStub, {
            react: function () {
                var bindings = this.bindings,
                    binding, i, len;
                if (bindings) {
                    for (i = 0, len = bindings.length; i < len; ++i) {
                        binding = bindings[i];
                        if (!binding.scheduled) {
                            binding.schedule();
                        }
                    }
                }
                var view = this.owner.getView();
                if ((view && view.fireEvent && Ext.isFunction(view.fireEvent))) {
                    //view.fireEvent('bindvaluecomplete', view, this.scope, this.owner);
                    if (this.scheduler && this.scheduler.scheduledCount == 0) view.fireEvent('bindingcomplete', view, this.scope);
                }
            }
        });

        Ext.override(Ext.app.bind.Formula, {
            react: function () {
                var me = this,
                    owner = me.owner,
                    data = me.binding.lastValue,
                    getterFn = me.getterFn,
                    arg;
                if (me.explicit) {
                    arg = data;
                } else {
                    arg = owner.getFormulaFn(data);
                }
                me.settingValue = true;
                me.stub.set(me.calculation = me.get.call(owner, arg));
                me.settingValue = false;

                var view = this.owner.getView();
                if ((view && view.fireEvent && Ext.isFunction(view.fireEvent))) {
                    //view.fireEvent('bindvaluecomplete', view, this.scope, this.owner);
                    if (this.scheduler && this.scheduler.scheduledCount == 0) view.fireEvent('bindingcomplete', view, this.scope);
                }

                if (me.single) {
                    me.destroy();
                }
            }
        });
    }
});