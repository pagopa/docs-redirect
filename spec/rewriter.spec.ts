const handler = require('./rewriter');

const buildRequest = (path: string, _test: boolean = true) => {
    return {
        request: {
            uri: path,
            _test: _test
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

describe('IO resources', () => {

    it('Should intercept io-guida-tecnica resources that must be redirected', () => {
        expect(handler(buildRequest("/io-guida-tecnica"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica"));
        expect(handler(buildRequest("/io-guida-tecnica/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/changelog"));
        expect(handler(buildRequest("/io-guida-tecnica/v5.0"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/v5.0"));
        expect(handler(buildRequest("/io-guida-tecnica/v5.0/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/v5.0/changelog"));
        expect(handler(buildRequest("/io-guida-tecnica/guida-tecnica-1.2"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/io-guida-tecnica/v1.2"));
    });

    it('Should intercept manuale-servizi resources that must be redirected', () => {
        expect(handler(buildRequest("/manuale-servizi"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi"));
        expect(handler(buildRequest("/manuale-servizi/storico-delle-modifiche"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/storico-delle-modifiche"));
        expect(handler(buildRequest("/manuale-servizi/v2.4"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v2.4"));
        expect(handler(buildRequest("/manuale-servizi/v2.4/storico-delle-modifiche"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v2.4/storico-delle-modifiche"));
        expect(handler(buildRequest("/manuale-servizi/v1.1-2"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.1"));
        expect(handler(buildRequest("/manuale-servizi/v1.1-2/storico-delle-modifiche"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.1/storico-delle-modifiche"));

        expect(handler(buildRequest("/manuale-servizi/manuale-servizi-v1.0"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.0"));
        expect(handler(buildRequest("/manuale-servizi/manuale-servizi-v1.0/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/manuale-servizi/v1.0/changelog"));
    });

    it('Should intercept carta-giovani-nazionale resources that must be redirected', () => {
        expect(handler(buildRequest("/carta-giovani-nazionale"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale"));
        expect(handler(buildRequest("/carta-giovani-nazionale/premessa"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/premessa"));
        expect(handler(buildRequest("/carta-giovani-nazionale/v2.0.0"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/v2.0.0"));
        expect(handler(buildRequest("/carta-giovani-nazionale/v2.0.0/premessa"))).toEqual(buildResponse( "https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/v2.0.0/premessa"));
    });

});

describe('pagoPA resources', () => {
    it('Should intercept SACI resources that must be redirected', () => {
        expect(handler(buildRequest("/saci"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci"));
        expect(handler(buildRequest("/saci/"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/"));
        expect(handler(buildRequest("/saci/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"));
        expect(handler(buildRequest("/saci/saci-3.2.0"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0"));
        expect(handler(buildRequest("/saci/saci-3.2.0/"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0/"));
        expect(handler(buildRequest("/saci/saci-3.2.0/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/saci/3.2.0/specifiche-attuative-dei-codici-identificativi-di-versamento-riversamento-e-rendicontazione/generazione-dellidentificativo-univoco-di-versamento"));
    });

    it('Should intercept SANP resources that must be redirected', () => {
        expect(handler(buildRequest("/sanp"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp"));
        expect(handler(buildRequest("/sanp/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog"));
        expect(handler(buildRequest("/sanp/sanp-3.8.0"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/3.8.0"));
        expect(handler(buildRequest("/sanp/sanp-3.8.0/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/3.8.0/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog"));
        expect(handler(buildRequest("/sanp/sanp-2.5.1"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/2.5.1"));
    });

    it('Should intercept Manuale operativo Back Office pagoPA resources that must be redirected', () => {
        expect(handler(buildRequest("/manuale-back-office-pagopa"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/manuale-bo-ec"));
        expect(handler(buildRequest("/manuale-back-office-pagopa/readme/prerequisiti-per-accesso-al-portale"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/manuale-bo-ec/manuale-operativo-back-office-pagopa-ente-creditore/prerequisiti-per-accesso-al-portale"));

        expect(handler(buildRequest("/manuale-back-office-pagopa/manuale-bo-pagopa-psp"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/manuale-bo-psp"));
        expect(handler(buildRequest("/manuale-back-office-pagopa/manuale-bo-pagopa-psp/readme/prerequisiti-per-accesso-al-portale"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/manuale-bo-psp/manuale-operativo-pagamenti-pagopa-prestatore-di-servizi-di-pagamento/prerequisiti-per-accesso-al-portale"));

        expect(handler(buildRequest("/manuale-back-office-pagopa/manuale-bo-pagopa-pt"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/manuale-bo-pt"));
        expect(handler(buildRequest("/manuale-back-office-pagopa/manuale-bo-pagopa-pt/readme/prerequisiti-per-accesso-al-portale"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/manuale-bo-pt/manuale-operativo-back-office-pagopa-partner-tecnologico/prerequisiti-per-accesso-al-portale"));
    });

    it('Should intercept avviso-pagamento resources that must be redirected', () => {
        expect(handler(buildRequest("/avviso-pagamento"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/avviso-pagamento"));
        expect(handler(buildRequest("/avviso-pagamento/per-iniziare/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/avviso-pagamento/per-iniziare/changelog"));
        expect(handler(buildRequest("/avviso-pagamento/avvisi-3.2.1"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/avviso-pagamento/3.2.1"));
        expect(handler(buildRequest("/avviso-pagamento/avvisi-3.2.1/per-iniziare/changelog"))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/avviso-pagamento/3.2.1/per-iniziare/changelog"));
    });

});

describe('Unexisting resources', () => {
    it('Should not intercept these resources', () => {
        expect(handler(buildRequest("/not-mapped/")).uri).toBe( "/not-mapped/" )
        expect(handler(buildRequest("/not-mapped/subpath/1.2.3")).uri).toBe( "/not-mapped/subpath/1.2.3" )
    })
});

describe('Active rules', () => {
    it('Should intercept these resources', () => {
        expect(handler(buildRequest("/sanp/sanp-2.5.1", false))).toEqual(buildResponse( "https://developer.pagopa.it/pago-pa/guides/sanp/2.5.1"));
    })

    it('Should intercept manuale-operativo-di-firma-con-io resources that must be redirected', () => {
        expect(handler(buildRequest("/manuale-operativo-di-firma-con-io", false))).toEqual(buildResponse( "https://developer.pagopa.it/firma-con-io/guides/manuale-operativo"));
        expect(handler(buildRequest("/manuale-operativo-di-firma-con-io/changelog", false))).toEqual(buildResponse( "https://developer.pagopa.it/firma-con-io/guides/manuale-operativo/changelog"));
    });

    it('Should intercept guida-alla-scelta-di-firma-con-io resources that must be redirected', () => {
        expect(handler(buildRequest("/guida-alla-scelta-di-firma-con-io", false))).toEqual(buildResponse( "https://developer.pagopa.it/firma-con-io/guides/guida-scelta-firma"));
        expect(handler(buildRequest("/guida-alla-scelta-di-firma-con-io/v1.0", false))).toEqual(buildResponse( "https://developer.pagopa.it/firma-con-io/guides/guida-scelta-firma/v1.0"));
    });

    it('Should not intercept these resources', () => {
        expect(handler(buildRequest("/sanp", false)).uri).toBe( "/sanp" );
        expect(handler(buildRequest("/sanp/sanp-3.8.0/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog", false)).uri).toBe( "/sanp/sanp-3.8.0/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog" );

        expect(handler(buildRequest("/", false)).uri).toBe( "/" );
    })

});

