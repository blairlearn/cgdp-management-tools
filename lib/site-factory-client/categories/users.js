'use strict'

const SFCategoryBase = require('../category-base');

/**
 * User API Calls
 */
class SFUsers extends SFCategoryBase {

    /**
     * Creates a new instance of SFUsers
     *
     * @param {SFRequest} client A SFRequest client.
     * @param {object} config Configuration options.
     * @param {number} config.pageRequestLimit How many items to request from api at a time (DEFAULT: 100 - the max)
     */
    constructor(client, {
        pageRequestLimit = 100
    } = {}) {
        super(client);

        // This is here for 2 reasons:
        // 1. If the API changes, we can more easily change it through configs.
        // 2. For unit testing, we can set it to a lower amount to mock the reqs.
        // NOTE: Acquia has a limit of 100 for paged requests.
        this.pageRequestLimit = pageRequestLimit;
    }

    /**
     * Lists the users in the factory.
     *
     * This is *NOT* the same as the users in any of the Drupal sites.
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

        const usersResponse = await this.client.get('/users', {
            limit: this.pageRequestLimit, // 100 is the max number of sites.
            fields: "uid,name,mail,created,access,status,roles,tfa_status",
            page
        });

        // There are no sites at all, exit quickly.
        if (usersResponse.count == 0) {
            return [];
        }

        // If there are more to fetch, then go fetch them.
        if (usersResponse.count > (page * this.pageRequestLimit)) {
            return usersResponse.sites.concat(
                await this._list(page + 1)
            );
        } else {
            return usersResponse.users;
        }

    }

    /**
     * Set the user to a new set of roles.
     *
     * @param {*} userid the user ID to update.
     * @param {Array<String>} roleList Array of roles to assign to ther user.
     */
    async setRoles(userid, roleList){
        const body = JSON.stringify({roles: roleList});
        return await this.client.put(`/users/${userid}/update`, body);
    }

}

module.exports = SFUsers;