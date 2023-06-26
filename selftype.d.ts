import { FastifyRequest, FastifyReply } from "fastify";
import { FromSchema } from 'json-schema-to-ts'
import events from "events"
import { Accounts } from "./src/models/accounts";
import { RequestOptions } from "http";

declare module 'fastify' {
    export interface FastifyRequest {
        account: Accounts
    }
    export interface FastifyReply {
        format(data: object, code?: number, error?: boolean|string, message?: string): object
    }
    export interface FastifyInstance {
        authToken: (req, res, done) => void
        requestget(url: string, options: RequestOptions): Promise<string>
    }
}

