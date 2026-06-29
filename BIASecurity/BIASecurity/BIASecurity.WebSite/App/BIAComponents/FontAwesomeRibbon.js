Ext.define('BIA.Components.Ribbon', {
    extend: 'Ext.container.Container',
    alias: 'widget.BIA-Components-Ribbon',
    html: '' +
        '<span class="fa-stack fa-lg">' +
        '   <i class="fa fa-bookmark fa-stack-2x fa-lg" style="margin-top: 29px; color: gold; margin-left: 4px; font-size: 3em;"></i>' +
        '   <i class="fa fa-certificate fa-stack-1x fa-3x" style="color: orange;"></i>' +
        '</span>'
});
/*
Ribbon (Certificate with bookmark)
<span class="fa-stack fa-lg">
   <i class="fa fa-bookmark fa-stack-2x fa-lg" style="margin-top: 29px; color: gold; margin-left: 4px; font-size: 3em;"></i>
   <i class="fa fa-certificate fa-stack-1x fa-3x" style="color: orange;"></i>
</span>

User with solid star
<span class="fa-stack fa-2x" style="">   
    <i class="fa fa-user fa-inverted fa-stack-1x " style="color: gray;font-size: 1.25em;"></i>
    <i class="fa fa-star fa-inverted fa-stack-1x fa-lg" style="margin-top: 6px; color: gold;margin-left: 6px;font-size: 14px;"></i>
</span>
*/