Ext.define('BIA.AjaxLoopPrevention', {
    singleton: true
}, function () {
    /*
        [
            {
                url: '',
                params: {},
                jsonData: {},
                requestTimes: [
                    DateTime()   
                ],
                loopPreventionLogged: false
            }
        ]
    */
    var REQUEST_LIMIT_PER_TIMEFRAME = 20;
    var REQUEST_LIMIT_TIMEFRAME = Ext.Date.SECOND;
    var REQUEST_LIMIT_TIME_VALUE = 30;

    var requests = new Array();

    var RemoveCacheBuster = function RemoveCacheBuster(url) {
        return url.replace(/_dc=[0-9]*/gi, '_dc=1');
    };

    var GetMatchingRequest = function GetMatchingRequest(request) {
        return Ext.Array.findBy(requests, function (item) {
            return RemoveCacheBuster(item.url) === RemoveCacheBuster(request.url)
                && Ext.Object.compare(item.params || {}, request.params || {})
                && Ext.Object.compare(item.jsonData || {}, request.jsonData || {}
                && request.BIASQLInjectionTest == null);
        });
    };

    var AddNewRequest = function AddNewRequest(request) {
        var matchingRequest = GetMatchingRequest(request);
        if (matchingRequest) { matchingRequest.requestTimes.push(new Date()); }
        else {
            matchingRequest = { url: RemoveCacheBuster(request.url), requestTimes: [new Date()], params: request.params, jsonData: request.jsonData };
            requests.push(matchingRequest);
        }
        return matchingRequest;
    };

    var ClearOldRequests = function ClearOldRequests() {
        var now = new Date();
        for (i = 0; i < requests.length; i++) {
            if (requests[i].requestTimes.length > 0) {
                for (t = requests[i].requestTimes.length - 1; t >= 0; t--) {
                    if (requests[i].requestTimes[t] < Ext.Date.subtract(now, REQUEST_LIMIT_TIMEFRAME, REQUEST_LIMIT_TIME_VALUE)) requests[i].requestTimes.splice(t, 1);
                }
            }
        }
    };

    var CheckForLoopRequest = function CheckForLoopRequest(connection, request, eOpts) {
        AddNewRequest(request);
        ClearOldRequests();
         
        var matchingRequest = GetMatchingRequest(request);
        if (matchingRequest && matchingRequest.requestTimes.length >= REQUEST_LIMIT_PER_TIMEFRAME) {
            if (!matchingRequest.loopPreventionLogged) {
                BIACore.Logger.Exception('BIA.AjaxLoopPrevention',
                    'Route: ' + RemoveCacheBuster(request.url) + '<br>params:' + Ext.JSON.encode(request.params) + '<br>jsonData:' + Ext.JSON.encode(request.jsonData)
                );
                matchingRequest.loopPreventionLogged = true;
            }
            request.LoopPrevention = true;
            return false;
        }
        else if (matchingRequest) { matchingRequest.loopPreventionLogged = false; }
    };

    var CatchException = function CatchException(connection, response, options, eOpts) {
        //this is crazy dangerous because it could interrupt any ajax/store exception
        //should be carefully evaluated to see if it's catching an undefined response and somehow return a made-up response?
        delete options.failure;
        delete options.callback;
        if (response == undefined) {

        }
        //return response = {blah}
        //or simply return a ficticious response message.
    };

   Ext.apply(this, {
        dump: function dump() {
            //return the status of all URLs with active request times
            var dumpArray = new Array();
            for (i = requests.length - 1; i >= 0; i--) {
                if (requests[i].requestTimes.length > 0) {
                    var timeBetween = 0;
                    if (requests[i].requestTimes.length >= 2) {
                        for (t = 2; t < requests[i].requestTimes.length; t++) timeBetween += Ext.Date.diff(requests[i].requestTimes[t - 1], requests[i].requestTimes[t], Ext.Date.MILLI);
                    }
                    else timeBetween = Ext.Date.diff(requests[i].requestTimes[0], (new Date()), Ext.Date.MILLI);

                    var avg = timeBetween / requests[i].requestTimes.length;

                    dumpArray.push({
                        url: requests[i].url,
                        params: requests[i].params,
                        jsonData: requests[i].jsonData,
                        requestCount: requests[i].requestTimes.length,
                        firstCapturedRequest: requests[i].requestTimes[requests[i].requestTimes.length - 1],
                        lastCapturedRequest: requests[i].requestTimes[0],
                        avgTimeBetweenCalls: avg + 'ms'
                    });
                }
            }

            return dumpArray;
        }
    });

    var AddAjaxListener = function AddAjaxListener(attempts) {
        if (Ext && Ext.Ajax && Ext.Ajax.addListener && Ext.isFunction(Ext.Ajax.addListener)) {
            Ext.Ajax.addListener({
                beforerequest: {
                    fn: CheckForLoopRequest,
                    scope: this
                }
            });
        }
        else if (attempts < 20) {
            Ext.defer(AddAjaxListener, 5, this, attempts++);
        }
    };

    AddAjaxListener(0);
});