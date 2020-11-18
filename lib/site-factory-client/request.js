'use strict'

const axios                         = require('axios');

const BASE_PATH = '/api/v1'

/**
 * Wrapper for making Site Factory API Requests.
 */
class SFRequest {

  /**
   * Creates a new instance of a SFRequest
   * @param {object} agent An https agent.
   * @param {string} username The username for requests.
   * @param {string} apikey The apikey for the user.
   * @param {string} factoryHost The hostname of the Site Factory
   */
  constructor(agent, username, apikey, factoryHost) {
    if (!username) {
      throw new Error("Username is required.");
    }

    if (!apikey) {
      throw new Error("Api key is required.");
    }

    if (!factoryHost) {
      throw new Error("Site Factory host is required.")
    }

    // Instantate an axios client to make requests.
    this.axiosClient = axios.create({
      httpsAgent: agent,
      //TODO: Make checks so this does not blow up.
      baseURL: 'https://' + factoryHost + BASE_PATH + '/',
      auth: {
        username: username,
        password: apikey
      },
      responseType: 'json',
      timeout: 30000,
    });
  }

  /**
   * Performs a Get request for path.
   *
   * @param {string} path the path to request.
   */
  async get(path, params = {}) {
    const res = await this.axiosClient.get(path, {
      params
    });

    if (res.status === 200) {
      return res.data;
    }
  }

  /**
   * Performs a post request for path
   * @param {*} path the path to post the data to.
   * @param {*} body The data to post, probably a JSON document.
   */
  async post(path, body = null) {
    const res = await this.axiosClient.post(path, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch((err) => {
      console.log(err);
    });

    if(res.status === 200) {
      return res.data;
    }
  }

}

module.exports = SFRequest;
