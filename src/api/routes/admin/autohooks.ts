import { FastifyPluginAsync } from 'fastify';
import { adminHook } from '../../hooks/admin.hook';

const hooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', adminHook);
};

export default hooks;