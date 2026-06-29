Ext.define('BIA.util.Accessors', {
    singleton: true,

    BaseClassSearch: function BaseClassSearch(me, baseClassName) {
        var recursiveSearch = function (me, className) {
            //console.log(me.$className)
            if (me.$className == className) {
                return true;
            }
            //console.log(Object.getPrototypeOf(me));
            if (!Ext.isObject(me) || !Object.getPrototypeOf(me)) {
                return false;
            }
            return recursiveSearch(Object.getPrototypeOf(me), className);
        }
        return recursiveSearch(me, baseClassName)
    },

    ClassPropertyBaseTypeSearch: function ClassPropertyBaseTypeSearch(me, baseTypeName, matchingObjectProperties) {
        matchingObjectProperties = matchingObjectProperties || [];
        if (Ext.isArray(me)) {
            for (var i = 0; i < me.length; i++) {
                BIA.util.Accessors.ClassPropertyBaseTypeSearch(me[i], baseTypeName, matchingObjectProperties);
            }
            /*Ext.Array.each(me, function (obj, index, all) {
                ClassPropertyBaseTypeSearch(obj, baseTypeName, matchingObjectProperties);
            });*/
        }
        else if (Ext.isObject(me)) {
            Ext.Object.each(me, function (prop, value, myself) {
                if (Ext.isObject(myself[prop]) && BIA.util.Accessors.BaseClassSearch(myself[prop], baseTypeName)) {
                    matchingObjectProperties.push({ object: myself, property: prop });
                }
            });
        }

        return matchingObjectProperties;
    },

    GetControllerReference: function GetControllerReference(controllerClass) {
        var controller = undefined;
        App.getApplication().controllers.items.forEach(function (item, index, array) {
            if (item.$className.toLowerCase() == ('App.Controller.' + controllerClass).toLowerCase() && !controller) {
                controller = item;
            }
        });

        return controller;
    }
});