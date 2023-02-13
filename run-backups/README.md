# Backups

Like it says on the tin, this is a pair of scripts for running backups in an ACSF environment.

* **index.js** - this is the "main" script, intended for use in a nightly cron job. This script sends an email notification when starting backups and another when either the backups complete or an error prevents them from completing.
* **fast-backup.js** - this is a "fire and forget" script, intended for situations where a long-running job with polling may not be desirable. This script queues up a backup for each site and exits immediately without waiting to check for completion status.

## Configuration

Configuration files are stored in the `config` directory.  Do not alter the contents of `default.json`, instead, copy its contents to `local.json` (this file is explicitly excluded from version control).

The format of the configuration file is:

```json
{
  "factoryConnection": {
    "username": "nobody",
    "apikey": "11111111",
    "factoryHost": "www.site.acsitefactory.com"
  },
  "mail": {
    "server": "none",
    "port": -1,
    "sender": "nobody",
    "recipients": "nobody"
  }
}
```

Under the `factoryConnection` key:
- `username` - your ACSF username (`username@nih.gov`).
- `apikey` - your ACSF API key (obtain this from "Account Settings" on ACSF).
- `factoryHost` - the ACSF environment you will be backing up.

Under the `mail` key:
- `server` - the forwarding mail server.  Probably the NIH mail forwarder.
- `port`- the mail server's port number.
- `sender` - the email address notifications will come from.  Probably your `username@mail.nih.gov` address.
- `recipients` - a string containing a comma-separated list of addresses to notify when backups start and complete.

Both scripts share the same configuration file. However, if you are only using `fast-backup.js`, the `mail` key and structure may be left out.