//// uncomment this to get a broadcast of every event fired in the system.
//// It helps in getting a feel for the order-of-operations.
//Ext.override(Ext.util.Observable, {
//    fireEvent: function (eventName) {
//        var name = this.itemId || this.id;
//        console.log('Event: ' + name + ' (' + this.$className + '):' + eventName);
//        this.callOverridden(arguments);
//    }
//});
