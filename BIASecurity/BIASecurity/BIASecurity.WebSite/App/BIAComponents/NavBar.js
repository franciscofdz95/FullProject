Ext.define('BIA.components.NavBar', {
    extend: 'Ext.container.Container',
    alias: 'widget.BIA-Components-NavBar',
    xtype: 'navbar',

    //groupedItems: undefined,


    forceResize: function forceResize() {
        if (this.rendered) {
            this.fireEvent('forceResize', this, this.getWidth(), this.getHeight(), this.getWidth(), this.getHeight());
        }
    },

    initComponent: function initComponent() {
        if (!this.cls) { this.cls = 'BIA_Components_NavBar'; }
        else if (this.cls && this.cls.indexOf('BIA_Components_NavBar') == -1) { this.cls += ' BIA_Components_NavBar'; }

        this.layout = 'column';

        this.style = Ext.apply({
            backgroundColor: '#EBEBE6'
        },
            this.style);

        this.defaults = Ext.apply({
            margin: '10 20'
        }, this.defaults);

        this.items = [];

        this.callParent(arguments);
    }
});

Ext.define('BIA.controller.NavBar', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        var me = this;

        me.control({
            'BIA-Components-NavBar': {
                beforerender: this.NavBarBeforeRender,
                resize: {
                    element: 'el',
                    fn: this.NavBarResize
                },
                forceResize: this.NavBarResize
            }
        });
        me.listen({});
    },
    NavBarBeforeRender: function NavBarBeforeRender(me, eOpts) {
        Ext.suspendLayouts();
        if (me.groupedItems.length > 0) {
            for (index in me.groupedItems) {
                var layout = {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'center'
                };
                if (index == 0) {
                    layout.pack = 'begin';
                }
                else if (index == me.groupedItems.length - 1) {
                    layout.pack = 'end';
                }

                me.add({
                    xtype: 'container',
                    //margin: '10 20 10 10',
                    groupContainer: i,
                    cls: 'NavBarGroupContainer',
                    layout: layout,
                    //defaults: {
                    //    margin: '0 5 0 5'
                    //},
                    items: Ext.isArray(me.groupedItems[index]) ? me.groupedItems[index] : [me.groupedItems[index]]
                });
            }
        }
        Ext.resumeLayouts({ root: true });
    },
    GetComponentsLeftRightMargin: function GetComponentsLeftRightMargin(cmp) {
        var myMargin = 0;
        if (cmp.margin && Ext.isNumeric(cmp.margin)) {
            myMargin = cmp.margin * 2;
        }
        else if (cmp.margin) {
            myMargin = Number(cmp.margin.split(' ')[1]) + Number(cmp.margin.split(' ').length > 3 ? cmp.margin.split(' ')[3] : cmp.margin.split(' ')[1]);
        }
        else if (cmp.el) {
            myMargin = cmp.getEl().getMargin('lr');
        }

        return myMargin;
    },
    GetComponentsLeftRightPadding: function GetComponentsLeftRightPadding(cmp) {
        var myPadding = 0;
        if (cmp.padding && Ext.isNumeric(cmp.padding)) {
            myPadding = cmp.padding * 2;
        }
        else if (cmp.padding) {
            myPadding = Number(cmp.padding.split(' ')[1]) + Number(cmp.padding.split(' ').length > 3 ? cmp.padding.split(' ')[3] : cmp.padding.split(' ')[1]);
        }
        else if (cmp.el) {
            var myMargin = cmp.getEl().getPadding('lr');
        }

        return myPadding;
    },
    NavBarResize: function NavBarResize(me, newWidth, newHeight, oldWidth, oldHeight, eOpts) {
        Ext.suspendLayouts();
        var children = me.query('>');       //Get all direct children of NavBar (NavBar Item Containers)
        var totalWidth = 0;                 //Width including margin of all NavBar Children Items
        var childrenWidth = [];             //Array of each NavBar Child Item's width
        var middleChildrenWidth = [];       //Array of each NavBar Child Item's width excluding first and last child
        var addExtraSpacing = false;

        for (index in children) {           //Loop through all NavBar Child Items
            var myChildren = children[index].query('>');        //Get all direct children of current NavBar Child Item
            var myWidth = 0;                //Width of current NavBar Child Item
            for (var i in myChildren) {         //Loop through all current NavBar Child Item's children, get the current NavBar Child Item's current child's width including margin
                myWidth += myChildren[i].getWidth() + this.GetComponentsLeftRightMargin(myChildren[i]);
            }

            myWidth += this.GetComponentsLeftRightPadding(children[index]);     //Add padding of current NavBar Child Item to its width
            children[index].setWidth(myWidth);                                  //Set width of current NavBar Child Item to the calculated width
            totalWidth += myWidth + this.GetComponentsLeftRightMargin(children[index]);     //Add width and margin of current NavBar Child Item to total of all children's width
            childrenWidth.push(myWidth + this.GetComponentsLeftRightMargin(children[index]));       //Add width and margin of NavBar Child Item to array of all children's width
            if (index != 0 && index != children.length - 1) {       //If not first or last child, add width and margin of NavBar Child Item to array of all children's width
                middleChildrenWidth.push(myWidth + this.GetComponentsLeftRightMargin(children[index]));
            }
        }//End NavBar Children Items loop

        var lineStartIndex = 0;

        for (index in children) {
            if (index > 0) {
                var currentRowWidth = 0;
                for (i in childrenWidth) {
                    if (i > index) { break; }
                    if (i >= lineStartIndex) { currentRowWidth += childrenWidth[i]; }
                }

                if (currentRowWidth + this.GetComponentsLeftRightPadding(me) > newWidth) {
                    if (index - lineStartIndex > 1) {
                        children[index - 1].rowPosition = 'end~' + lineStartIndex.toString();
                        for (i = lineStartIndex + 1; i < index - 1; i++) {
                            children[i].rowPosition = 'middle~' + lineStartIndex.toString() + '~' + (index - 1).toString();
                        }
                    }
                    children[index].setLayout({ type: 'hbox', align: 'middle', pack: 'start' });
                    lineStartIndex = index;
                    children[index].rowPosition = 'start';
                }
                else {
                    if (index == children.length - 1) {
                        if (index - lineStartIndex > 1) {
                            for (i = lineStartIndex + 1; i < index; i++) {
                                children[i].rowPosition = 'middle~' + lineStartIndex.toString() + '~' + index.toString();
                            }
                        }
                        children[index].rowPosition = 'end~' + lineStartIndex.toString();
                    }
                }
            }
            else {
                children[index].rowPosition = 'start';
            }
        }

        for (index in children) {
            if (children[index].rowPosition == 'start') {
                children[index].setLayout({ type: 'hbox', align: 'middle', pack: 'start' });
                if (Ext.Array.findBy(children, function (item, i) { return i > index && item.rowPosition.indexOf('end') > -1; }) == null) {
                    children[index].setWidth(newWidth - this.GetComponentsLeftRightPadding(me) - this.GetComponentsLeftRightMargin(children[index]));
                }
            }
            else if (children[index].rowPosition.indexOf('middle') > -1) {
                var rowStartIndex = children[index].rowPosition.split('~')[1] * 1;
                var rowEndIndex = children[index].rowPosition.split('~')[2] * 1;
                var rowLeftWidth = newWidth - this.GetComponentsLeftRightPadding(me) - childrenWidth[rowStartIndex] - childrenWidth[rowEndIndex];
                var rowMiddleWidths = (rowLeftWidth / (rowEndIndex - rowStartIndex - 1));
                if (childrenWidth[index] < rowMiddleWidths) {
                    if (!addExtraSpacing) { rowMiddleWidths -= 1; addExtraSpacing = true; }
                    childrenWidth[index] = rowMiddleWidths;
                    children[index].setWidth(rowMiddleWidths - this.GetComponentsLeftRightMargin(children[index]));
                }
                children[index].setLayout({ type: 'hbox', align: 'middle', pack: 'center' });
            }
            else if (children[index].rowPosition.indexOf('end') > -1) {
                var rowStartIndex = children[index].rowPosition.split('~')[1] * 1;
                if (index - 1 == rowStartIndex) {
                    var newChildWidth = newWidth - this.GetComponentsLeftRightPadding(me) - childrenWidth[rowStartIndex] - this.GetComponentsLeftRightMargin(children[index]);
                    if (!addExtraSpacing) { newChildWidth -= 1; addExtraSpacing = true; }
                    children[index].setWidth(newChildWidth);

                }
                children[index].setLayout({ type: 'hbox', align: 'middle', pack: 'end' });
            }

            delete children[index].rowPosition;                 //Remove rowPosition store info
        }

        me.updateLayout({ root: true });

        Ext.resumeLayouts(true);
    }
});