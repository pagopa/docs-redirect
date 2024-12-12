/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
var devPortalBaseURL = "https://developer.pagopa.it";
var versionedRegexHelper = function(url) {
    var name = url.replace(/^\//, "");
    return new RegExp("\\/" + name + "(?:\\/" + name + "\\-(\\d+\\.\\d+\\.\\d+))?(.*)");
};

/*****************************************************
 * Rules here below                                  *
 *****************************************************/
var regexPatterns = [
    {
        regex: versionedRegexHelper("/saci"), redirectTo: "/pago-pa/guides/saci"
    }
];

function handler(event) {
    if (!event || !event.request || typeof event.request.uri !== 'string') {
        return {
            statusCode: 400,
            statusDescription: "Bad Request",
            body: "Invalid URI"
        };
    }

    var uri = event.request.uri;

    for (var i = 0; i < regexPatterns.length; i++) {
        var pattern = regexPatterns[i];
        var match = pattern.regex.exec(uri);
        if (match) {
            var version = match[1]; 
            var path = match[2];
            var targetUri = devPortalBaseURL + pattern.redirectTo;

            if (version) {
                targetUri += "/" + version;
            }

            if (path) {
                targetUri += path;
            }

            return {
                statusCode: 301,
                statusDescription: "Moved Permanently",
                headers: {
                    location: { value: targetUri }
                }
            };
        }
    }

    return event.request;
}