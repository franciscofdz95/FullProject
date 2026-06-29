var objLocationTreeObject = null, objTradeLaneAccessTreeObject, currentWinObj = null;
Ext.define('App.Controller.EA.EAQuoteAssist', {
    extend: 'Ext.app.Controller',
    refs: [
        {
            ref: 'UserAccess',
            selector: 'App.View.EA.EAQuoteAssist'
        }
    ],
    thisWindow: null,
    init: function () {
        this.control({
            'App-View-EA-EAQuoteAssist': {
                show: this.windowShow,
                close: this.windowClose
            },
            'App-View-EA-EAQuoteAssist #btnSave': {
                click: this.saveUserAccessConfiguration
            },
            'App-View-EA-EAQuoteAssist #btnCancel': {
                click: this.closeWindow
            },
            'App-View-EA-EAQuoteAssist #reconLocationTree': {
                beforerender: this.assignLocationTreeObject
            },
            'App-View-EA-EAQuoteAssist #tradeLaneAccessTree': {
                beforerender: this.assignTradeLaneAccessTreeObject
            }
        });
    },
    assignLocationTreeObject: function (obj) {
        objLocationTreeObject = obj;
    },
    assignTradeLaneAccessTreeObject: function (obj) {
        objTradeLaneAccessTreeObject = obj;
    },
    windowShow: function (window) {
        var windowheight = Ext.getBody().getViewSize().height;
        var windowwidth = Ext.getBody().getViewSize().width;
        currentWinObj = window;

        //var innerHtml = '<table style=\'width:100%;padding-top:1%;\'>';
        //innerHtml = innerHtml + '<tr>';
        //innerHtml = innerHtml + '<td style=\'width:40%;text-align:right;vertical-align:middle\'>';
        //innerHtml = innerHtml + '<label id=\'lblUsrStmnt\' style=\'font-weight: bold;\'>Select user to modify access</label>';
        //innerHtml = innerHtml + '</td>';
        //innerHtml = innerHtml + '<td style=\'width:20%;text-align:center;vertical-align:middle\'>';
        //innerHtml = innerHtml + '<input type=\'text\' id=\'txtSelUser\' style=\'width:100%;font-weight:bold;\' list=\'userList\' autocomplete=\'off\' onkeyup=\'javascript:dynamicObjectEvents.getUserList(this);\' onchange=\'javascript:dynamicObjectEvents.selectDataListOption(this);\' />';
        //innerHtml = innerHtml + '<datalist id=\'userList\'></datalist>';
        //innerHtml = innerHtml + '</td>';
        //innerHtml = innerHtml + '<td style=\'width:40%;text-align:left;vertical-align:middle\'>';
        //innerHtml = innerHtml + '<input type=\'checkbox\' id=\'SUPER_USER\' name=\'nmSuMain\' value=\'1\' onchange=\'javascript:dynamicObjectEvents.setSuperUserPrivileges(this);\' /><sup style=\'font-weight:bold\'>1</sup><span style=\'font-weight:bold\'>&nbsp;Super User</span>';
        //innerHtml = innerHtml + '</td>';
        //innerHtml = innerHtml + '</tr>';
        //innerHtml = innerHtml + '</table>';

        //Ext.get('clmQAUsrSelection-innerCt').update(innerHtml);

        var quoteAssistEzQuoteList = {
            'checkboxes': [
                { 'sup': '1', 'disp': 'EZ Quote', 'id': 'EZQUOTE', 'name': 'nmQae' },
                { 'sup': '1', 'disp': 'Cost View', 'id': 'COST_VIEW', 'name': 'nmQae' },
                { 'sup': '1', 'disp': 'Trade Direct User', 'id': 'IS_TDO', 'name': 'nmQae' },
                { 'sup': '1', 'disp': 'Billing View', 'id': 'BILLING_VIEW', 'name': 'nmQae' },
                { 'sup': '1', 'disp': 'Rate Extractor', 'id': 'EXTRACT_RATES', 'name': 'nmQae' },
                { 'sup': '1', 'disp': 'Edit X Surcharge', 'id': 'EDIT_XSURCHARGE', 'name': 'nmQae' },
                { 'sup': '1', 'disp': 'Edit Additional Chg', 'id': 'EDIT_ADDITIONAL_CHARGES', 'name': 'nmQae' },
                { 'sup': '1 6', 'disp': 'LCL Calculator', 'id': 'LCL_CALC_USER', 'name': 'nmQae' },
                { 'sup': '1', 'disp': 'Carrier Contract Audit', 'id': 'CARRIER_CONTRACT_AUDIT', 'name': 'nmQae' },
                { 'sup': '', 'disp': 'Custom Rate Creator', 'id': 'CUSTOM_RATE', 'name': 'nmQae' },
                { 'sup': '', 'disp': 'Margin Floor User', 'id': 'MARGIN_FLOOR_USER', 'name': 'nmQae' },
                { 'sup': '', 'disp': 'Booking User', 'id': 'IS_E2K_USER', 'name': 'nmQae' }
            ]
        }

        var customerProfileList = {
            'checkboxes': [
                { 'sup': '1 *2', 'disp': 'Customer Profile Admin', 'id': 'CPD_ADMIN', 'name': 'nmCpr' },
                { 'sup': '1 2', 'disp': 'Customer Profile User', 'id': 'CPD', 'name': 'nmCpr' }
            ]
        }

        var tliAdjustmentList = {
            'checkboxes': [
                { 'sup': '1 * 3', 'disp': 'TLI Super User', 'id': 'TLI_SA', 'name': 'nmTli' },
                { 'sup': '1 3 * 4', 'disp': 'TLI Administrator', 'id': 'TLI_ADMIN', 'name': 'nmTli' },
                { 'sup': '1 3 4', 'disp': 'TLI Adjuster', 'id': 'TLI_ADJUSTER', 'name': 'nmTli' }
            ]
        }

        var reQuotingList = {
            'checkboxes': [
                { 'sup': '1 * 5', 'disp': 'Requote Admin', 'id': 'REQUOTE_ADMIN_REG', 'name': 'nmQt' },
                { 'sup': '1 5', 'disp': 'Requote Adjuster', 'id': 'REQUOTE_REQUESTOR_REG', 'name': 'nmQt' },
                { 'sup': '1 5', 'disp': 'Reg Requote Approver', 'id': 'REQUOTE_APPROVER_REG', 'name': 'nmQt' },
                { 'sup': '1 5', 'disp': 'Nonreg Requote Approver', 'id': 'REQUOTE_APPROVER_NONREG', 'name': 'nmQt' },
                { 'sup': '', 'disp': 'GRI Exempt Admin', 'id': 'GRI_EXEMPT_ADMIN', 'name': 'nmQt' }
            ]
        }

        var qReconList = {
            'checkboxes': [
                { 'sup': '', 'disp': 'QRecon Access Grantor', 'id': 'QA_INSIGHT_GRANTOR', 'name': 'nmQRCon' },
                { 'sup': '', 'disp': 'FCL User', 'id': 'QA_INSIGHT', 'name': 'nmQRCon' },
                { 'sup': '', 'disp': 'LCL User', 'id': 'QA_INSIGHT_LCL', 'name': 'nmQRCon' },
                { 'sup': '', 'disp': 'User View', 'id': 'QA_INSIGHT_USERVIEW', 'name': 'nmQRCon' },
                { 'sup': '', 'disp': 'Autorate View', 'id': 'QA_INSIGHT_AUTORATEVIEW', 'name': 'nmQRCon' }
            ]
        }

        this.placeCheckBoxesInPanel(quoteAssistEzQuoteList.checkboxes, Ext.get('clmQtAssist-innerCt'));
        this.placeCheckBoxesInPanel(customerProfileList.checkboxes, Ext.get('clmCstmrPrfle-innerCt'));
        this.placeCheckBoxesInPanel(tliAdjustmentList.checkboxes, Ext.get('clmTliAdj-innerCt'));
        this.placeCheckBoxesInPanel(reQuotingList.checkboxes, Ext.get('clmReqot-innerCt'));
        this.placeCheckBoxesInPanel(qReconList.checkboxes, Ext.get('clmQRecon-innerCt'));

        currentWinObj.setHeight((windowheight > 609) ? ((75 / 100) * windowheight) : ((95 / 100) * windowheight));
        currentWinObj.setWidth((80 / 100) * windowwidth);
        currentWinObj.center();

        //Ext.get('txtSelUser').focus();
    },
    placeCheckBoxesInPanel: function (arrayList, panelObject) {
        for (var arrayListItmIndx = 0; arrayListItmIndx < arrayList.length; arrayListItmIndx++) {
            if (arrayList[arrayListItmIndx].sup)
                panelObject.dom.innerHTML = panelObject.dom.innerHTML + ' ' + '<input type=\'checkbox\' id=' + arrayList[arrayListItmIndx].id + ' name=' + arrayList[arrayListItmIndx].name + ' sup=' + arrayList[arrayListItmIndx].sup + ' /><sup>' + arrayList[arrayListItmIndx].sup + '</sup> ' + arrayList[arrayListItmIndx].disp + '<br />';
            else
                panelObject.dom.innerHTML = panelObject.dom.innerHTML + ' ' + '<input type=\'checkbox\' id=' + arrayList[arrayListItmIndx].id + ' name=' + arrayList[arrayListItmIndx].name + ' sup=\'\'  /> ' + arrayList[arrayListItmIndx].disp + '<br />';
        }
    },
    saveUserAccessConfiguration: function () {
        if (!dynamicObjectEvents.getSelectedAdId(document.getElementById('txtSelUser'))) {
            //Ext.get('txtSelUser').focus();
            Ext.MessageBox.alert('Comment', '<b>Please select a user first to save the attributes !</b>');
            return;
        }

        dynamicObjectEvents.initJsonPerChkboxCheckedState();
        var locationTreeCsv = dynamicObjectEvents.getSelectedNodeValueCsv(objLocationTreeObject);
        var tradeLaneAccessCsv = dynamicObjectEvents.getSelectedNodeValueCsv(objTradeLaneAccessTreeObject);

        var responsedata = {};
        var jsonData = {
            userProfileSettings: JSON.stringify(userAccesSettingsJSONArray),
            selectedLocationData: locationTreeCsv,
            selectedTradeLaneAccessData: tradeLaneAccessCsv
        };
        AjaxFunc.ServiceHit('api/Admin/BIASecurity/SaveUserProfileSettings_QuoteAssist', 'POST', false, jsonData,
            function onSuccess(resp) {
                if (!resp || !resp.responseText || resp.responseText.length < 1)
                    return;

                responsedata = JSON.parse(resp.responseText);
            }
        );

        if (responsedata.ResponseType)
            Ext.MessageBox.alert('Success', '<b>' + responsedata.Response + '</b>');
        else
            Ext.MessageBox.alert('Error', '<b>' + responsedata.Response + '</b>');
    },
    closeWindow: function () {
        currentWinObj.close();
    },
    windowClose: function () {
        dynamicObjectEvents.setUncheckAllChkBox();
        dynamicObjectEvents.refreshLocationTree();
        dynamicObjectEvents.refreshTradeLaneAccessTree();
    }
});

