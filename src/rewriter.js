const stripOutBaseUrl = (url) => {
    return url.replace("https://docs.pagopa.it/", "");
}

// buildVersionedRegex returns regex capable of matching paths like:
// /saci
// /saci/mypath  --> the capturing group 'path' --> "/mypath"
// /saci/saci-1.2.3 --> the capturing group 'version'--> '1.2.3'
// /saci/saci-1.2.3/mypath --> the capturing group 'version' -> '1.2.3' and 'path' --> 'mypath'
const buildVersionedRegex = (url) => {
    const name = stripOutBaseUrl(url);
    return new RegExp("\\/"+name+"(?:\\/"+name+"\\-(?<version>\\d+\\.\\d+\\.\\d+))?(?<path>.*)");
}

// buildUnvrsionedRegex returns regex capable of matching paths like:
// /saci
// /saci/mypath  --> the capturing group 'path' -> "/mypath"
const buildUnversionedRegex = (url) => {
    return new RegExp("\\/"+ stripOutBaseUrl(url) +"(?<path>.*)");
}

// Hardcoded regex patterns and their replacements
const regexPatterns = [
    {
        regex: buildVersionedRegex("https://docs.pagopa.it/saci"), replacement: "https://developer.pagopa.it/pago-pa/guides/saci"
    },
    {   regex: buildUnversionedRegex("https://docs.pagopa.it/unversioned"), replacement: "https://developer.pagopa.it/destination-unversioned"
    }
];

function handler(event) {
    const request = event.request;
    const uri = request.uri;
    var targetUri = null;

    for (var i = 0; i < regexPatterns.length; i++) {
        const pattern = regexPatterns[i];
        const match = pattern.regex.exec(uri);
        if (match) {
            targetUri = pattern.replacement;
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

    // Pass through the request if no match is found
    return request;
}
// ***************************************************
// Should not be copied to AWS Lambda below this point
// ***************************************************
module.exports = handler;