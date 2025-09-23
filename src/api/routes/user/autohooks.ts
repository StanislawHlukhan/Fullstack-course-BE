import { FastifyPluginAsync } from 'fastify';
import { userHook } from '../../hooks/user.hook';
import { ownershipHook } from '../../hooks/ownership.hook';

const hooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', userHook);
  fastify.addHook('preHandler', ownershipHook);
};

export default hooks; 