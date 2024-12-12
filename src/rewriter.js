/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
var devPortalBaseURL = "https://developer.pagopa.it";

var versionedRegexHelper = function(name) {
    var regex = new RegExp("\\/" + name + "(?:\\/" + name + "\\-(\\d+\\.\\d+\\.\\d+))?(.*)");
    regex._helper = "versionedRegexHelper";
    return regex;
};

var regexPatterns = [
    {
        regex: versionedRegexHelper("saci"), redirectTo: "/pago-pa/guides/saci"
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
            var version = null, path = null;

            if (pattern.regex._helper == "versionedRegexHelper") {
                version = match[1];
                path = match[2];
            }

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