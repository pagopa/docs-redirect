/*****************************************************
 * Before modifying the code here below, please      *
 * follow the instructions here:                     *
 * https://github.com/pagopa/docs-redirect/README.md *
 *****************************************************/
const devPortalBaseURL = "https://developer.pagopa.it";
const versionedRegexHelper = (url) => {
    const name = url.replace(/^\//, "");
    return new RegExp("\\/"+name+"(?:\\/"+name+"\\-(?<version>\\d+\\.\\d+\\.\\d+))?(?<path>.*)");
}

/*****************************************************
 * Rules here below                                  *
 *****************************************************/
const regexPatterns = [
    {
        regex: versionedRegexHelper("/saci"), redirectTo: "/pago-pa/guides/saci"
    }
];

function handler(event) {
    const uri = event.request.uri;
    var targetUri = null;

    for (var i = 0; i < regexPatterns.length; i++) {
        const pattern = regexPatterns[i];
        const match = pattern.regex.exec(uri);
        if (match) {
            targetUri = devPortalBaseURL + pattern.redirectTo;
            if (match.groups?.version != null) {
                targetUri += "/" + match.groups?.version;
            }
            if (match.groups?.path != null) {
                targetUri += match.groups?.path;
            }
            break;
        }
    }

    if (targetUri) {
        return {
            statusCode: 301,
            statusDescription: "Moved Permanently",
            headers: {
                location: { value: targetUri }
            }
        };
    }

    return event.request;
}