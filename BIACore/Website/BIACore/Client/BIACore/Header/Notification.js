BIACore.define('BIACore.Header.Notification', {
    filters: [
        '<table width="100%">',
            '<tbody>',
                '<tr>',
                 '<td width="25%" align="left">',
                     ' <label>Notification Status:</label>',
                 '</td>',
                '<td width="25%" align="left">',
                    '<select id="notification_filter" data-bind="selectedText: dropdownValue" style="background-color: #9CE6FC;width: 90px;" onchange={[BIACore.Header.Notification.changeNotificationfilter(this)]}>',
                    '</select>',
                '</td>',
                 '<td width="25%" align="left">',
                    ' <label>Application:</label>',
                 '</td>',
                    '<td width="25%" align="left">',
                        '<select id="application_filter" data-bind="selectedText: dropdownValue" style="background-color: #9CE6FC;width: 200px;" onchange={[BIACore.Header.Notification.changeApplicationfilter(this)]}>',

                       '</select>',
                    '</td>',
                '</tr>',
            '</tbody>',
        '</table>',
        '<table width="100%">',
                '<tbody>', '<tr>', '<th align="left" width="20%">Application</th>',
                '<th align="left" width="30%">Short Desc.</th>'
                , '<th align="left" width="40%">Long Desc.</th>',
                '<th align="left" width="10%">Dismiss</th>',
                '</tr> </tbody></table>',
    ],
    optiontemplate: [
         '<option value="{Application_Code}">{Application_Code}</option>'
    ],
    template: [

            '<table width="100%" id="template">',
                '<tbody>',

                        '<tr>',
                             '<td width="20%" align="left">{Application_Code}</td>',
                            '<td  width="30%" align="left">{ShortDesc}</td>',
                            '<td  width="40%" align="left"><a href="#" style="text-decoration:underline;color:blue;" onClick="{[BIACore.Header.Notification.getLongDesc(\'{LongDesc}\')]}">{DisplayLongDesc}</a></td>',
                           '<td  width="10%" align="left"><input type="checkbox" onchange={[BIACore.Header.Notification.toggleCheck(this,{NotificationId})]} /></td>',
                        '</tr>',
                '</tbody>',
            '</table>'
    ],
    readTemplate: [

           '<table width="100%" id="template">',
               '<tbody>',

                       '<tr>',
                            '<td width="20%" align="left">{Application_Code}</td>',
                           '<td  width="30%" align="left">{ShortDesc}</td>',
                           '<td  width="40%" align="left"><a href="#" style="text-decoration:underline;color:blue;" onClick="{[BIACore.Header.Notification.getLongDesc(\'{LongDesc}\')]}">{DisplayLongDesc}</a></td>',
                          '<td  width="10%" align="left"></td>',
                       '</tr>',
               '</tbody>',
           '</table>'
    ],
    add: function () {
        var me = this,
            config = BIACore.Header.config;
        var button = BIACore.$('#BH_Button_Notify').toggle(config.showNotification);
        if (!config.showNotification) return;

        var dialog = '';

        button.click(function () {

            BIACore.ajax({

                url: BIACore.URL.Notification,
                data: {
                    userId: BIACore.Security.User.userId,
                    communicated: 'N',
                    application: 'ALL'
                },
                success: function (response, options) {
                    //if (response == null || response.length == 0) return;

                    BIACore.$(config.target).append('<div id="dvModal"></div>');
                    BIACore.$('#dvModal').append(me.filters.join(''));
                    BIACore.$('#dvModal').append('<div id="dvTemplates"></div>');
                    BIACore.$.each(response, function (i, item) {
                        BIACore.$('#dvTemplates').append(BIACore.String.format(me.template.join(''), item));
                    });


                    BIACore.ajax({
                        url: BIACore.URL.GetUserApps,
                        data: {
                            userId: BIACore.Security.User.userId
                        },
                        success: function (response, options) {
                            if (response == null || response.length == 0) return;

                            BIACore.$('#notification_filter').append('<option value="Y">Read</option>');
                            BIACore.$('#notification_filter').append('<option value="N" selected="true">UnRead</option>');

                            BIACore.$('#application_filter').append('<option value="ALL">All</option>');
                            BIACore.$.each(response, function (i, item) {
                                BIACore.$('#application_filter').append(BIACore.String.format(me.optiontemplate.join(''), item));
                            });
                        },
                        error: function () {
                            BIACore.Console('Unable to reach Other Tools webservice');
                        } // do nothing on error. (just won't be anything in the 'Other Tools' menu)
                    });

                    dialog = BIACore.$('#dvModal').dialog({
                        title: 'Notification',
                        appendTo: config.target,
                        resizable: false,
                        autoOpen: false,
                        height: 400,
                        width: 700,
                        modal: true,
                        close: function () { BIACore.$(this).dialog('destroy').remove(); }
                    });


                    dialog.dialog('open');
                },
                error: function () {
                    BIACore.Console('Unable to reach Notification webservice');
                } // do nothing on error. (just won't be anything in the 'Other Tools' menu)
            });

        });
    },
    toggleCheck: function (element, notificationId) {

        var me = this,
            config = BIACore.Header.config;

        BIACore.$('#BH_Button_Notify').toggle(config.showNotification);
        if (!config.showNotification) { return; }

        if (element.checked) {
            BIACore.ajax({
                url: BIACore.URL.UpdateNotification,
                data: {
                    userId: BIACore.Security.User.userId,
                    notificationId: notificationId
                },
                success: function (response, options) {
                    BIACore.Header.Notification.getFilteredValues();

                    BIACore.Header.update();

                },
                error: function () {
                    BIACore.Console('Unable to reach UpdateNotification webservice');
                } // do nothing on error. (just won't be anything in the 'Other Tools' menu)
            });
        }
    },
    getLongDesc: function (longDesc) {
        var config = BIACore.Header.config;

        BIACore.$('<div id="dvLongDesc" style="width:100%;word-break: break-all; word-wrap: break-word;"></div>').appendTo(BIACore.$('#dvModal'));
        BIACore.$('#dvLongDesc').append(longDesc);
        var dialogDesc = BIACore.$('#dvLongDesc').dialog({
            title: 'Long Description',
            appendTo: config.target,
            resizable: false,
            autoOpen: false,
            height: 200,
            width: 300,
            modal: true,
            close: function () { BIACore.$(this).dialog('destroy').remove(); }
        });
        dialogDesc.dialog('open');
    },
    changeNotificationfilter: function () {
        BIACore.Header.Notification.getFilteredValues();
    },
    changeApplicationfilter: function () {
        BIACore.Header.Notification.getFilteredValues();
    },
    getFilteredValues: function () {
        var me = this;
        BIACore.$('#dvTemplates').html('');
        BIACore.ajax({
            url: BIACore.URL.Notification,
            data: {
                userId: BIACore.Security.User.userId,
                communicated: BIACore.$('#notification_filter').val(),
                application: BIACore.$('#application_filter').val()
            },
            success: function (response, options) {
                if (response == null || response.length == 0) return;
                if (BIACore.$('#notification_filter').val() == 'Y') {
                    BIACore.$.each(response, function (i, item) {
                        BIACore.$('#dvTemplates').append(BIACore.String.format(me.readTemplate.join(''), item));
                    })
                }
                else {
                    BIACore.$.each(response, function (i, item) {
                        BIACore.$('#dvTemplates').append(BIACore.String.format(me.template.join(''), item));
                    })
                }
                //readTemplate
            },
            error: function () {
                BIACore.Console('Unable to reach Other Tools webservice');
            } // do nothing on error. (just won't be anything in the 'Other Tools' menu)
        });
    }
});