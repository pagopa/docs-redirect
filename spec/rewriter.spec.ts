const handler = require('../src/rewriter');

const buildRequest = (path: string) => {
    return {
        request: {
            uri: path
        } 
    }
}

const buildResponse = (path: string) => {
    return {
        statusCode: 301,
        statusDescription: "Moved Permanently",
        headers: {
            location: { value: path }
        }
    }
}

describe('Rewriter', () => {

    it('Should intercept versioned resources that must be redirected', () => {
        expect(handler(buildRequest("/saci"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci"));
        expect(handler(buildRequest("/saci/"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/"));
        expect(handler(buildRequest("/saci/saci-3.2.0"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0"));
        expect(handler(buildRequest("/saci/saci-3.2.0/"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0/"));
        expect(handler(buildRequest("/saci/saci-3.2.0/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"));
    });

    it('Should intercept unversioned resources that must be redirected', () => {
        expect(handler(buildRequest("/unversioned"))).toEqual(buildResponse( "https://developer.pagopa.it/destination-unversioned"));
        expect(handler(buildRequest("/unversioned/"))).toEqual(buildResponse( "https://developer.pagopa.it/destination-unversioned/"));
        expect(handler(buildRequest("/unversioned/subfolder"))).toEqual(buildResponse( "https://developer.pagopa.it/destination-unversioned/subfolder"));
    });

    it('Should not intercept these resources', () => {
        expect(handler(buildRequest("/not-mapped/"))).toEqual({ uri: "/not-mapped/"})
        expect(handler(buildRequest("/not-mapped/subpath/1.2.3"))).toEqual({ uri: "/not-mapped/subpath/1.2.3"})
    })

})
