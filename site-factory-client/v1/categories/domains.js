'use strict'

const SFCategoryBase        = require('../category-base');

/**
 * Domains API Calls
 */
class SFDomains extends SFCategoryBase {

  /**
   * Creates a new instance of SFDomain
   *
   * @param {SFRequest} client A SFRequest client.
   */
  constructor(client) {
    super(client);
  }

  /**
   * Gets the domains for a site.
   * @param {*} siteid
   */
  async get(siteid) {
    //TODO: Validate Siteid
    return this.client.get('/domains/' + siteid);
  }


  /**
   * Add a domain to the list associated with a site.
   * @param {*} siteid
   * @param {string} domain
   */
  async add(siteid, domain) {
    let body = '{"domain_name": "' + domain + '" }';
    return this.client.post('/domains/' + siteid + '/add', body);
  }

}

module.exports = SFDomains;
