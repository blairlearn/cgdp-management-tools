'use strict'

const DomainUtility = require('../domain-utility');

describe('DomainUtility', () => {
    describe('SFToStagingTarget', () => {

        test('Add a tier prefix.', () => {
            const expected = 'www.dev-example.acsitefactory.com';
            const tier = 'dev';

            const server = 'www.example.acsitefactory.com';
            let actual = DomainUtility.SFToStagingTarget(server, tier);

            expect(actual).toBe(expected);
        });
    });

    describe('SiteToTierSpecific', () => {
        describe('unadorned host names', () => {

            test.each([
                ['www.example.com',        'www-dev-acsf.example.com'],
                ['subsite.example.com',    'subsite-dev-acsf.example.com']
            ])('Convert %s to %s', (site, expected) => {
                const TIER = 'dev';

                let actual = DomainUtility.SiteToTierSpecific(site, TIER);
                expect(actual).toBe(expected);
            });
        });

        describe('decorated host names', () => {
            test.each([
                ['www-prod-acsf.example.com',      'www-test-acsf.example.com'],
                ['site2-prod-acsf.example.com',    'site2-test-acsf.example.com']
            ])('Convert %s to %s', (site, expected) => {
                const TIER = 'test';

                let actual = DomainUtility.SiteToTierSpecific(site, TIER);
                expect(actual).toBe(expected);
            });
        });

        describe('CMS host names', () => {
            test.each([
                ['www-cms.example.com',        'www-cms-test.example.com'],
                ['www-cms-prod.example.com',   'www-cms-test.example.com'],
                ['www-cms-dev.example.com',    'www-cms-test.example.com']
            ])('Convert %s to %s', (site, expected) => {
                const TIER = 'test';

                let actual = DomainUtility.SiteToTierSpecific(site, TIER);
                expect(actual).toBe(expected);
            });
        });

        describe('Bad name format', () => {
            test.each([
                ['www-.example.com'],
                ['www-cms-test-prod.example.com']
            ])('Error on bad host name format %s', (site) => {
                expect(() => DomainUtility.SiteToTierSpecific(site)).toThrow();
            });
        });
    });

    describe('GenerateDestinationDomains', () => {

        test('Sets the node ID', () => {
            const expected = [{
                siteID: 123,
                primary: null,
                secondary: []
            }]

            const target = 'test';

            const input = [{
                "node_id": 123,
                "node_type": "site",
                "time": "2021-01-26T19:43:36+00:00",
                "domains": {
                    "protected_domains": [],
                    "custom_domains": []
                }
            }];

            let actual = DomainUtility.GenerateDestinationDomains(input, target);
            expect(actual).toEqual(expected);
        });

        const primary_domain_data = [
            [
                'single domain',
                [{
                    "node_id": 123,
                    "node_type": "site",
                    "time": "2021-01-26T19:43:36+00:00",
                    "domains": {
                        "protected_domains": [
                            "site1.example.acsitefactory.com"
                        ],
                        "custom_domains": [
                            "site1.example.com"
                        ]
                    }
                }],
                [{
                    siteID: 123,
                    primary: 'site1-test-acsf.example.com',
                    secondary: []
                }]
            ],
            [
                'equivalent ui domains',
                [{
                    "node_id": 123,
                    "node_type": "site",
                    "time": "2021-01-26T19:43:36+00:00",
                    "domains": {
                        "protected_domains": [
                            "site1.example.acsitefactory.com"
                        ],
                        "custom_domains": [
                            "site1.example.com",
                            "site1-prod-acsf.example.com"
                        ]
                    }
                }],
                [{
                    siteID: 123,
                    primary: 'site1-test-acsf.example.com',
                    secondary: []
                }]
            ],
            [
                'ui and cms sites',
                [{
                    "node_id": 123,
                    "node_type": "site",
                    "time": "2021-01-26T19:43:36+00:00",
                    "domains": {
                        "protected_domains": [
                            "site1.example.acsitefactory.com"
                        ],
                        "custom_domains": [
                            "site1.example.com",
                            "site1-cms.example.com"
                        ]
                    }
                }],
                [{
                    siteID: 123,
                    primary: 'site1-test-acsf.example.com',
                    secondary: [
                        "site1-cms-test.example.com"
                    ]
                }]
            ],
            [
                'cms site presented before ui',
                [{
                    "node_id": 123,
                    "node_type": "site",
                    "time": "2021-01-26T19:43:36+00:00",
                    "domains": {
                        "protected_domains": [
                            "site1.example.acsitefactory.com"
                        ],
                        "custom_domains": [
                            "site1-cms.example.com",
                            "site1.example.com"
                        ]
                    }
                }],
                [{
                    siteID: 123,
                    primary: 'site1-test-acsf.example.com',
                    secondary: [
                        "site1-cms-test.example.com"
                    ]
                }]
            ],
        ];

        test.each(primary_domain_data)
        ('Sets the primary domain for %s', (description, input, expected) => {

            const target = 'test';

            let actual = DomainUtility.GenerateDestinationDomains(input, target);
            expect(actual).toEqual(expected);
        });
    });
});