import { FastifyInstance } from "fastify";
import { login, wrap, register} from "../validators/auth"
import {createHmac} from "crypto"
const { v4: uuidv4 } = require('uuid');

import { FromSchema } from "json-schema-to-ts";

import { secretKey } from "../../config.json";
import { Accounts } from "../models/accounts";
import { Op } from "sequelize";

module.exports = async (app: FastifyInstance) => {
    app.post<{Body: FromSchema<typeof register>}>
    ("/register", wrap(register), async (req, res)=>{
        let findSame = await Accounts.findOne({
            where: {
                [Op.or] : [
                    { mail: req.body.email}, 
                    { username: req.body.username}
                ]}
        })
        .catch(() => {
            return null
        });;
        if(findSame) return res.format([], 400, "Bad Request", "User already exist !")
        let password = createHmac("sha256", secretKey).update(req.body.password).digest("hex")
        let createdUser = await Accounts.create({
            id: uuidv4(),
            mail: req.body.email,
            username: req.body.username,
            name: req.body.name,
            password: password
        });
        if(createdUser) return res.format([{createdUser}], 200, "Succesfull", "User created !")

    })

    app.post<{Body: FromSchema<typeof login>}>
    ("/login", wrap(login), async (req, res)=>{
        let password = createHmac("sha256", secretKey).update(req.body.password).digest("hex")
        const data: any = await Accounts.findOne({ where: { username: req.body.username, password: password }})
        .catch(() => {
            return null
        });
        if(!data) return res.format([], 401, "Unauthorized", "Invalid credentials")
        if(data.deleted_at !== null) return res.format([], 403, "Forbidden", "Account Deleted")
        let token = await app.jwt.sign({id: data.id, exp : Date.now() + 3_600_000})
        let redirect: string = '/';
        res.setCookie("token", token, {
            path: "/"
        }).format({token, redirect})
    })

    app.get("/check", async (req, res)=>{
        res.format(req.account)
    });

}