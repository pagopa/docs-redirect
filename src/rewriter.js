/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
var devPortalBaseURL = "https://developer.pagopa.it";

var versionedRegexHelper = function(name, versionPrefix) {
    var stringRegex = "\\/" + name + "(?:\\/";
    if (versionPrefix) {
        stringRegex += versionPrefix;
    }
    stringRegex += "(v?\\d+(?:\\.\\d+(?:\\.\\d+)?)?))?(.*)";
    var regex = new RegExp(stringRegex);
    regex._helper = "versionedRegexHelper";
    return regex;
};

var matchHelper = function(prefix) {
    var stringRegex = prefix.replaceAll("/", "\\/").replaceAll(".", "\\.") + "(.*)";
    var regex = new RegExp(stringRegex);
    regex._helper = "matchHelper";
    return regex;
}

var regexPatterns = [
    {
        active: false, regex: matchHelper("io-guida-tecnica/guida-tecnica-1.2"), redirectTo: "/app-io/guides/io-guida-tecnica/v1.2"
    },
    {
        active: false, regex: versionedRegexHelper("io-guida-tecnica"), redirectTo: "/app-io/guides/io-guida-tecnica"
    },
    {
        active: false, regex: matchHelper("manuale-servizi/manuale-servizi-v1.0"), redirectTo: "/app-io/guides/manuale-servizi/v1.0"
    },
    {
        active: false, regex: matchHelper("manuale-servizi/v1.1-2"), redirectTo: "/app-io/guides/manuale-servizi/v1.1"
    },
    {
        active: false, regex: versionedRegexHelper("carta-giovani-nazionale"), redirectTo: "/app-io/guides/carta-giovani-nazionale"
    },
    {
        active: false, regex: versionedRegexHelper("manuale-operativo-di-firma-con-io"), redirectTo: "/app-io/guides/manuale-operativo"
    },
    {
        active: false, regex: versionedRegexHelper("manuale-servizi"), redirectTo: "/app-io/guides/manuale-servizi"
    },
    {
        active: false, regex: versionedRegexHelper("saci", "saci-"), redirectTo: "/pago-pa/guides/saci"
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

    for (var i = 0; i < regexPatterns.length && (event.request || regexPatterns[i].active); i++) {
        var pattern = regexPatterns[i];
        var match = pattern.regex.exec(uri);

        if (match) {
            
            var version = null, path = null;

            if (pattern.regex._helper == "versionedRegexHelper") {
                version = match[1];
                path = match[2];
            }

            if (pattern.regex._helper == "matchHelper") {
                path = match[1];
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