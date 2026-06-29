Ext.define('App.Controller.Application.List.Item.Stats', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        var me = this;

        me.control({
            'App-View-Application-List-Item-Stats': {
                added: this.StatsAdded
            }
        });
        me.listen({});
    },
    StatsAdded: function StatsAdded(me, parent, index, eOpts) {
        var applicationCmp = me.up('[application]');
        if (applicationCmp) {
            if (applicationCmp.application.HitsTotal >= 0) {
                me.down('#TotalHits').html = Utility.Formatting.TruncatedNumberDisplay(applicationCmp.application.HitsTotal) + ' Total Hits';
            }
            if (applicationCmp.application.HitsYTD >= 0) {
                me.down('#YTDHits').html = Utility.Formatting.TruncatedNumberDisplay(applicationCmp.application.HitsYTD) + ' Hits YTD';
            }
            if (applicationCmp.application.HitsLastMonth >= 0) {
                me.down('#MonthHits').html = Utility.Formatting.TruncatedNumberDisplay(applicationCmp.application.HitsLastMonth) + ' Hits this Month';
            }
            if (applicationCmp.application.HitsLastDay >= 0) {
                me.down('#DayHits').html = Utility.Formatting.TruncatedNumberDisplay(applicationCmp.application.HitsLastDay) + ' Hits Today';
            }
            /*if (applicationCmp.application.ErrorsLastWeek >= 0) {
                me.down('#WeekErrors').html = Utility.Formatting.TruncatedNumberDisplay(applicationCmp.application.ErrorsLastWeek) + ' Errors this Week'
            }*/
        }
    }
});