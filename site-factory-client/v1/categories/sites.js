'use strict'

const SFCategoryBase        = require('../category-base');

/**
 * Site API Calls
 */
class SFSites extends SFCategoryBase {

  /**
   * Creates a new instance of SFSites
   *
   * @param {SFRequest} client A SFRequest client.
   * @param {object} config Configuration options.
   * @param {number} config.pageRequestLimit How many items to request from api at a time (DEFAULT: 100 - the max)
   */
  constructor(client, {
    pageRequestLimit = 100
  } = { }) {
    super(client);

    // This is here for 2 reasons:
    // 1. If the API changes, we can more easily change it through configs.
    // 2. For unit testing, we can set it to a lower amount to mock the reqs.
    // NOTE: Acquia has a limit of 100 for paged requests.
    this.pageRequestLimit = pageRequestLimit;
  }

  /**
   * Lists the sites in the factory.
   */
  async list() {
    return this._list(1);
  }

  /**
   * Internal method to make the raw paginated list requests.
   *
   * @param {number} page Page of results to return (DEFAULT: 1)
   */
  async _list(page = 1) {

    const sitesResponse = await this.client.get('/sites', {
      limit: this.pageRequestLimit, // 100 is the max number of sites.
      page
    });

    // There are no sites at all, exit quickly.
    if (sitesResponse.count == 0) {
      return [];
    }

    // If there are more to fetch, then go fetch them.
    if (sitesResponse.count > (page * this.pageRequestLimit)) {
      return sitesResponse.sites.concat(
        await this._list(page + 1)
      );
    } else {
      return sitesResponse.sites;
    }

  }

  /**
   * Gets the details of a site.
   *
   * @param {*} siteID
   */
  async get(siteID) {
    //TODO: Check if number.

    return this.client.get('/sites/' + siteID);
  }

  /**
   *
   * @param {number} siteID
   * @param {string} label Human-readable label for the backup.
   */
  async createBackup(siteID, label) {
    return this.client.post(`/sites/${siteID}/backup`, {
      "label": label
    });
  }

  /**
   * Gets the backups for a site.
   *
   * @param {*} siteID
   * @param {object} param.limit Sites to return (DEFAULT: 100, Max 100)
   * @param {object} param.page Page of results to return (DEFAULT: 1)
   */
  async getBackups(siteID, {
    limit = 100,
    page = 1
  } = { }) {

    // Loop through backup requests and return single array.

    return this.client.get('/sites/' + siteID + '/backups',{
      limit,
      page
    });
  }

  async clearCache(siteID) {
    return this.client.post('/sites/' + siteID + '/cache-clear');
  }
}

module.exports = SFSites;
