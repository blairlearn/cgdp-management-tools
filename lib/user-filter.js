'use strict'

const c = require("config")

/**
 * Filter a list of users according to their roles.
 *
 * If the user has a role on the forbidden list, removal takes precedence over
 * roles on the required list.
 *
 * @param {Object[]} userlist List of user objects (from ACSF users API).
 * @param {String} userlist[].uid user ID.
 * @param {String} userlist[].name user name.
 * @param {String} userlist[].mail email address.
 * @param {String} userlist[].created representation of the date/time when the user was created.
 * @param {String} userlist[].access representation of the date/time the user last accessed the system.
 * @param {String} userlist[].status true if the user is active, false if the user is blcked.
 * @param {String} userlist[].tfa_status true if two-factor authentication is turned on, else false.
 * @param {Object} userlist[].roles collection of roles the user has.
 * @param {Array<String>} requiredRoles Array of role names allow a user to remain on the list.
 * @param {Array<String>} forbiddenRoles Array of role names which cause a user to be removed from the list.
 */
module.exports = function (userlist, requiredRoles = [], forbiddenRoles = []) {

    // Remove all users with roles appearing in the forbidden list.
    userlist = userlist.filter(user => !Object.values(user.roles).some(role => forbiddenRoles.includes(role)));

    // Keep only those users with roles appearing in the required list.
    if(requiredRoles.length > 0){
        userlist = userlist.filter(user => Object.values(user.roles).some(role => requiredRoles.includes(role)));
    }

    return userlist;
}
