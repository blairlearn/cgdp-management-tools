'use strict'

const SFCategoryBase = require('../category-base');

/**
 * Tasks API Calls
 */
class SFStaging extends SFCategoryBase {

    /**
     * Creates a new instance of SFTasks
     *
     * @param {SFRequest} client A SFRequest client.
     */
    constructor(client){
        super(client);
    }

    /**
     * Retrieves available environments user can stage to.
     */
    async environments() {
        const taskResponse = await this.client.get('/stage');

        return taskResponse.environments;
    }

    /**
     * Starts the staging process.
     * @param {*} toEnv
     * @param {*} sites
     * @param {*} wipeTargetEnvironment
     * @param {*} synchronizeUsers
     * @param {*} detailedStatus
     */
    async stage(toEnv, sites, wipeTargetEnvironment, synchronizeUsers, detailedStatus) {
        // TODO: Validate

        let body = {
            "to_env": toEnv,
            "sites": sites,
            "wipe_target_environment": wipeTargetEnvironment,
            "synchronize_all_users": synchronizeUsers,
            "detailed_status":detailedStatus
        };
        return this.client.post('/stage', JSON.stringify(body));
    }

}

module.exports = SFStaging;
