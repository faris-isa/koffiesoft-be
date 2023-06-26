import {wrap} from "./validatorWrapper";
export {wrap}

export const login = {
    type: "object",
    additionalProperties: false,
    properties: {
        username: {type: "string"},
        password: {type: "string"}
    },
    required: ["username", "password"]
} as const;

export const register = {
    type: "object",
    additionalProperties: false,
    properties: {
        name: {type: "string"},
        email: {type: "string"},
        username: {type: "string"},
        password: {type: "string"}
    },
    required: ["username", "password", "name", "email"]
} as const;