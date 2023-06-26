import fastifyPlugin from 'fastify-plugin'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import cookie from "cookie"
import { RequestOptions, get } from 'http';
import { Accounts } from '../models/accounts';


module.exports = fastifyPlugin((app: FastifyInstance, opt: FastifyPluginOptions, done: Function) => {
    
    app.decorateReply("format", function(data: object, code = 200, error = "no error", message = "OK") {
        if(code != 200){
            this.raw.statusMessage = error
            this.raw.statusCode = code
        }
        let output:{
            statusCode: number,
            error: string,
            message: string,
            data: object
        } = {
            statusCode: code,
            error: error,
            message: message,
            data: {}
        }
        if (Array.isArray(data)) {
            output.data = data
        } else {
            output.data = [data]
        }
        this.send(output)
    })

    app.decorate("authToken", async (req: FastifyRequest, res: FastifyReply)=>{
        if(
            req.url.match(/^\/test/) || 
            req.url.match(/^\/auth\/login$/) || 
            req.url.match(/^\/auth\/register$/) || 
            req.url == "/favicon.ico"
        ) return;

        let token = ""  
        if(req.headers.accept == "text/event-stream"){
            // @ts-ignore
            token = await app.jwt.verify(req.query?.token)
        }else{
            try{
                let tempKue = cookie.parse(String(req.headers.cookie))
                if(!tempKue.token) throw new Error("No token")
                token = await app.jwt.verify(tempKue.token)
            }catch(e){
                token = await app.jwt.verify(String(req.headers.token))
            }
        }
        
        //@ts-ignore
        if(token.exp < Date.now()) throw new Error("Token expired")
        let dataUser: any = await Accounts.findOne({
            // @ts-ignore
            where : {id: token.id}, 
            attributes: ['id', 'username', 'name', 'mail', 'deleted_at']
        })
        if(!dataUser) throw new Error("User Not Found")
        if(dataUser.deleted_at !== null) throw new Error("User Deleted")
        req.account = dataUser
    })

    app.decorate("requestget", (url: string|RequestOptions|URL) => {
        return new Promise((resolve) => {
            var result = ""
            var req = get(url, (res) => {
                console.log(`STATUS: ${res.statusCode}`)
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on("data", (chunk) => {
                    result += chunk
                })
                res.on("end", () => {
                    resolve(JSON.parse(result))
                })
            })
            req.on("error", (e) => {
                console.error(`problem with request: ${e.message}`);
            })
        })
    })
    done()
})