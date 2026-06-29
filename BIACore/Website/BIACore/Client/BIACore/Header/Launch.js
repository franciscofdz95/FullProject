BIACore.define('BIACore.Header.Launch', {
    panel: [
        '<div id="BH_dropdown-launch" class="dropdown dropdown-tip">',
         '<ul id="BH_dropdown_launch_menu" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>',
        '</div>'
    ],

    add: function () {
        var config = BIACore.Header.config;

        BIACore.$('#BH_Button_LaunchApp').toggle(config.showLauncher);
        if (!config.showLauncher) {
            return;
        }

        BIACore.$('body').append(this.panel.join(''));
    }
});