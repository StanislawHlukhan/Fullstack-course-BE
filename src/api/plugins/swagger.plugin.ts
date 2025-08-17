import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { EErrorCodes, getErrorCodesDescription } from '../errors/EErrorCodes';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export async function setupSwagger(server: FastifyInstance, _userName?: string, _pwd?: string) {
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'fastify-boilerplate',
        description: 'fastify-boilerplate',
        version: '1.0.0'
      },
      servers: [],
      components: {
        schemas: {
          ErrorCodes: {
            type: 'integer',
            enum: Object.values(EErrorCodes).filter((value) => typeof value === 'number'),
            description: getErrorCodesDescription()
          }
        }
      }
    },
    transform: jsonSchemaTransform
  });
  await server.register(fastifySwaggerUI, {
    routePrefix: '/api/documentation',
    logLevel: 'silent'
  });
}