var userAccesSettingsJSONArray = {
    'USRSYSM': '0',
    'SUPER_USER': '0',
    'COST_VIEW': '0',
    'BILLING_VIEW': '0',
    'EZQUOTE': '0',
    'CPD': '0',
    'CPD_ADMIN': '0',
    'CUSTOM_RATE': '0',
    'TLI_ADJUSTER': '0',
    'TLI_ADMIN': '0',
    'EXTRACT_RATES': '0',
    'QA_INSIGHT': '0',
    'TLI_SA': '0',
    'IS_TDO': '0',
    'EDIT_XSURCHARGE': '0',
    'MARGIN_FLOOR_USER': '0',
    'QA_INSIGHT_GRANTOR': '0',
    'EDIT_ADDITIONAL_CHARGES': '0',
    'REQUOTE_REQUESTOR_REG': '0',
    'REQUOTE_APPROVER_REG': '0',
    'REQUOTE_APPROVER_NONREG': '0',
    'REQUOTE_ADMIN_REG': '0',
    'GRI_EXEMPT_ADMIN': '0',
    'QA_INSIGHT_LCL': '0',
    'LCL_CALC_USER': '0',
    'CARRIER_CONTRACT_AUDIT': '0',
    'QA_INSIGHT_USERVIEW': '0',
    'QA_INSIGHT_AUTORATEVIEW': '0',
    'IS_E2K_USER': '0',
},
    selectedLocationsJSON,
    selectedTradeLaneAccessJSON;

