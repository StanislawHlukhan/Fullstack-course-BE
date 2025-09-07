import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from '../errors/HttpError';

export const userHook: preHandlerAsyncHookHandler = async function (request) {
  try {
    if (request.profile?.systemRole !== 'user') {
      throw new Error('Not user');
    }
  } catch (err) {
    throw new HttpError(403, 'Forbidden', err);
  }
};