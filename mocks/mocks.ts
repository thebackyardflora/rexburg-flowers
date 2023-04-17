import { setupServer } from 'msw/node';
import { squareHandlers } from './square';

const server = setupServer(...squareHandlers);

server.listen({ onUnhandledRequest: 'bypass' });
console.info('🔶 Mock server running');

process.once('SIGINT', () => server.close());
process.once('SIGTERM', () => server.close());
