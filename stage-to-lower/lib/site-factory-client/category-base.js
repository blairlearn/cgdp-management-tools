'use strict'

const SFRequest                     = require('./request');

/**
 * Represents a Site Factory category (backup, site, etc).
 */
class SFCategoryBase {

  /**
   * Creates a new instance of SFCategoryBase
   *
   * @param {SFRequest} client A SFRequest client.
   */
  constructor(client) {
    this.client = client;

    //TODO: Check for abstract.
  }
}

module.exports = SFCategoryBase;
