/**
 * This is a utility class for having multiple filters that are switchable based on some sort of toggle mechanism.
 * Items that are not visible are not included on the GetParameters data set.
 * @inheritdoc
 */
Ext.define('BIA.container.FilterContainerCard', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.filterCard',

    layout: { type: 'card' },

    defaults: { padding: '0 0 0 0' },

    /**
     * @cfg {Boolean} [Switchable=false]
     * Whether or not this card can be swapped
     */
    Switchable: false,

    /**
     * An override of {@link BIA.container.FilterContainer#GetParameters}
     * Only returns the Active Item's Parameters
     */
    GetParameters: function () {
        var me = this,
            selected = me.getLayout().getActiveItem();

        return selected.GetParameters();
    },

    /**
     * An override of {@link BIA.container.FilterContainer#SetLayout}
     * Sets the current card based on the layout provided
     */
    SetLayout: function (layout) {
        var me = this,
            card = layout[me.itemId];

        if (null !== card && typeof (card) !== 'boolean') {
            // TODO: if a card is explicitly set, don't set up other cards.
            me.getLayout().setActiveItem(card);
        }

        me.callOverridden(arguments);
    },

    /**
     * An override of {@link BIA.container.FilterContainer#SetParameters}
     * Sets the current card's components based on the parameter set; prevents possible name collisions
     */
    SetParameters: function (params, silent) {
        var me = this;
        if (me.Switchable) {
            me.preFilterPending();
            // filterContainerCard that only allows 1 card to be visible at a time.
            var active = me.getLayout().getActiveItem();
            me.SetComponentParameters(active, params, silent);
            me.postFilterPending();
        } else {
            me.callOverridden(arguments);
        }
    },

    /**
     * An override of {@link BIA.container.FilterContainer#GetFilterDisplay}
     * Returns the display value for only the currently active card.
     */
    GetFilterDisplay: function () {
        var me = this,
            result = '',
            active = me.getLayout().getActiveItem();

        if (active && active.GetFilterDisplay) {
            result += active.GetFilterDisplay();
        }
        return result;
    }
});