Ext.define('App.Controller.Component.List.Item', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Component-List-Item': {
                beforerender: this.ListPartBeforeRender,
                resize: {
                    element: 'el',
                    fn: this.ListItemElResize
                },
                boxready: this.ListItemBoxReady
            },
            'App-View-Component-List-Item[header=true] [showOnHeader=true],App-View-Component-List-Item[header=true] [showOnHeader=false]': {
                beforerender: this.ListItemShowOnHeaderBeforeRender
            },
            'App-View-Component-List-Item[header=true] [sort=true][dataField], App-View-Component-List-Item[header=true] [sort=true][sortOn]': {
                afterrender: this.ListItemHeaderSortPartSetSortIcon,
                refreshsort: this.ListItemHeaderSortPartSetSortIcon
            }
        });
    },
    ListPartBeforeRender: function ListPartBeforeRender(me) {
        var list = me.up('[itemRecordAttribute]');
        if (list) {
            var dataProperty = list.itemRecordAttribute;
            if (dataProperty) {
                var fields = me.query('[dataField]');
                for (var i = 0; i < fields.length; i++) {
                    var dataValue = me[dataProperty][fields[i].dataField];
                    if (Ext.isFunction(fields[i].renderer)
                        && (me.header === false || (fields[i].useRendererForHeader === true && me.header === true))
                        && (me.total == false || (fields[i].useRendererForTotal === true && me.total === true))) {
                        dataValue = fields[i].renderer(dataValue, fields[i], { data: me[dataProperty] });
                    }
                    else if (me.header === true && Ext.isFunction(fields[i].headerRenderer)) {
                        dataValue = fields[i].headerRenderer(dataValue, fields[i], { data: me[dataProperty] });
                    }

                    if (fields[i].setValueAsDefault) fields[i].suspendEvent('change');

                    if (fields[i].useEvent && Ext.isFunction(fields[i].fireEvent)) {
                        fields[i].fireEvent('loaddata', fields[i], dataValue, me[dataProperty], me, list);
                    }
                    else if (Ext.isFunction(fields[i].select)) fields[i].select(dataValue);
                    else if (Ext.isFunction(fields[i].setText)) fields[i].setText(dataValue);
                    else if (Ext.isFunction(fields[i].setValue)) fields[i].setValue(dataValue);
                    else if (fields[i].dataDisplayHTML === true) fields[i].setConfig({ html: dataValue });
                    else if (Ext.isFunction(fields[i].fireEvent)) {
                        fields[i].fireEvent('loaddata', fields[i], dataValue, me[dataProperty], me, list);
                    }

                    if (fields[i].setValueAsDefault) {
                        fields[i].initialValue = dataValue;
                        fields[i].originalValue = dataValue;
                        if (fields[i].defaultValue == null) fields[i].defaultValue = dataValue;
                        fields[i].checkDirty();
                        fields[i].resumeEvent('change');
                    }
                }

                if (me[dataProperty][fields[0].dataField] != null && me[dataProperty][fields[0].dataField].toString().toLowerCase().trim() === 'total') {
                    me.addCls('TotalRow');
                }
            }
        }
    },
    ListItemShowOnHeaderBeforeRender: function ListItemShowOnHeaderBeforeRender(me) {
        if (me.showOnHeader === true) {
            if (me.up('[header=true]')) me.show();
            else me.hide();
        }
        else if (me.showOnHeader === false) {
            if (me.up('[header=true]')) me.hide();
            else me.show();
        }
    },
    ListItemHeaderResize: function ListItemHeaderResize(me, list) {
        var header = list.down('[header=true]');
        if (header) {
            var currentMargin = header.getEl().getMargin(),
                extraRightMargin = header.getWidth() - me.getWidth(),
                listBodyHeight = list.getHeight(),
                dockedItems = list.dockedItems.items;
            if (extraRightMargin < 0) extraRightMargin = 0;

            //header.afterBindResize = true;

            for (var i = 0; i < dockedItems.length; i++) {
                if (dockedItems[i] != header) listBodyHeight -= dockedItems[i].getHeight();
            }

            if (list.scrollable && list.scrollable.getSize() && list.scrollable.getSize().y + header.getHeight() > listBodyHeight) {
                header.setMargin(currentMargin.top + ' ' + (currentMargin.right + extraRightMargin) + ' ' + currentMargin.bottom + ' ' + currentMargin.left);
            }
            else {
                header.setMargin(currentMargin.top + ' ' + currentMargin.left + ' ' + currentMargin.bottom + ' ' + currentMargin.left);
            }
        }
    },
    ListItemBindingComplete: function ListItemBindingComplete(me) {
        if (me.skipResize !== true) {
            me.bindComplete = true;

            var list = me.up('pagedlist');
            if (list) {
                var listItems = list.query(me.xtype + '[header!=true][bindComplete!=true]');
                if (listItems && Ext.isArray(listItems) && listItems.length == 0) {
                    this.ListItemHeaderResize(me, list);
                }
            }
        }
    },
    ListItemElResize: function ListItemElResize(me, newWidth, newHeight, oldWidth, oldHeight, eOpts) {
        if (me.skipResize !== true) {
            if (me.header == true) {
                var list = me.up('pagedlist');
                if (list) {
                    var firstItem = list.down(me.xtype + '[header!=true]');
                    if (firstItem) {
                        this.ListItemBindingComplete(firstItem);
                    }
                }
            }
        }
    },
    ListItemBoxReady: function ListItemBoxReady(me) {
        if (me.skipResize !== true) {
            var list = me.up('pagedlist');
            if (list && list.query(me.xtype).length - 1 == list.query(me.xtype).indexOf(me)) {
                this.ListItemHeaderResize(me, list);
            }
        }
    },
    ListItemHeaderSortPartSetSortIcon: function ListItemHeaderSortPartSetSortIcon(me) {
        var sortField = !Ext.isEmpty(me.sortOn) ? me.sortOn : me.dataField,
            sortDisplay = me.sortDisplay,
            store = me.up('pagedlist').store,
            sorters = store.getSorters().items,
            sortDIR = '',
            sortChange = {
                asc: 'desc',
                desc: 'asc'
            };

        for (var i = 0; i < sorters.length; i++) {
            if (sorters[i].getProperty() == sortField) {
                sortDIR = sorters[i].getDirection().toLowerCase();
                break;
            }
        }

        var targetEl = me.getTargetEl().el.down('#' + me.getTargetEl().getId() + '-innerCt'),
            targetDom = targetEl ? targetEl.dom : me.getEl().dom,
            floatDivHTML = '<span class="headerSortFloat" style="float:left;"></span>',
            sortIconHTML = '<i class="fa fa-sort{DIR} headerSortIcon" data-qtip="Sort by {SORTFIELD} {DIRNEW}<br>Ctrl-Click to Add a Multi-Column Sort Column<br>Alt-Click to Clear a Multi-Column Sort Column"></i>';
        //clearDivHTML = '<div class="headerSortFloatClear" style="clear:both;"></div>';

        if (me.floatDiv) {
            me.floatDiv.remove();
            delete me.floatDiv;
        }
        //if (me.floatClearDiv) me.floatClearDiv.destroy();

        me.floatDiv = Ext.DomHelper.insertHtml('afterBegin', targetDom, floatDivHTML);
        Ext.DomHelper.insertHtml(
            'afterBegin',
            me.floatDiv,
            sortIconHTML
                .replace(/\{DIR\}/g, (!Ext.isEmpty(sortDIR) ? '-amount-' : '') + sortDIR)
                .replace(/\{SORTFIELD\}/g, sortDisplay || sortField)
                .replace(/\{DIRNEW\}/g, sortChange[Ext.isEmpty(sortDIR) ? 'desc' : sortDIR].toUpperCase())
        );
        //me.floatClearDiv = Ext.DomHelper.insertHtml('beforeEnd', targetDom, clearDivHTML);

        Ext.fly(me.floatDiv).down('i').dom.addEventListener('click', //event
            this.ListItemHeaderSortClick.bind(this, //scope
                me, sortField, sortDIR, sortChange[Ext.isEmpty(sortDIR) ? 'desc' : sortDIR] //params
            ),
            { once: true } //single: true
        );

        me.addCls('ListItemHeaderSort');
    },
    ListItemHeaderSortClick: function ListItemHeaderSortClick(me, sortField, oldSortDir, newSortDir, event) {
        var pagedlist = me.up('pagedlist'),
            listItemHeader = me.up('App-View-Component-List-Item[header=true]');
        if (pagedlist && listItemHeader) {
            var newSort = { property: sortField, direction: newSortDir.toUpperCase() },
                storeSorters = Ext.clone(pagedlist.store.getSorters().items),
                sorters = new Array();

            for (var i = 0; i < storeSorters.length; i++) {
                sorters.push({ property: storeSorters[i].getProperty(), direction: storeSorters[i].getDirection() });
            }

            var matchingSorter = Ext.Array.findBy(sorters, function (s) { return s.property == sortField; });

            if (!event.ctrlKey && !event.altKey) sorters = new Array();
            else {
                if (matchingSorter) Ext.Array.remove(sorters,matchingSorter);
            }
            if (!event.altKey) sorters.push(newSort);

            if (pagedlist.deeplinkPaging) {
                if (me.up('[doDeepLink]')) {
                    me.up('[doDeepLink]').doDeepLink(null, sorters);
                }
                else {
                    Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', {
                        listItem: pagedlist[btn.xtypeProperty],
                        flex: 1,
                        sorts: sorts
                    });
                }
            }
            else {
                pagedlist.store.sort(sorters);
                var sortItems = listItemHeader.query('[sort=true][dataField],[sort=true][sortOn]');
                for (var i = 0; i < sortItems.length; i++) sortItems[i].fireEvent('refreshsort', sortItems[i]);
            }
        }
    }
});