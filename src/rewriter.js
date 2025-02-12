/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
var devPortalBaseURL = "https://developer.pagopa.it";

var simpleHelper = function(base) {
    var stringRegex = base.replaceAll("/", "\\/").replaceAll(".", "\\.") + "(.*)";
    var regex = new RegExp(stringRegex);
    regex._helper = "simpleHelper";
    return regex;
}

var versionedHelper = function(base, versionPrefix) {
    var stringRegex = "\\/" + base + "(?:\\/";
    if (versionPrefix) {
        stringRegex += versionPrefix;
    }
    stringRegex += "(v?\\d+(?:\\.\\d+(?:\\.\\d+)?)?))?(.*)";
    var regex = new RegExp(stringRegex);
    regex._helper = "versionedHelper";
    return regex;
};

var regexPatterns = [
    {
        active: false, regex: simpleHelper("io-guida-tecnica/guida-tecnica-1.2"), redirectTo: "/app-io/guides/io-guida-tecnica/v1.2"
    },
    {
        active: false, regex: versionedHelper("io-guida-tecnica"), redirectTo: "/app-io/guides/io-guida-tecnica"
    },
    {
        active: false, regex: simpleHelper("manuale-servizi/manuale-servizi-v1.0"), redirectTo: "/app-io/guides/manuale-servizi/v1.0"
    },
    {
        active: false, regex: simpleHelper("manuale-servizi/v1.1-2"), redirectTo: "/app-io/guides/manuale-servizi/v1.1"
    },
    {
        active: false, regex: versionedHelper("manuale-servizi"), redirectTo: "/app-io/guides/manuale-servizi"
    },
    {
        active: false, regex: versionedHelper("carta-giovani-nazionale"), redirectTo: "/app-io/guides/carta-giovani-nazionale"
    },
    {
        active: false, regex: versionedHelper("manuale-operativo-di-firma-con-io"), redirectTo: "/app-io/guides/manuale-operativo"
    },
    {
        active: false, regex: versionedHelper("saci", "saci-"), redirectTo: "/pago-pa/guides/saci"
    },
    {
        active: true, regex: simpleHelper("sanp/sanp-2.5.1"), redirectTo: "/pago-pa/guides/sanp/2.5.1"
    },
    {
        active: false, regex: versionedHelper("sanp", "sanp-"), redirectTo: "/pago-pa/guides/sanp"
    },
    {
        active: false, regex: simpleHelper("manuale-back-office-pagopa/manuale-bo-pagopa-psp/readme"), redirectTo: "/pago-pa/guides/manuale-bo-psp/manuale-operativo-pagamenti-pagopa-prestatore-di-servizi-di-pagamento"
    },
    {
        active: false, regex: simpleHelper("manuale-back-office-pagopa/manuale-bo-pagopa-psp"), redirectTo: "/pago-pa/guides/manuale-bo-psp"
    },
    {
        active: false, regex: simpleHelper("manuale-back-office-pagopa/manuale-bo-pagopa-pt/readme"), redirectTo: "/pago-pa/guides/manuale-bo-pt/manuale-operativo-back-office-pagopa-partner-tecnologico"
    },
    {
        active: false, regex: simpleHelper("manuale-back-office-pagopa/manuale-bo-pagopa-pt"), redirectTo: "/pago-pa/guides/manuale-bo-pt"
    },
    {
        active: false, regex: simpleHelper("manuale-back-office-pagopa/readme"), redirectTo: "/pago-pa/guides/manuale-bo-ec/manuale-operativo-back-office-pagopa-ente-creditore"
    },
    {
        active: false, regex: simpleHelper("manuale-back-office-pagopa"), redirectTo: "/pago-pa/guides/manuale-bo-ec"
    },
    {
        active: false, regex: versionedHelper("avviso-pagamento", "avvisi-"), redirectTo: "/pago-pa/guides/avviso-pagamento"
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
        if (event.request._test || regexPatterns[i].active) {
            var pattern = regexPatterns[i];
            var match = pattern.regex.exec(uri);

            if (match) {
                var version = null, path = null;

                if (pattern.regex._helper == "versionedHelper") {
                    version = match[1];
                    path = match[2];
                }

                if (pattern.regex._helper == "simpleHelper") {
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
    }

    return event.request;
}