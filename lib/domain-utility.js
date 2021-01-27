'use strict'

// Utility functions for maninpulating ACSF domains names.

// RegEx for matcing UI site names. e.g. www or www-prod-acsf
const uiSiteName = /^[a-z][a-z0-9]+(\-[a-z][a-z0-9]+\-acsf)?$/i;

// RegEx for matching CMS site names. e.g. www-cms or www-cms-test
const cmsSiteName = /^[a-z][a-z0-9]+\-cms(\-[a-z][a-z0-9]+)?$/i;

/**
 * Convert a site factory host name into the name of one of its staging targets.
 * (e.g. www.demo.acsitefactory.com becomes www.dev-demo.acsitefactory.com)
 *
 * Server names are assumed to follow the convention of
 *
 *      www.[tier-]<org>.acsitefactory.com
 *
 * where `[tier-]` is the staging environment's prefix and
 * `<org>` is the organization name group. In the above example,
 * this would be 'demo'.
 *
 * @param {string} serverName Fully qualified server name. e.g. www.demo.acsitefactory.com
 * @param {string} target Staging target environment name. e.g. DEV or TEST.
 */
module.exports.SFToStagingTarget = function(serverName, target) {
    let segs = serverName.split('.');
    segs[1] = target + '-' + segs[1];
    return segs.join('.');
}

/**
 * Convert's a site host name to match a staging tier.
 * e.g. www-prod-acsf.demo.com becomes www-dev-acsf.demo.com,
 *  www-cms.demo.com becomes www-cms-dev.demo.com.
 *
 * Site host names are assumed to follow the naming convention of:
 *  <site>-<tier>-acsf.domain.com   // Front end site
 *  <site>.domain.com               // Production front end
 *  <site>-cms-<tier>.domain.com.   // CMS site
 *  <site>-cms.domain.com.          // Prod CMS site
 *
 * @param {string} siteName Fully qualified name of a site.  e.g. www-prod-acsf.demo.com
 * @param {string} target The tier to convert to.
 */
module.exports.SiteToTierSpecific = function(siteName, target) {
    let fqdnSegs = siteName.split('.');
    let hostName = fqdnSegs[0];

    if(uiSiteName.test(hostName)) {
        let hostSegs = hostName.split('-');

        // Handle both unadorned and decorated names by forcing the 'acsf' suffix regardless
        // of whether it's already there.
        hostSegs[1] = target;
        hostSegs[2] = 'acsf';
        hostName = hostSegs.join('-');
    }
    else if(cmsSiteName.test(hostName)) {
        let hostSegs = hostName.split('-');
        hostSegs[2] = target;
        hostName = hostSegs.join('-');
    }
    else {
        throw `Host name '${hostName}' is not in an expected format`;
    }

    fqdnSegs[0] = hostName;

    return fqdnSegs.join('.');
}


/**
 * Converts a list of ACSF site domains for use with a staging target environment.
 *
 * @param {Array} originalList Collection of domains in the format returned by the
 *  ACSF API's get domains function.
 * @param {string} target The tier to convert to.
 * @returns Array of objects
 *  {
 *      id: int,            // Site ID
 *      primary: string,    // Primary domain
 *      secondary: string[] // Array of secondary domains.
 *  }
 */
module.exports.GenerateDestinationDomains = function (originalList, target) {

    let destinationList = originalList.map((item) => {

        let primary = null;
        let secondary = [];

        item.domains?.custom_domains?.forEach((originalDomain) => {

            let destinationDomain = this.SiteToTierSpecific(originalDomain, target);

            // Guarantee a primary.
            if(primary === null) {
                primary = destinationDomain;
                return;
            }

            // Skip duplicates (www.example.com and wwww-tier-acsf.example.com are equivalent).
            if(primary === destinationDomain)
                return;


            // UI site names take priority for being the primary.

            // If the primary is already a UI site, this is added to the secondary list.
            let primaryHostName = primary.split('.')[0];
            if (uiSiteName.test(primaryHostName)) {
                if(!secondary.includes(destinationDomain) ) {
                    secondary.push(destinationDomain);
                }
            }
            else {
                // The new name becomes primary, the old primary gets added to secondary.
                let previousName = primary;
                primary = destinationDomain;
                if(!secondary.includes(previousName)) {
                    secondary.push(previousName);
                }
            }

        });

        return {
            siteID: item["node_id"],
            primary: primary,
            secondary: secondary
        }
    })

    return destinationList;
}
