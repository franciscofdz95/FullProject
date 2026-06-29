BIACore.define('BIACore.Header.ExtJSVal', {}, function (me) {
    var failedObjects = [];
    var fileCheckError = null;
    var distinctClassNamesToCheck = [];
    var componentStructure = [];
    var fileCheckReturn = null;
    var resultsWindow = null;
    var totalObjectsAnalyzed = 0;

    var ExtComponentEval = function () {
        if (typeof Ext != "undefined") {
            failedObjects = [];
            distinctClassNamesToCheck = [];
            var recursiveViewDive = function (view, parentView, depth) {
                totalObjectsAnalyzed++;
                depth = depth || 1;
                var viewObject = {
                    view: {
                        xtype: view.xtype,
                        xtypes: view.xtypes,
                        className: view.$className,
                        depth: depth,
                        id: view.id,
                        owner: parentView
                    }
                };

                var matchingXtypeClassName = false;

                for (i in view.xtypes) {
                    if (view.xtypes[i].toLowerCase() === view.$className.replace(/\./g, '-').toLowerCase()) {
                        matchingXtypeClassName = true;
                        viewObject.view.xtype = view.xtypes[i];
                    }
                }

                viewObject.view.validateXtypeClassName = matchingXtypeClassName;

                viewObject.view.hierarchyString = (parentView != null ? parentView.hierarchyString + '~' : '') + viewObject.view.className;

                if (view.$className.indexOf('BIA.') == -1 && view.$className.indexOf('Ext.') == -1) {
                    if (!matchingXtypeClassName
                        && Ext.Array.pluck(failedObjects.filter(function (obj) { return obj.failType == 1; }), 'className').indexOf(viewObject.view.className) < 0)
                        failedObjects.push({ className: viewObject.view.className, xtype: viewObject.view.xtype, failType: 1 });

                    if ((viewObject.view.xtype.search(/[a,A]pp-[v,V]iew-/g) != 0 && viewObject.view.className.search(/[a,A]pp\.[v,V]iew\./g) == 0)
                        && Ext.Array.pluck(failedObjects.filter(function (obj) { return obj.failType == 4; }), 'className').indexOf(viewObject.view.className) < 0)
                        failedObjects.push({ className: viewObject.view.className, xtype: viewObject.view.xtype, failType: 4 });

                    if (!Ext.Array.contains(distinctClassNamesToCheck, view.$className)) distinctClassNamesToCheck.push(view.$className);

                }

                if (view.items && view.items.length > 0) {
                    viewObject.viewItems = [];
                    var newDepth = depth + 1
                    for (i in view.items.items) {
                        viewObject.viewItems.push(recursiveViewDive(view.items.items[i], viewObject.view, newDepth));
                    }
                }
                return viewObject;
            }
            cmpStructure = recursiveViewDive(Ext.ComponentQuery.query('viewport')[0]);
        }
    };
    var FolderStructureVal = function () {
        if (typeof Ext != "undefined" && distinctClassNamesToCheck.length > 0) {
            BIACore.ajax({
                url: BIACore.URL.ExtJSVal,
                dataType: 'json',
                async: false,
                data: {
                    DistinctClassNames: distinctClassNamesToCheck.join(','),
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal()
                },
                success: function (data) {
                    fileCheckError = null;
                    fileCheckReturn = Ext.clone(data);
                },
                error: function (jqxhr, status, error) {
                    fileCheckError = status + ': ' + jqxhr.responseText;
                    fileCheckReturn = null;
                }
            });

            // { ClassName: '', FileFound: true/false, ErrorMessage: '' [only on FileExist error] }
            var classNamesVerified = Ext.Array.pluck(fileCheckReturn.ClassNames || [{}], 'ClassName');
            var structureDeepDive = function (obj, fileCheckReturn) {
                if (obj.view.className.indexOf('BIA.') == -1 && obj.view.className.indexOf('Ext.') == -1) {
                    //Check if in FileExist and passed
                    var verIndex = classNamesVerified.indexOf(obj.view.className);
                    if (verIndex > -1) {
                        var matchingVerification = fileCheckReturn.ClassNames[verIndex];
                        if (matchingVerification && Ext.isObject(matchingVerification)) {
                            if (!matchingVerification.FileFound
                                && Ext.Array.pluck(failedObjects.filter(function (o) { return o.failType || 0 == 2; }), 'className').indexOf(obj.view.className) < 0) {
                                failedObjects.push({ className: obj.view.className, xtype: obj.view.xtype, failType: 2, msg: matchingVerification.ErrorMessage });
                            }
                        }
                    }

                    //Validate Depth
                    var testClassName = obj.view.className.replace(/[a,A]pp\./g, '');
                    if ((testClassName.split('.').length > obj.view.depth + 1 ||
                        testClassName.split('.').length < obj.view.depth - 1)
                        && Ext.Array.pluck(failedObjects, 'id').indexOf(obj.view.id) < 0)
                        failedObjects.push({
                            className: obj.view.className,
                            xtype: obj.view.xtype,
                            failType: 3,
                            id: obj.view.id,
                            depth: obj.view.depth,
                            expectedDepth: testClassName.split('.').length,
                            hierarchyString: obj.view.hierarchyString
                        });

                    //Dive into object's items if any exist
                    if (obj.viewItems && obj.viewItems.length > 0)
                        for (i in obj.viewItems) structureDeepDive(obj.viewItems[i], fileCheckReturn);
                }
            };
            structureDeepDive(cmpStructure, fileCheckReturn);
        }
    };
    var DisplayResults = function () {
        if (typeof Ext != "undefined") {
            Ext.suspendLayouts();
            var display = resultsWindow.down('#ExtJSValResultsDisplay');

            var distinctComopnentsAnalyzed = distinctClassNamesToCheck.length,
                compWithErrors = 0,
                compWithWarnings = 0,
                compWithErrorsAndWarnings = 0;

            if (failedObjects.length > 0) {
                Ext.define('ExtJS.Val.AliasClassNameFail', {
                    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
                    alias: 'widget.ExtJS-Val-AliasClassNameFail',
                    cls: 'ErrorFail',
                    bind: {
                        html: '<i class="fa fa-times-circle" style="font-size: 16px; color: red"></i>&nbsp;&nbsp;' +
                            'Alias-ClassName Validation Mismatch [{analyzedClassName} <-> {analyzedXtype}]'
                    }
                });
                Ext.define('ExtJS.Val.FileStructureFail', {
                    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
                    alias: 'widget.ExtJS-Val-FileStructureFail',
                    cls: 'ErrorFail',
                    bind: {
                        html: '<i class="fa fa-times-circle" style="font-size: 16px; color: red"></i>&nbsp;&nbsp;' +
                            'File Structure Fail: {errorMsg}'
                    }
                });
                Ext.define('ExtJS.Val.StructureDepthFail', {
                    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
                    alias: 'widget.ExtJS-Val-StructureDepthFail',
                    cls: 'WarningFail',
                    bind: {
                        html: '<i class="fa fa-exclamation-triangle" style="font-size: 16px; color: orange"></i>&nbsp;&nbsp;' +
                            '{className} failed Structure Depth check, at depth {depth} expected {expectedDepth} +/-1 ({id})' +
                            '{hierarchyDisplay}'
                    }
                });
                Ext.define('ExtJS.Val.XtypeMissingAppViewFail', {
                    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
                    alias: 'widget.ExtJS-Val-XtypeMissingAppViewFail',
                    cls: 'InfoFail',
                    bind: {
                        html: '<i class="fa fa-info-circle" style="font-size: 16px; color: #4274FF"></i>&nbsp;&nbsp;' +
                            '{xtype} missing App-View- folder structure prefix. (Old naming convention).'
                    }
                });
                Ext.define('ExtJS.Val.ComponentDisplay', {
                    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
                    alias: 'widget.ExtJS-Val-ComponentDisplay',
                    layout: {
                        type: 'vbox',
                        align: 'start',
                        pack: 'begin'
                    },
                    margin: 8,
                    defaults: {
                        margin: '0 0 0 15',
                        padding: 5,
                        style: { fontSize: '12px' }
                    },
                    style: {
                        boxShadow: 'rgba(0, 0, 0, 0.137255) 0px 2px 2px 1px, rgba(0, 0, 0, 0.117647) 0px 1px 5px 2px, rgba(0, 0, 0, 0.2) 0px 3px 1px 0px',
                        borderRadius: '3px',
                        backgroundColor: 'white'
                    },
                    items: [
                        {
                            xtype: 'container',
                            itemId: 'ClassNameDisplay',
                            margin: 0,
                            style: {
                                fontSize: '14px'
                            },
                            bind: {
                                //html: '{analyzedClassName} ({analyzedXtype})'
                                html: '{className} ({xtype})'
                            }
                            //TODO: Split className and xtype, bold the parts that do not match (case-insensitive)
                        }
                    ]
                });

                var classesLeft = Ext.Array.unique(Ext.Array.pluck(failedObjects, 'className'));

                for (cls in classesLeft) {
                    var clsFailedObjects = Ext.Array.filter(failedObjects, function (item, index, array) { return item.className == classesLeft[cls]; });
                    if (clsFailedObjects.length > 0) {
                        clsFailedObjects = Ext.Array.sort(clsFailedObjects, function (a, b) { return a.failType > b.failType ? 1 : a.failType < b.failType ? -1 : 0; });
                        var diffXtypeClassName = function (xtype, className) {
                            var xtypeArray = xtype.split('-'),
                                classNameArray = className.split('.'),
                                mismatchFound = false;

                            for (i = 0; i < (classNameArray.length > xtypeArray.length ? classNameArray.length : xtypeArray.length); i++) {
                                if (!mismatchFound) {
                                    if (xtypeArray.length <= i || classNameArray.length <= i ||
                                        xtypeArray[i].toLowerCase() != classNameArray[i].toLowerCase()) {
                                        mismatchFound = true;
                                    }
                                }

                                if (mismatchFound) {
                                    if (xtypeArray.length > i) xtypeArray[i] = '<span style="background-color: #51FF4E">' + xtypeArray[i] + '</span>';
                                    if (classNameArray.length > i) classNameArray[i] = '<span style="background-color: #FFD84A">' + classNameArray[i] + '</span>';
                                }
                            }

                            return { xtype: xtypeArray.join('-'), className: classNameArray.join('.') };
                        };

                        var classNameDisplay = display.add({
                            xtype: 'ExtJS-Val-ComponentDisplay',
                            viewModel: {
                                data: clsFailedObjects[0]
                            },
                            failedObject: clsFailedObjects[0]
                        });

                        var errorFail = false,
                            warningFail = false,
                            infoFail = false;

                        var aliasClassNameFail = Ext.Array.findBy(clsFailedObjects, function (item, index) { return item.failType == 1; });
                        if (aliasClassNameFail) {
                            classNameDisplay.add({
                                xtype: 'ExtJS-Val-AliasClassNameFail',
                                viewModel: {
                                    data: aliasClassNameFail,
                                    formulas: {
                                        analyzedXtype: function (get) {
                                            return diffXtypeClassName(this.data.xtype, this.data.className).xtype;
                                        },
                                        analyzedClassName: function (get) {
                                            return diffXtypeClassName(this.data.xtype, this.data.className).className;
                                        }
                                    }
                                },
                                failedObject: aliasClassNameFail
                            });
                            errorFail = true;
                            classNameDisplay.addCls('ErrorContainer');
                        }

                        var folderStructureFail = Ext.Array.findBy(clsFailedObjects, function (item, index) { return item.failType == 2; });
                        if (folderStructureFail) {
                            classNameDisplay.add({
                                xtype: 'ExtJS-Val-FileStructureFail',
                                viewModel: {
                                    data: folderStructureFail,
                                    formulas: {
                                        errorMsg: function (get) {
                                            return this.data.msg || 'File not found in folder structure ' + this.data.className.replace(/\./g, '\\') + '.js';
                                        }
                                    }
                                },
                                failedObject: folderStructureFail
                            });
                            errorFail = true;
                            classNameDisplay.addCls('ErrorContainer');
                        }

                        var structureDepthFail = Ext.Array.filter(clsFailedObjects, function (item, index, array) { return item.failType == 3; });
                        if (structureDepthFail.length > 0) {
                            for (var i = 0; i < structureDepthFail.length; i++) {
                                classNameDisplay.add({
                                    xtype: 'ExtJS-Val-StructureDepthFail',
                                    viewModel: {
                                        data: structureDepthFail[i],
                                        formulas: {
                                            hierarchyDisplay: function (get) {
                                                var hierarchy = get('hierarchyString').split('~'),
                                                    levelDownIcon = '<i class="fa fa-level-up fa-rotate-90" style="font-size: 16px; margin-left: 2px; margin-right: 6px;"></i>',
                                                    hierarchyDisplay = '',
                                                    baseLeftMarginFactor = 18;
                                                for (var i = 0; i < hierarchy.length; i++) {
                                                    hierarchyDisplay += '<div style="margin-left: ' + (baseLeftMarginFactor * (i + 1)) + 'px;' +
                                                        (i + 1 == get('expectedDepth') ? ' background-color: #84AAFF' : '') + '">' +
                                                        (i > 0 ? levelDownIcon : '') + hierarchy[i] +
                                                        (i + 1 == get('expectedDepth') ? ' (Expected Depth)' : '') +
                                                        '</div>';
                                                }
                                                return hierarchyDisplay;
                                            }
                                        }
                                    },
                                    failedObject: structureDepthFail[i]
                                });
                            }
                            warningFail = true;
                            classNameDisplay.addCls('WarningContainer');
                        }

                        var xtypeOldNamingConventionFail = Ext.Array.findBy(clsFailedObjects, function (item, index) { return item.failType == 4; });
                        if (xtypeOldNamingConventionFail) {
                            classNameDisplay.add({
                                xtype: 'ExtJS-Val-XtypeMissingAppViewFail',
                                viewModel: {
                                    data: xtypeOldNamingConventionFail
                                },
                                failedObject: xtypeOldNamingConventionFail
                            });
                            infoFail = true;
                            classNameDisplay.addCls('InfoContainer');
                        }

                        classNameDisplay.errorFail = errorFail;
                        classNameDisplay.warningFail = warningFail;
                        classNameDisplay.infoFail = infoFail;

                        if (errorFail) classNameDisplay.addCls('ErrorContainer');
                        if (warningFail) classNameDisplay.addCls('WarningContainer');
                        if (infoFail) classNameDisplay.addCls('MessageContainer');
                    }
                }
            }
            else {
                display.add({
                    xtype: 'container',
                    html: '<i class="fa fa-check-circle" style="font-size: 20px; color: green;"></i>&nbsp;&nbsp;ExtJS Component Structure is 100% Compliant'
                });
            }

            //resultsWindow.setConfig('title', Ext.String.format('Total: {0}, Analyzed: {1}, With Errors & Warnings: {2}, With Errors: {3}, With Warnings: {4}',
            //    totalObjectsAnalyzed, distinctComopnentsAnalyzed, compWithErrorsAndWarnings, compWithErrors, compWithWarnings));;

            var errorCount = display.query('[cls="ErrorFail"]').length,
                warningCount = display.query('[cls="WarningFail"]').length,
                infoCount = display.query('[cls="InfoFail"]').length;


            Ext.define('ExtJS.Val.Header.FilterButton', {
                extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
                alias: 'widget.ExtJS-Val-Header-FilterButton',
                cls: 'ExtJSHeaderFilterButton ShowFails',
                padding: 10,
                bind: {
                    html: '<i class="fa fa-{iconClass}" style="font-size: 16px; color: {iconColor}"></i>&nbsp;&nbsp;{count} {failType}',
                    hidden: '{!count}'
                },
                listeners: {
                    added: function (me, container, position, eOpts) {
                        me.addListener({
                            click: {
                                element: 'el',
                                fn: function (me, event, element, eOpts) {
                                    var delayFn = function () {
                                        var window = me.up('#ExtJSValResults');
                                        if (window) {
                                            if (window.hasCls(me.windowClass)) {
                                                window.removeCls(me.windowClass);
                                                me.removeCls('ShowFails');
                                                var fails = window.query('[cls="' + me.failClass + '"]');
                                                for (i in fails) {
                                                    fails[i].hide();
                                                    if (fails[i].up('ExtJS-Val-ComponentDisplay').query('[itemId!="ClassNameDisplay"][hidden=false]').length == 0)
                                                        fails[i].up('ExtJS-Val-ComponentDisplay').hide();
                                                }
                                            }
                                            else {
                                                window.addCls(me.windowClass);
                                                me.addCls('ShowFails');
                                                var fails = window.query('[cls="' + me.failClass + '"]');
                                                for (i in fails) {
                                                    fails[i].show();
                                                    fails[i].up('ExtJS-Val-ComponentDisplay').show();
                                                }
                                            }

                                            if (window.isMasked()) window.unmask();
                                            window.center();
                                        }
                                        else {
                                            me.addCls('ShowFails');
                                        }
                                    };
                                    var window = me.up('#ExtJSValResults');
                                    if (window && !window.isMasked()) window.mask('Filtering');
                                    Ext.defer(delayFn, 10);
                                },
                                args: [me]
                            }
                        })
                    }
                }
            });

            Ext.define('ExtJS.Val.Header', {
                extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
                alias: 'widget.ExtJS-Val-Header',
                cls: 'ExtJSValHeader',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'center'
                },
                padding: '5 10',
                defaults: {
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'center'
                    }
                },
                items: [
                    {
                        xtype: 'container',
                        flex: 1,
                        items: [
                            {
                                xtype: 'container',
                                html: 'Total: ' + totalObjectsAnalyzed
                            },
                            { xtype: 'tbfill', flex: 1 },
                            {
                                xtype: 'container',
                                html: 'Analyzed: ' + distinctComopnentsAnalyzed
                            },
                            { xtype: 'tbfill', flex: 3 }
                        ]
                    },
                    {
                        xtype: 'container',
                        flex: 1,
                        items: [
                            {
                                xtype: 'ExtJS-Val-Header-FilterButton',
                                viewModel: {
                                    data: {
                                        iconClass: 'times-circle',
                                        iconColor: 'red',
                                        count: errorCount,
                                        failType: 'Errors'
                                    }
                                },
                                windowClass: 'ShowErrors',
                                failClass: 'ErrorFail'
                            },
                            { xtype: 'tbfill', flex: 1 },
                            {
                                xtype: 'ExtJS-Val-Header-FilterButton',
                                viewModel: {
                                    data: {
                                        iconClass: 'exclamation-triangle',
                                        iconColor: 'orange',
                                        count: warningCount,
                                        failType: 'Warnings'
                                    }
                                },
                                windowClass: 'ShowWarnings',
                                failClass: 'WarningFail'
                            },
                            { xtype: 'tbfill', flex: 1 },
                            {
                                xtype: 'ExtJS-Val-Header-FilterButton',
                                viewModel: {
                                    data: {
                                        iconClass: 'info-circle',
                                        iconColor: '#4274FF',
                                        count: infoCount,
                                        failType: 'Messages'
                                    }
                                },
                                windowClass: 'ShowMessages',
                                failClass: 'InfoFail'
                            }
                        ]
                    }
                ]
            });

            var header = resultsWindow.addDocked({ xtype: 'ExtJS-Val-Header' }, 0);

            Ext.resumeLayouts(true);

            display.show();
            resultsWindow.updateLayout();
            resultsWindow.down('#ExtJSValResultsLoading').hide();
            resultsWindow.center();
        }
    };
    BIACore.apply(me, {
        Evaluate: function () {
            if (typeof Ext != "undefined") {
                resultsWindow = Ext.create('Ext.window.Window', {
                    modal: true,
                    itemId: 'ExtJSValResults',
                    layout: {
                        type: 'vbox',
                        align: 'stretchMax',
                        pack: 'begin'
                    },
                    title: 'BIA ExtJS Standards and Compliance Validator',
                    cls: 'ShowErrors ShowWarnings ShowMessages',
                    height: '90%',
                    minHeight: 500,
                    maxWidth: '90%',
                    minWidth: 500,
                    scrollable: true,
                    style: {
                        backgroundColor: 'white'
                    },
                    items: [
                        {
                            xtype: 'container',
                            itemId: 'ExtJSValResultsLoading',
                            style: {
                                textAlign: 'center'
                            },
                            html: '<i class="fa fa-spinner fa-pulse" style="font-size: 24px;"></i>&nbsp;&nbsp;Analyzing',
                            flex: 1
                        },
                        {
                            xtype: 'container',
                            itemId: 'ExtJSValResultsDisplay',
                            hidden: true,
                            layout: {
                                xtype: 'vbox',
                                align: 'start',
                                pack: 'begin'
                            }
                        }
                    ]
                });

                resultsWindow.show();

                ExtComponentEval();

                if (distinctClassNamesToCheck.length > 0) FolderStructureVal();

                DisplayResults();
            }
        }
    });
});