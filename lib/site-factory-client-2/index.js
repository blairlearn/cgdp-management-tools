'use strict'
const axios                         = require('axios');
const { HttpsAgent }                = require('agentkeepalive');

const SFRequest                     = require('./request');
const SFStaging                     = require('./categories/staging');

/**
 * Represents a Site Factory REST API v2 Client.
 */
class SiteFactoryClient2 {

  /**
   * Creates a new instance of a Site Factory v2 Client
   *
   * @param {*} config Configuration parameters for the client.
   * @param {*} config.username API Username.
   * @param {*} config.apikey API Key.
   * @param {*} config.factoryHost Hostname of the Site Factory.
   * @param {*} config.connInfo Connection Information.
   * @param {*} config.connInfo.agent Http/https agent for connection. (DEFAULT: agentkeepalive)
   */
  constructor({
    username = null,
    apikey = null,
    factoryHost = null,
    connInfo = {
      agent: new HttpsAgent({
        maxSockets: 40
      })
    }
  } = {}) {

    if (!username) {
      throw new Error("Username is required.");
    }

    if (!apikey) {
      throw new Error("Api key is required.");
    }

    if (!factoryHost) {
      throw new Error("Site Factory host is required.")
    }

    // TODO: Validate connInfo

    this.client = new SFRequest(connInfo.agent, username, apikey, factoryHost);
  }

  get stage() {
    return new SFStaging(this.client);
  }

}

module.exports = SiteFactoryClient2;
