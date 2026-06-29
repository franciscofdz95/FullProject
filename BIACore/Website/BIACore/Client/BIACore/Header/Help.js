BIACore.define('BIACore.Header.Help', {
    template: [
        '<li id="{id}" class="BH_Clickable"><a tabindex="-1" href="#">{title}</a></li>'
    ],
    panel: [
        '<div id="BH_dropdown-help" class="dropdown dropdown-tip">',
         '<ul id="BH_dropdown_help_menu" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>',
        '</div>'
    ],

    add: function () {
        var config = BIACore.Header.config;

        BIACore.$('#BH_Button_Help').toggle(config.showHelpMenu);
        if (!config.showHelpMenu) { return; }

        BIACore.$(config.target).append(this.panel.join(''));
    },

    _addHelpMenuItems: function () {
        var me = this,
            item = null,
            template = null,
            items = me.config.helpMenuItems,
            i = 0, ln = items.length,
            add = function (dest, template, item) {
                BIACore.$(dest).append(BIACore.String.format(template, item));
                if (item.clickFunction) {
                    BIACore.$('#' + item.id).click(item.clickFunction);
                }
            };

        for (; i < ln; ++i) {
            if (typeof (items[i]) === 'string') {
                template = '<li class="BH_dropdown-divider"></li>';
                item = {};
            } else {
                template = me.templates.HelpMenuItem;
                item = BIACore.apply(items[i] || {}, {
                    id: 'BH_Help_Menu' + i
                });
            }

            add('#BH_dropdown_help_menu', template, item);
        }
    }
});