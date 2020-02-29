"use strict";

const { OutputDataType } = require("../../../shared/variable-contants");

const customRolesManager = require("../../roles/custom-roles-manager");
const firebotRolesManager = require("../../roles/firebot-roles-manager");

const model = {
    definition: {
        handle: "numUsersInRole",
        description: "Get the number of people in a custom role or firebot role.",
        usage: "numUsersInRole[roleName]",
        possibleDataOutput: [OutputDataType.NUMBER]
    },
    evaluator: async (_, roleName) => {

        if (roleName == null || roleName == null) {
            return 0;
        }

        let customRole = customRolesManager.getRoleByName(roleName);

        if (customRole !== null) {
            return customRole.viewers.length;
        }

        let firebotRole = firebotRolesManager.getFirebotRoleByName(roleName);

        if (firebotRole !== null) {
            return firebotRole.length;
        }

        return 0;
    }
};

module.exports = model;
