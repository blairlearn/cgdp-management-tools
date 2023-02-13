const asyncPool                 = require('tiny-async-pool');
const config                    = require('config');

const SiteFactoryClient         = require('./lib/site-factory-client');

const factoryConn = config.get('factoryConnection');

// Client for v1 of the site factory API.
const sourceClient = new SiteFactoryClient({
    username: factoryConn.username,
    apikey: factoryConn.apikey,
    factoryHost: factoryConn.factoryHost
});

async function main() {
    try {
        const sitelist = await sourceClient.sites.list(); // List of ACSF sites

        // Start backups
        const doBackup = async siteInfo => {
            const task = await sourceClient.sites.createBackup(siteInfo.id, `${siteInfo.site} ${Now()}`);
            return task;
        };
        const taskList = await asyncPool(3, sitelist, doBackup);

        console.log('Backups started.')


    } catch (err) {
        console.error('Something went wrong backing up ACSF.', err.toString());
    }
}

/**
 * Get the current date and time.
 *
 * @returns String containing the current date and time in a nicely formatted manner.
 */
function Now()
{
    return new Date().toLocaleString('UTC', { hourCycle: "h23" });
}


main();