var dynamicObjectEvents = {
    getUserList: function (obj) {
        document.getElementById('userList').innerText = null;
        if (!obj.value || obj.value.length < 3)
            return;

        var data = null;
        var jsonData = {
            searchParam: obj.value
        };
        AjaxFunc.ServiceHit('api/Admin/BIASecurity/GetUserList', 'POST', false, jsonData,
            function onSuccess(resp) {
                if (!resp || !resp.responseText)
                    return;

                data = JSON.parse(resp.responseText);
            }
        );

        if (data.length < 1)
            return;

        var dataList = document.querySelector('#userList'), option;
        for (var indx = 0; indx < data.length; indx++) {
            option = document.createElement('option');
            option.setAttribute('value', data[indx].FirstName + ' ' + data[indx].LastName + ' [' + data[indx].ADID.toUpperCase() + ']');
            dataList.appendChild(option);
        }
    },
    setSuperUserPrivileges: function (obj) {
        this.setCheckUncheck(obj, 'nmQae');
        this.setCheckUncheck(obj, 'nmCpr');
        this.setCheckUncheck(obj, 'nmTli');
        this.setCheckUncheck(obj, 'nmQt');
        this.setCheckUncheck(obj, 'nmQRCon');
    },
    setCheckUncheck: function (obj, objName) {
        var checkboxCollection = document.getElementsByName(objName);
        for (var indx = 0; indx < checkboxCollection.length; indx++) {
            if (checkboxCollection[indx].getAttribute('sup').indexOf('1') !== -1)
                checkboxCollection[indx].checked = obj.checked;
        }
    },
    setUncheck: function (objName) {
        var checkboxCollection = document.getElementsByName(objName);
        for (var indx = 0; indx < checkboxCollection.length; indx++) {
            if (checkboxCollection[indx].getAttribute('sup').indexOf('1') !== -1)
                checkboxCollection[indx].checked = false;
        }
    },
    setUncheckAllChkBox: function () {
        this.setUncheck('nmQae');
        this.setUncheck('nmCpr');
        this.setUncheck('nmTli');
        this.setUncheck('nmQt');
        this.setUncheck('nmQRCon');
    },
    selectDataListOption: function (obj) {
        if (!obj.value)
            return;

        Ext.Msg.show({
            title: 'Working....',
            msg: '<b>Setting the environment as per user selection. Please wait !</b>',
            width: 450,
            progress: true,
            closable: false,
            icon: Ext.Msg.INFO
        });

        var value = this.getSelectedAdId(obj);
        if (!value)
            return;

        currentWinObj.setTitle('Modify Extended Attributes for ' + obj.value + '.');

        setTimeout(function () { dynamicObjectEvents.refreshLocationTree(); Ext.MessageBox.updateProgress(15, 'Data refreshed. [' + 15 + '% completed].'); }, 3000);
        setTimeout(function () { dynamicObjectEvents.refreshTradeLaneAccessTree(); Ext.MessageBox.updateProgress(30, 'Data refreshed. [' + 30 + '% completed].'); }, 3000);
        setTimeout(function () { dynamicObjectEvents.getSelectedLocations(value); Ext.MessageBox.updateProgress(45, 'Determining locations. [' + 45 + '% completed].'); }, 3000);
        setTimeout(function () { dynamicObjectEvents.getSelectedTradeLaneAccess(value); Ext.MessageBox.updateProgress(60, 'Determining trade lane access. [' + 60 + '% completed].'); }, 3000);
        setTimeout(function () { dynamicObjectEvents.getUserAccessConfiguration(value); Ext.MessageBox.updateProgress(80, 'Getting user location access. [' + 80 + '% completed].'); }, 3000);
        setTimeout(function () { dynamicObjectEvents.getLocationsTree(objLocationTreeObject, value); Ext.MessageBox.updateProgress(90, 'Getting available locations. [' + 90 + '% completed].'); }, 3000);
        setTimeout(function () { dynamicObjectEvents.getTradeLaneAccessTree(objTradeLaneAccessTreeObject, value); Ext.MessageBox.updateProgress(100, 'Getting trade lanes. [' + 100 + '% completed].'); }, 3000);
        setTimeout(function () { Ext.Msg.hide(); Ext.MessageBox.updateProgress(0, 'Initializing... [' + 0 + '% completed].'); }, 3000);
    },
    getSelectedAdId: function (obj) {
        try {
            var tbStart = obj.value.indexOf('[');
            var tbEnd = obj.value.indexOf(']');
            var value = obj.value.substring(tbStart + 1, tbEnd);
            return value;
        }
        catch (err) {
            return null;
        }
    },
    initJsonPerChkboxCheckedState: function () {
        this.assignValueToJsonArray('nmSuMain');
        this.assignValueToJsonArray('nmQae');
        this.assignValueToJsonArray('nmCpr');
        this.assignValueToJsonArray('nmTli');
        this.assignValueToJsonArray('nmQt');
        this.assignValueToJsonArray('nmQRCon');
    },
    assignValueToJsonArray: function (objName) {
        var checkboxCollection = document.getElementsByName(objName);
        for (var indx = 0; indx < checkboxCollection.length; indx++) {
            userAccesSettingsJSONArray[checkboxCollection[indx].id] = checkboxCollection[indx].checked ? '1' : '0';
        }
    },
    assignValueFromJsonArray: function (objName) {
        var checkboxCollection = document.getElementsByName(objName);
        for (var indx = 0; indx < checkboxCollection.length; indx++) {
            checkboxCollection[indx].checked = userAccesSettingsJSONArray[checkboxCollection[indx].id] == '1';
        }
    },
    getUserAccessConfiguration: function (objUsrsysm) {
        var jsonData = {
            UsrSysm: objUsrsysm
        };
        AjaxFunc.ServiceHit('api/Admin/BIASecurity/GetUserProfileSettings_QuoteAssist', 'POST', false, jsonData,
            function onSuccess(resp) {
                if (!resp || !resp.responseText)
                    return;

                userAccesSettingsJSONArray = JSON.parse(resp.responseText);
            }
        );

        this.assignValueFromJsonArray('nmSuMain');
        this.assignValueFromJsonArray('nmQae');
        this.assignValueFromJsonArray('nmCpr');
        this.assignValueFromJsonArray('nmTli');
        this.assignValueFromJsonArray('nmQt');
        this.assignValueFromJsonArray('nmQRCon');
    },
    getLocationsTree: function (obj, userIdAs) {
        var rootnode = obj.store.getRootNode();
        var treeNodes = rootnode.childNodes;
        for (var nodeIndx in treeNodes) {
            this.getCountries(treeNodes[nodeIndx], treeNodes[nodeIndx].id, rootnode, userIdAs);

            for (var innerindx = 0; innerindx < selectedLocationsJSON.length; innerindx++) {
                if (selectedLocationsJSON[innerindx].Location) {
                    itmChecked = selectedLocationsJSON[innerindx].Location.toUpperCase() == treeNodes[nodeIndx].id.split('_')[0].toUpperCase();
                    if (itmChecked) {
                        treeNodes[nodeIndx].set('checked', true);
                        break;
                    }
                    else
                        treeNodes[nodeIndx].set('checked', false);
                }
            }
        }
    },
    getCountries: function (nodeObject, dCode, rootNode, userIdAs) {
        var actualDCode = dCode.split('_')[0];
        var jsonData = {
            UserIDAsl: userIdAs,
            districtCode: actualDCode
        };

        var newnodelist = [], node, data;
        AjaxFunc.ServiceHit('api/Admin/App/GetUserAccessLocations', 'POST', false, jsonData,
            function onSuccess(resp) {
                if (!resp || !(resp.data || resp.data.length > 0))
                    return;

                data = resp.data;
            }
        );

        var itmChecked = false;
        for (var indx in data) {
            node = {
                id: data[indx].COUNTRY,
                text: data[indx].COUNTRY_NAME,
                checked: false,
                disabled: data[indx].alwaysDisabled ? data[indx].alwaysDisabled.toLowerCase() == 'true' : false,
                children: [],
                leaf: true
            }

            for (var innerindx = 0; innerindx < selectedLocationsJSON.length; innerindx++) {
                if (selectedLocationsJSON[innerindx].Location) {
                    itmChecked = selectedLocationsJSON[innerindx].Location.toUpperCase() == node.id.toUpperCase();
                    if (itmChecked) {
                        node.checked = true;
                        break;
                    }
                    else
                        node.checked = false;
                }
            }

            node.nodeChecked = dynamicObjectEvents.disableChildNodeCheckbox(nodeObject, node);
            nodeObject.appendChild(node);
            newnodelist.push(node);

            if (itmChecked)
                nodeObject.expand();
        }

        for (var indx in newnodelist) {
            this.getLocations(newnodelist[indx], actualDCode, newnodelist[indx].id, rootNode, userIdAs);
        }
    },
    getLocations: function (nodeparam, dCode, cCode, rootNode, userIdAs) {
        var nodeObject = rootNode.findChild('id', nodeparam.id, true);
        var jsonData = {
            UserIDAsl: userIdAs,
            districtCode: dCode,
            countryCode: cCode
        };

        var node, data;
        AjaxFunc.ServiceHit('api/Admin/App/GetUserAccessLocations', 'POST', false, jsonData,
            function onSuccess(resp) {
                if (!resp || !(resp.data || resp.data.length > 0))
                    return;

                data = resp.data;
            }
        );

        var itmChecked = false;
        for (var indx in data) {
            node = {
                id: data[indx].LOCATION_CODE,
                text: data[indx].LOCATION_NAME,
                checked: false,
                disabled: data[indx].alwaysDisabled,
                leaf: true
            }

            for (var innerindx = 0; innerindx < selectedLocationsJSON.length; innerindx++) {
                if (selectedLocationsJSON[innerindx].Location) {
                    itmChecked = selectedLocationsJSON[innerindx].Location.toUpperCase() == node.id.toUpperCase();
                    if (itmChecked) {
                        node.checked = true;
                        break;
                    }
                    else
                        node.checked = false;
                }
            }

            node.nodeChecked = dynamicObjectEvents.disableChildNodeCheckbox(nodeObject, node);
            nodeObject.appendChild(node);

            if (itmChecked)
                nodeObject.expand();
        }
    },
    getTradeLaneAccessTree: function (obj, userIdAs) {
        var rootnode = obj.store.getRootNode();
        var jsonData = {
            UserIDAsl: userIdAs
        };

        var node, data;
        AjaxFunc.ServiceHit('api/Admin/App/GetUserTradeLaneAccess', 'POST', false, jsonData,
            function onSuccess(resp) {
                if (!resp || !(resp.data || resp.data.length > 0))
                    return;

                data = resp.data;
            }
        );

        var itmChecked = false;
        for (var indx in data) {
            for (var innerindx = 0; innerindx < selectedTradeLaneAccessJSON.length; innerindx++) {
                if (selectedTradeLaneAccessJSON[innerindx].TRADE_LANE_ID) {
                    itmChecked = selectedTradeLaneAccessJSON[innerindx].TRADE_LANE_ID.toLowerCase() == data[indx].OCEAN_TRADE_LANE_CODE.toLowerCase();
                    if (itmChecked)
                        break;
                }
            }

            node = {
                id: data[indx].OCEAN_TRADE_LANE_CODE,
                text: data[indx].OCEAN_TRADE_LANE_NAME,
                checked: itmChecked,
                disabled: data[indx].alwaysDisabled,
                leaf: true
            }
            node.nodeChecked += dynamicObjectEvents.disableChildNodeCheckbox(rootnode, node);
            rootnode.appendChild(node);

            if (itmChecked)
                rootnode.expand();
        }
    },
    getSelectedLocations: function (value) {
        var data = null;
        var jsonData = {
            Sysm: value
        };
        AjaxFunc.ServiceHit('api/Admin/App/GetSelectedLocations', 'POST', false, jsonData,
            function onSuccess(resp) {
                if (!resp || !resp.responseText)
                    return;

                data = JSON.parse(resp.responseText);
            }
        );

        if (data.length < 1)
            return;

        selectedLocationsJSON = data.data;
    },
    getSelectedTradeLaneAccess: function (value) {
        var data = null;
        var jsonData = {
            Sysm: value
        };
        AjaxFunc.ServiceHit('api/Admin/App/GetSelectedTradeLaneAccess', 'POST', false, jsonData,
            function onSuccess(resp) {
                if (!resp || !resp.responseText)
                    return;

                data = JSON.parse(resp.responseText);
            }
        );

        if (data.length < 1)
            return;

        selectedTradeLaneAccessJSON = data.data;
    },
    getSelectedNodeValueCsv: function (treeObj) {
        var returncsv = null, innerreturncsv = null;
        var childNodes = treeObj.store.getRootNode().childNodes;
        for (var indx = 0; indx < childNodes.length; indx++) {
            if (childNodes[indx].get('checked')) {
                if (childNodes[indx].id)
                    returncsv = returncsv ? returncsv + '|' + childNodes[indx].id : childNodes[indx].id;
            }

            if (childNodes[indx].childNodes.length > 0) {
                innerreturncsv = this.getSelectedInnerNodeValueCsv(childNodes[indx]);
                if (innerreturncsv)
                    returncsv = returncsv + '|' + innerreturncsv;
            }
        }

        return returncsv;
    },
    getSelectedInnerNodeValueCsv: function (nodeObj) {
        var returncsv = null;
        var innerreturncsv = null;
        var childNodes = nodeObj.childNodes;
        for (var indx = 0; indx < childNodes.length; indx++) {
            if (childNodes[indx].get('checked')) {
                if (childNodes[indx].id)
                    returncsv = returncsv ? returncsv + '|' + childNodes[indx].id : childNodes[indx].id;
            }

            if (childNodes[indx].childNodes.length > 0) {
                innerreturncsv = this.getSelectedInnerNodeValueCsv(childNodes[indx]);
                if (innerreturncsv)
                    returncsv = returncsv + '|' + innerreturncsv;
            }
        }

        return returncsv;
    },
    disableChildNodeCheckbox: function (parentNode, nodeObj) {
        if (parentNode.checked)
            nodeObj.isDisabled = true;
    },
    refreshLocationTree: function () {
        var rootNode = objLocationTreeObject.store.getRootNode();
        var childNodes = rootNode.childNodes;
        var node = null;
        for (var indx in childNodes) {
            node = childNodes[indx];
            node.set('checked', false);
            if (node.childNodes && node.childNodes.length > 0)
                node.removeAll();
        }
    },
    refreshTradeLaneAccessTree: function () {
        objTradeLaneAccessTreeObject.getStore().load();
    }
};