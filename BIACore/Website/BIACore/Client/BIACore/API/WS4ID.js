BIACore.define('BIACore.API.WS4ID', {
}, function (me) {
    var SEARCH_MIN_LENGTH = 3;

    var userlistSearch = function userlistSearch(searchParams) {
        var userlist = null;
        var callbackFn = function callbackFn(request, success, response) {
            if (success) {
                if (response.userlist) userlist = response.userlist;
                else {
                    var json = eval(response.responseText);
                    if (json && BIACore.isObject(json) && json.userlist) userlist = json.userlist;
                }
            }
        };
            
        if (Ext && BIA && BIA.Ajax && BIA.Ajax.request && BIACore.isFunction(BIA.Ajax.request)) {
            BIA.Ajax.request({
                url: BIACore.URL.WS4IDUserList,
                method: 'POST',
                async: false,
                jsonData: searchParams,
                callback: callbackFn
            });
        }
        else {
            BIACore.ajax({
                url: BIACore.URL.WS4IDUserList,
                async: false,
                data: searchParams,
                type: 'POST',
                complete: callbackFn
            });
        }

        return userlist;
    }

    var analyzeSearchText = function analyzeSearchText(search) {
        var lnFnRegex = /[.+],[.+]/g;
        var fnLnRegex = /.+[^,] .+/g;
        var empidRegex = /^\d*$/g;
        var adidRegex = /[a-z]{3}\d[a-z]{3}/g;
        var lnRegex = /^[a-zA-Z]*$/g;

        if (lnFnRegex.test(search)) {
            return {
                fullname: search.replace(/, /g, ',')
            };
        }
        else if (fnLnRegex.test(search)) {
            var fn = search.split(0, search.regexIndexOf(',') - 1);
            var ln = search.slice(search.regexIndexOf(',') + 1, search.len - (search.regexIndexOf(',') + 1));

            return {
                fullname: ln + ',' + fn
            };
        }
        else if (empidRegex.test(search)) {
            return {
                empid: search
            };
        }
        else if (adidRegex.test(search)) {
            return {
                adid: search
            };
        }
        else if (lnRegex.test(search)) {
            return {
                lastname: search
            };
        }
        else {
            return {
                firstname: search,
                lastname: search,
                empid: search,
                adid: search
            }
        }
    }

    BIACore.apply(me, {
        /**
         * 
         * @param {string || object} search
         * @param {string} type ['adid','empid','firstname','lastname','fullname']
         * @param {bool} exact
         */
        search: function search(search, type, exact) {
            if (BIACore.isObject(search)) {
                if (search.search == null) {
                    //if (search.firstname != null && search.firstname.length >= SEARCH_MIN_LENGTH) return searchByFirstname(search.firstname, search.exact != null ? search.exact : exact);
                    if (search.lastname != null && search.lastname.length >= SEARCH_MIN_LENGTH) return me.searchByLastname(search.lastname, search.exact != null ? search.exact : exact);
                    if (search.fullname != null && search.fullname.length >= SEARCH_MIN_LENGTH) return me.searchByFullname(search.fullname, search.exact != null ? search.exact : exact);
                    if (search.adid != null && search.adid.length >= SEARCH_MIN_LENGTH) return me.searchByADID(search.adid, search.exact != null ? search.exact : exact); 
                    if (search.empid != null && search.empid.length >= SEARCH_MIN_LENGTH) return me.searchByEmpId(search.empid, search.exact != null ? search.exact : exact);
                }
                else if (search.search != null && search.search.length >= SEARCH_MIN_LENGTH) {
                    if (search.type != null) {
                        //if (search.type.toString().toLower() == 'firstname') return searchByFirstname(search.search, search.exact != null ? search.exact : exact);
                        if (search.type.toString().toLower() == 'lastname') return me.searchByLastname(search.search, search.exact != null ? search.exact : exact);
                        if (search.type.toString().toLower() == 'fullname') return me.searchByFullname(search.search, search.exact != null ? search.exact : exact);
                        if (search.type.toString().toLower() == 'adid') return me.searchByADID(search.search, search.exact != null ? search.exact : exact);
                        if (search.type.toString().toLower() == 'empid') return me.searchByEmpId(search.search, search.exact != null ? search.exact : exact);
                    }
                    else {
                        return userlistSearch(BIACore.apply(analyzeSearchText(search.search), { exact: search.exact != null ? search.exact : exact }));
                    }
                }
                else {
                    return { userlist: {} };
                }
            }
            else if (search >= SEARCH_MIN_LENGTH) {
                if (type != null) {
                    if (type.toString().toLower() == 'firstname') return me.searchByFirstname(search, exact);
                    if (type.toString().toLower() == 'lastname') return me.searchByLastname(search, exact);
                    if (type.toString().toLower() == 'fullname') return me.searchByFullname(search, exact);
                    if (type.toString().toLower() == 'adid') return me.searchByADID(search, exact);
                    if (type.toString().toLower() == 'empid') return me.searchByEmpId(search, exact);
                }
                else {
                    return userlistSearch(BIACore.apply(analyzeSearchText(search), { exact: exact }));
                }
            }
            else {
                return { userlist: {} };
            }
        },
        /*  Can not do search on firstname only per WS4ID restrictions
        searchByFirstname: function (search, exact) {
            if (search.length >= SEARCH_MIN_LENGTH) {
                return userlistSearch({
                    firstname: search,
                    exact: exact == null ? false : exact
                });
            }
            else return { userlist: {} };
        },
        */
        searchByLastname: function (search, exact) {
            if (search.length >= SEARCH_MIN_LENGTH) {
                return userlistSearch({
                    lastname: search,
                    exact: exact == null ? false : exact
                });
            }
            else return { userlist: {} };
        },
        searchByFullname: function (search, exact) {
            if (search.length >= SEARCH_MIN_LENGTH) {
            return userlistSearch({
                fullname: search,
                exact: exact == null ? false : exact
                });
            }
            else return { userlist: {} };
        },
        searchByADID: function (search, exact) {
            if (search.length >= SEARCH_MIN_LENGTH) {
            return userlistSearch({
                adid: search,
                exact: exact == null ? false : exact
                });
            }
            else return { userlist: {} };
        },
        searchByEmpId: function (search, exact) {
            if (search.length >= SEARCH_MIN_LENGTH) {
            return userlistSearch({
                empid: search,
                exact: exact == null ? false : exact
                });
            }
            else return { userlist: {} };
        },
        getExtJSWS4IDStore: function (storeId, data) {
            if (typeof (Ext) != 'undefined' && Ext) {
                return Ext.create('Ext.data.Store', {
                    storeId: storeId,
                    fields: this.getExtJSStoreFields(),
                    data: data
                });
            }
            return null;
        },
        getExtJSStoreFields: function () {
            return [
                adid,
                atlasphone,
                building,
                center,
                city,
                company,
                country,
                department,
                district,
                empcode,
                empid,
                emptype,
                firstname,
                jclass,
                jfunction,
                jgroup,
                language,
                lastname,
                mobile,
                name,
                office,
                optype,
                pager,
                racfid,
                region,
                sort,
                state,
                street,
                telephone,
                title,
                unioncode,
                upsemail,
                uuid,
                zip
            ];
        }
    });
});