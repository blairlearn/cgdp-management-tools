const config = require('config');
const SiteFactoryClient = require('./lib/site-factory-client');
const SiteFactoryClient2 = require('./lib/site-factory-client-2');
const fs = require('fs');

// TODO: This needs to come from the command-line.
const TARGET_ENV = "dev";

const factoryConn = config.get('factoryConnection');

const sourceClient = new SiteFactoryClient({
    username: factoryConn.username,
    apikey: factoryConn.apikey,
    factoryHost: factoryConn.factoryHost
});

const sourceClient2 = new SiteFactoryClient2({
    username: factoryConn.username,
    apikey: factoryConn.apikey,
    factoryHost: factoryConn.factoryHost
});

async function main() {
    try {
        const srcSitelist = await sourceClient.sites.list(); // List of ACSF sites

        const siteIds = srcSitelist.map((site) => site.id);

        // Stage to requested lower tier.
        let stageTask = await sourceClient2.stage.stage(TARGET_ENV, siteIds, true, true, false);

        // Wait for staging to complete.
        await sourceClient.tasks.waitForCompletion(stageTask.task_id, showProgress);

        console.log(JSON.stringify(stageTask));
        console.log(`Done staging to '${TARGET_ENV}' environment.`);

        // Re-assign domains to the target.

    } catch (err) {
        console.error(err);
    }
}

function showProgress(isComplete) {
    process.stdout.write('.');
    if(isComplete){
        process.stdout.write('\n');
    }
}

async function doAssignments(sitelist, domainlist) {

    sitePromises = [];
    sitelist.forEach(site => {
        sitePromises += doPerSiteAssignments(site.id, domainlist[site.site]);
    });
    await Promise.all(sitePromises);
}

async function doPerSiteAssignments(siteId, domainInfo) {

    // Make sure the default domain is assinged first.
    await sourceClient.domains.add(siteId, domainInfo.default);

    // Set the additonal domains
    additionalSites = [];
    domainInfo.additional.forEach(domain => {
        additionalSites += sourceClient.domains.add(siteId, domain);
    });

    await Promise.all(additionalSites);
}

/**
 * Retrieve a list of the domains which are mapped to each
 * of the ACSF sites.
 *
 * {
 *   "host": {
 *     "default": "default.cancer.gov",
 *     "additional": [
 *       "name1.cancer.gov",
 *       "name2.cancer.gov"
 *     ]
 *   }
 * }
 *
 */
async function getDomains() {
    return new Promise((resolve, reject) => {
        fs.readFile('domainlist.json', function read(err, data) {
            if (err)
                reject(err);
            else
                resolve(JSON.parse(data));
        });
    });
}

main();
