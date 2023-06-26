import fastify from 'fastify'
import pino from "pino"
const log = pino({level: "info"})

const app = require("./src/app")
log.info(`Worker ${process.pid} started`);
app.default()