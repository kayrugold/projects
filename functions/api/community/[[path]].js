import { handleCommunity } from '../../../community/api.mjs';
export const onRequest = ({ request, env }) => handleCommunity(request, env);
