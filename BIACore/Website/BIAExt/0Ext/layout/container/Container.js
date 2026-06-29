(function () {
    if (Ext.getVersion().major >= 5 && typeof Ext != 'undefined' && typeof Ext.layout != 'undefined' && typeof Ext.layout.container != 'undefined' && typeof Ext.layout.container.Container != 'undefined') {
        Ext.override(Ext.layout.container.Container, {
            notifyOwner: function () {
                if (!this._hasTargetWarning && this.targetCls && !(this.getTarget() || {hasCls: Ext.emptyFn}).hasCls(this.targetCls)) {
                    this._hasTargetWarning = true;
                    Ext.log.warn('targetCls is missing. This may mean that getTargetEl() is being overridden but not applyTargetCls(). ' + this.owner.id);
                }
                this.owner.afterLayout(this);
            }
        });
    }
})();