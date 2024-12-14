const handler = require('./rewriter');

const buildRequest = (path: string) => {
    return {
        request: {
            uri: path,
            _test: true
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

    it('Should intercept IO resources that must be redirected', () => {
        expect(handler(buildRequest("/io-guida-tecnica"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica"));
        expect(handler(buildRequest("/io-guida-tecnica/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/changelog"));
        expect(handler(buildRequest("/io-guida-tecnica/v5.0"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/v5.0"));
        expect(handler(buildRequest("/io-guida-tecnica/v5.0/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/v5.0/changelog"));
        expect(handler(buildRequest("/io-guida-tecnica/guida-tecnica-1.2"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/v1.2"));

        expect(handler(buildRequest("/manuale-servizi"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi"));
        expect(handler(buildRequest("/manuale-servizi/storico-delle-modifiche"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/storico-delle-modifiche"));
        expect(handler(buildRequest("/manuale-servizi/v2.4"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v2.4"));
        expect(handler(buildRequest("/manuale-servizi/v2.4/storico-delle-modifiche"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v2.4/storico-delle-modifiche"));
        expect(handler(buildRequest("/manuale-servizi/v1.1-2"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.1"));
        expect(handler(buildRequest("/manuale-servizi/v1.1-2/storico-delle-modifiche"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.1/storico-delle-modifiche"));

        expect(handler(buildRequest("/manuale-servizi/manuale-servizi-v1.0"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.0"));
        expect(handler(buildRequest("/manuale-servizi/manuale-servizi-v1.0/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.0/changelog"));
 
        expect(handler(buildRequest("/carta-giovani-nazionale"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale"));
        expect(handler(buildRequest("/carta-giovani-nazionale/premessa"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/premessa"));
        expect(handler(buildRequest("/carta-giovani-nazionale/v2.0.0"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/v2.0.0")); 
        expect(handler(buildRequest("/carta-giovani-nazionale/v2.0.0/premessa"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/v2.0.0/premessa")); 

        expect(handler(buildRequest("/manuale-operativo-di-firma-con-io"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-operativo")); 
        expect(handler(buildRequest("/manuale-operativo-di-firma-con-io/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-operativo/changelog")); 
    });

    it('Should intercept SACI resources that must be redirected', () => {
        expect(handler(buildRequest("/saci"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci"));
        expect(handler(buildRequest("/saci/"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/"));
        expect(handler(buildRequest("/saci/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"));
        expect(handler(buildRequest("/saci/saci-3.2.0"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0"));
        expect(handler(buildRequest("/saci/saci-3.2.0/"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0/"));
        expect(handler(buildRequest("/saci/saci-3.2.0/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"));
    });

    it('Should not intercept these resources', () => {
        expect(handler(buildRequest("/not-mapped/")).uri).toBe( "/not-mapped/" )
        expect(handler(buildRequest("/not-mapped/subpath/1.2.3")).uri).toBe( "/not-mapped/subpath/1.2.3" )
    })

})
