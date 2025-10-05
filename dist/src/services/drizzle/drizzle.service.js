"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
exports.dbHealthCheck = dbHealthCheck;
exports.getTransactionManager = getTransactionManager;
const node_postgres_1 = require("drizzle-orm/node-postgres");
function getDb(opts) {
    const db = (0, node_postgres_1.drizzle)({
        casing: 'snake_case',
        logger: opts.logsEnabled,
        connection: {
            ssl: false,
            port: opts.port,
            host: opts.host,
            password: opts.pwd,
            database: opts.db,
            user: opts.user
        }
    });
    return db;
}
async function dbHealthCheck(db) {
    const healthMetric = {
        isOk: false,
        serviceName: 'postgres'
    };
    try {
        const res = await db.execute('select 1+1 as sum;');
        healthMetric.isOk = res.rows[0].sum === 2;
    }
    catch (error) {
        // Log the error instead of adding it to the response
        healthMetric.errorMessage = error;
    }
    return healthMetric;
}
function getTransactionManager(db) {
    return {
        async execute(runnable) {
            return await db.transaction(async (tx) => {
                return await runnable({
                    rollback: () => tx.rollback(),
                    sharedTx: tx
                });
            });
        }
    };
}
