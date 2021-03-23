'use strict'

const SFCategoryBase        = require('../category-base');

/**
 * Backup API Calls
 */
class SFService extends SFCategoryBase {

  /**
   * Creates a new instance of SFBackup
   *
   * @param {SFRequest} client A SFRequest client.
   */
  constructor(client) {
    super(client);
  }

  /**
   * Ping the factory.
   */
  async ping() {
    return this.client.get('/ping');
  }

  /**
   * Get the status of the factory.
   */
  async status() {
    return this.client.get('/status');
  }
}

module.exports = SFService;
