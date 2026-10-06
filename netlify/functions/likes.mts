import { getStore, getDeployStore } from '@netlify/blobs';
import type { Config, Context } from '@netlify/functions';
import { createLikesHandler } from './_shared/likes-core.mjs';
import promptIds from './_shared/prompt-ids.mjs';

export default async (request: Request, context: Context) => {
  const store = () => context.deploy.context === 'production'
    ? getStore({ name: 'promptverse-likes', consistency: 'strong' })
    : getDeployStore({ name: 'promptverse-likes', consistency: 'strong' });
  return createLikesHandler(store, promptIds)(request);
};

export const config: Config = {
  path: '/api/likes',
  method: ['GET', 'POST'],
};
