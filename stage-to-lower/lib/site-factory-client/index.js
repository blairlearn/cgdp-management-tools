'use strict'
const axios                         = require('axios');
const { HttpsAgent }                = require('agentkeepalive');

const SFRequest                     = require('./request');
const SFDomains                     = require('./categories/domains');
const SFService                     = require('./categories/service');
const SFSites                       = require('./categories/sites');
const SFTasks                       = require('./categories/tasks');
const SFUsers                       = require('./categories/users');

/**
 * Represents a Site Factory REST API Client.
 */
class SiteFactoryClient {

  /**
   * Creates a new instance of a Site Factory Client
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

  /**
   * Gets domains category.
   */
  get domains() {
    return new SFDomains(this.client);
  }

  /**
   * Gets backup category.
   */
  get service() {
    return new SFService(this.client);
  }

  /**
   * Gets the sites category.
   */
  get sites() {
    return new SFSites(this.client);
  }

  /**
   * Gets the tasks category.
   */
  get tasks() {
    return new SFTasks(this.client);
  }

  /**
   * Gets the users category.
   */
  get users() {
    return new SFUsers(this.client);
  }

}

module.exports = SiteFactoryClient;
