Ext.define('App.View.Connections.Header.Search', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Connections-Header-Search',

    cls: 'connectionsHeaderSearch',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    defaults: { margin: '0 5 0 0' },
    items: [
        { xtype: 'textfield', itemId: 'SearchText', width: 400, emptyText: 'Search to Filter List', enableKeyEvents: true },
        //{ xtype: 'button', itemId: 'SearchButton', iconCls: 'fa fa-search', width: 30, textAlign: 'left' },
        { xtype: 'iconbutton', itemId: 'SearchButton', icon: 'search'/*'arrow-circle-right'*/, cls:'SmallScale' },
        {
            xtype: 'container', html: '<i class="fa fa-info-circle"></i>', cls: 'searchHelp',
            hoverWindow: {
                alignPosition: 'tl-bl',
                windowXtype: {
                    xtype: 'container',
                    html: 'Search by a specific category by prefacing the search value with {Category}:<br/><br/>' +
                        '<font style="font-weight: bold; ">Categories Available:</font><br/>' +
                        '<t/>ConnectionName (Example = ConnectionName:MyConnection)<br/>' +
                        '<t/>DatabaseName (Example = DatabaseName:MyDatbase)<br/>' +
                        '<t/>ServerName (Example = ServerName:TheServer)<br/>' +
                        '<t/>AppCode (Example = AppCode:BIA)<br/>' +
                        '<t/>ProjectManager (Example = ProjectManager:Matthew)<br/>' +
                        '<t/>Environment (Example = Environment:DEV)<br/>' +
                        '<t/>Username (Example = Username:bia_test)<br/>' +
                        '<t/>GlobalName (Example = GlobalName:Global)<br/>' +
                        '<t/>ServerAlias (Example = ServerAlias:TheServer)<br/>' +
                        '<t/>InstanceName (Example = InstanceName:SQL000)<br/>' +
                        '<t/>ServerType (Example = ServerType:SQL)<br/>' +
                        '<t/>ClusterName (Example = ClusterName:CSVP000LONGCODE)<br/>' +
                        '<t/>NodeName (Example = NodeName:CSND000LONGCODE)<br/>' +
                        '<t/>Technology (Example = Technology:Coldfusion)',
                    width: 500
                }
            }
        }
    ],
    getSearchParam: function getSearchParam() {
        var searchText = this.down('#SearchText');
        if (searchText) {
            var searchCategories = ['connectionname', 'databasename', 'servername', 'appcode', 'projectmanager', 'environment', 'username',
                'globalname', 'serveralias', 'instancename', 'servertype', 'clustername', 'nodename','technology'],
                searchParts = searchText.getValue().split(':');
            if (searchParts.length > 1) {
                if (searchCategories.indexOf(searchParts[0].toLowerCase()) > -1) {
                    return { search: searchText.getValue().replace(searchParts[0] + ':', '').trim(), category: searchParts[0] };
                }
            }

            if (!Ext.isEmpty(searchText.getValue())) return { search: searchText.getValue() };
            else return { search: '' };
        }

        return null;
    },
    getDefaultSearchParam: function getDefaultSearchParam() {
        return { search: null, category: null };
    }
});