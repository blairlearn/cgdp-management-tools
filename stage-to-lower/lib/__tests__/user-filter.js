'use strict'

const { TestScheduler } = require('jest');
const UserFilter = require('../user-filter');

const REQUIRED_ROLE = ["required role"];
const FORBIDDEN_ROLE = ["forbidden role"];

const userRequired = {
    "uid": "1",
    "name": "user 1",
    "mail": "user1@example.com",
    "created": "1544460719",
    "access": "1611758946",
    "status": "active",
    "tfa_status": "active",
    "roles": {
        "16": "required role"
    }
};

const userForbidden = {
    "uid": "2",
    "name": "user 2",
    "mail": "user2@example.com",
    "created": "1547563649",
    "access": "1611865774",
    "status": "active",
    "tfa_status": "active",
    "roles": {
        "21": "forbidden role"
    }
};

const userRequiredForbidden = {
    "uid": "3",
    "name": "user 3",
    "mail": "user3@example.com",
    "created": "1547563740",
    "access": "1600292749",
    "status": "blocked",
    "tfa_status": "active",
    "roles": {
        "16": "required role",
        "21": "forbidden role"
    }
};

const userRequiredMixed = {
    "uid": "4",
    "name": "user 4",
    "mail": "user4@example.com",
    "created": "1547563783",
    "access": "1611764823",
    "status": "active",
    "tfa_status": "active",
    "roles": {
        "16": "required role",
        "21": "unrelated role"
    }
};

const userForbiddenMixed = {
    "uid": "5",
    "name": "user 5",
    "mail": "user 5@example.com",
    "created": "1557957442",
    "access": "1563203851",
    "status": "blocked",
    "tfa_status": "active",
    "roles": {
        "21": "forbidden role",
        "31": "unrelated role"
    }
};

const userIrrelevant = {
    "uid": "6",
    "name": "user 6",
    "mail": "user6@example.com",
    "created": "1557957442",
    "access": "1563203851",
    "status": "blocked",
    "tfa_status": "active",
    "roles": {
        "31": "unrelated role"
    }
};

describe('UserFilter', () => {

    test('Keep everything when not filtering', () => {
        const input = [
            userRequired,
            userForbidden,
            userRequiredForbidden,
            userRequiredMixed,
            userForbiddenMixed,
            userIrrelevant
        ];

        const expected = [
            userRequired,
            userForbidden,
            userRequiredForbidden,
            userRequiredMixed,
            userForbiddenMixed,
            userIrrelevant
        ];

        const actual = UserFilter(input, [], []);
        expect(actual).toEqual(expected);
    });

    test('Keep required criteria', () => {
        const input = [
            userRequired,
            userForbidden,
            userRequiredForbidden,
            userRequiredMixed,
            userForbiddenMixed,
            userIrrelevant
        ];

        const expected = [
            userRequired,
            userRequiredForbidden,
            userRequiredMixed
        ];

        const actual = UserFilter(input, REQUIRED_ROLE, []);
        expect(actual).toEqual(expected);
    });

    test('Screen out forbidden roles', () => {
        const input = [
            userRequired,
            userForbidden,
            userRequiredForbidden,
            userRequiredMixed,
            userForbiddenMixed,
            userIrrelevant
        ];

        const expected = [
            userRequired,
            userRequiredMixed,
            userIrrelevant
        ];

        const actual = UserFilter(input, [], FORBIDDEN_ROLE);
        expect(actual).toEqual(expected);
    });

    test('Keep required while removing forbidden', () => {
        const input = [
            userRequired,
            userForbidden,
            userRequiredForbidden,
            userRequiredMixed,
            userForbiddenMixed,
            userIrrelevant
        ];

        const expected = [
            userRequired,
            userRequiredMixed
        ];

        const actual = UserFilter(input, REQUIRED_ROLE, FORBIDDEN_ROLE);
        expect(actual).toEqual(expected);
    });

});