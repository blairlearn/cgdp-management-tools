const asyncPool                 = require('tiny-async-pool');
const config                    = require('config');
const nodemailer                = require('nodemailer');

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
        SendNotification(`ACSF backups started at ${Now()}.`)

        const sitelist = await sourceClient.sites.list(); // List of ACSF sites

        // Start backups
        const doBackup = async siteInfo => {
            const task = await sourceClient.sites.createBackup(siteInfo.id, `${siteInfo.site} ${Now()}`);
            // Wait for the backup. It's not interactive, so no "status bar" method.
            await sourceClient.tasks.waitForCompletion(task.task_id, null);
            return task;
        };
        const taskList = await asyncPool(3, sitelist, doBackup);

        // Get task completion statuses.
        const getStatus = taskInfo => sourceClient.tasks.taskStatus(taskInfo.task_id);
        const statusList = await asyncPool(3, taskList, getStatus);

        let success = true;
        let errors = [];
        statusList.forEach(status => {
            // There's also a "status" key, but it's not clear whether that value can be counted on to remain constant.
            // 'Completed' is less unambiguous.
            if(status.wip_task.status_string != 'Completed') {
                success = false;
                errors.push(`${status.wip_task.name} failed: ${status.wip_task.error_message}`)
            }
        });

        if(success) {
            SendNotification(`ACSF backups completed successfully at ${Now()}.`);
        }
        else {
            SendNotification(
                `ACSF backups completed with problems at ${Now()}.`,
                errors.join('\n')
            );
        }

    } catch (err) {
        SendNotification('Something went wrong backing up ACSF.', err.toString());
    }
}

async function SendNotification(subject, message) {

    // We're only sending one message at a time, so there's no sense in pooling connections.
    const transporter = nodemailer.createTransport({
        pool: false,
        host: config.mail.server,
        port: config.mail.port
    });

    await transporter.sendMail({
        from: config.mail.sender,
        to: config.mail.recipients,
        subject: subject,
        text: message ?? subject
    });
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
