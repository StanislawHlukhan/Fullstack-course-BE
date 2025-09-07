import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from '../errors/HttpError';

export const adminHook: preHandlerAsyncHookHandler = async function (request) {
  try {
    if (request.profile?.systemRole !== 'admin') {
      throw new Error('Not admin');
    }
  } catch (err) {
    throw new HttpError(403, 'Forbidden', err);
  }
};