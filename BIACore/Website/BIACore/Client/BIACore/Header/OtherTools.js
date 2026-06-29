BIACore.define('BIACore.Header.OtherTools', {
    template: [
        '<option value="{returnpath}">{application_code}</option>'
    ],

    add: function () {
        var config = BIACore.Header.config,
            template = this.template.join('');

        // visibility
        BIACore.$('#BH_OtherTools').toggle(config.showOtherTools);

        if (!config.showOtherTools) { return; }

        BIACore.ajax({
            type: 'POST',
            url: BIACore.URL.OtherTools,
            dataType: 'json',
            data: {
                //method: 'getUserAppList',
                UserId: BIACore.Security.User.userId
            },
            success: function (response) {
                BIACore.$.each(response.userList, function (i, item) {
                    if (BIACore.Config.appCode !== item.application_code) {
                        var uri = (item.returnpath || '').toLowerCase();
                        if (uri.indexOf('http') < 0) {
                            BIACore.apply(item, {
                                returnpath: BIACore.Config.server + ((uri.indexOf('/') !== 1) ? '/bia/apps/' : '') + uri
                            });
                        }

                        BIACore.$('#BH_OtherTools').append(BIACore.String.format(template, item));
                    }
                });
            },
            error: function () {
                BIACore.Console('Unable to reach Other Tools webservice');
            } // do nothing on error. (just won't be anything in the 'Other Tools' menu)
        });
        BIACore.$('#BH_OtherTools').change(function () {
            var item = BIACore.$('#BH_OtherTools').val();
            if (item !== '') {
                BIACore.Window.Open(item);
            }
        });
    }
    
});
