Ext.Error.handle = function (err) {
    /* need to add more information to specify where this happened */
    BIACore.Logger.Error('BIACore Ext Javascript Error Handler', err.msg);
};