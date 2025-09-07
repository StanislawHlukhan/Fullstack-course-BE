import { FastifyPluginAsync } from 'fastify';
import { userHook } from '../../hooks/user.hook';

const hooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', userHook);
};

export default hooks; 