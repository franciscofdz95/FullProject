/**
 * Since most filters are of the form {Id: '', Name: ''}, this Model
 * acts as a base (or default) for them.
 */
Ext.define('BIA.data.FilterModel', {
    extend: 'Ext.data.Model',
    idProperty: 'Id',
    fields: [
        { name: 'Id', type: 'string' },
        { name: 'Name', type: 'string' }
    ]
});