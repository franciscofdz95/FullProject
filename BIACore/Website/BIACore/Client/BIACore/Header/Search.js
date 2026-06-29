//BIACore.define('BIACore.Header.Search', {

//    template: [
//        '<div id="BH_Dialog_Search">',
//         '<div id="BH_SearchLocalglobal">',
//          '<input id="BH_Search_Local" name="Search" type="radio" title="Local Search: This option is only available if the current application supports a local search.">Local&nbsp;</input>',
//          '<input id="BH_Search_Global" name="Search" type="radio" style="padding:0px 0px 0px 6px" checked>Global</input>',
//         '</div>',
//         '<label for="BH_Search_Text">Search: </label>',
//         '<input id="BH_Search_Text" type="text" autofocus />',
//        '</div>'
//    ],

//    add: function () {
//        var me = this,
//            config = BIACore.Header.config;
//        var button = BIACore.$('#BH_Button_Search').toggle(config.showSearch);
//        if (!config.showSearch) { return; }

//        var dialog = BIACore.$(me.template.join('')).dialog({
//            appendTo: config.target,
//            title: 'Search',
//            dialogClass: 'biacore2',
//            modal: true,
//            resizable: false,
//            autoOpen: false
//        });

//        button.click(function () {
//            dialog.dialog('open');
//        });

//        // and finish setting up parts of the dialog
//        BIACore.$('#BH_Search_Local').attr('disabled', 'disabled');
//        BIACore.$('#BH_Search_Text').keyup(function (e) {
//            var code = e.keyCode ? e.keyCode : e.which;
//            if (code === 13) {
//                var param = BIACore.$('#BH_Search_Text').val();
//                if (BIACore.String.isNullOrEmpty(param)) { return; }

//                if (BIACore.$('#BH_Search_Local:checked').val() === 'on') {
//                    config.localSearchFunction(param);
//                } else {
//                    config.searchFunction(param);
//                }
//                dialog.dialog('close');
//            }
//        });
//    }
//});