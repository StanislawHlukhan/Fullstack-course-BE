"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggerOptions = getLoggerOptions;
function getLoggerOptions() {
    const localPrintOpts = {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss.l Z',
                ignore: 'pid,hostname'
            }
        }
    };
    const opts = {
        level: 'trace',
        redact: ['req.headers.authorization', 'req.headers["impersonate-authorization"]'],
        serializers: {
            req(request) {
                return {
                    ip: request.ip,
                    method: request.method,
                    url: request.url,
                    path: request.routeOptions.url,
                    query: request.query,
                    parameters: request.params,
                    headers: request.headers
                };
            }
        }
    };
    return process.env.NODE_ENV === 'local' ? { ...localPrintOpts, ...opts } : opts;
}
