import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';

import { createDinosaur } from './game/createDinosaur.js';
import { initializeDatabase } from './storage/database.js';
import { saveDinosaur } from './storage/saveDinosaur.js';
import { getDinosaurByPlayerId } from './storage/getDinosaurByPlayerId.js';

import cookie from '@fastify/cookie';
import { createGuestSession, findGuestSession} from './storage/guestSessions.js';

const app = Fastify({
  logger: true,
});

await app.register(cookie);

app.get('/api/health', async () => {
  return {
    status: 'ok',
    service: 'dinoboop-backend',
  };
});

app.post('/api/session', async (request, reply) => {
  const token = request.cookies.dinoboop_session;

  if (token) {
    const playerId = findGuestSession(database, token);

    if (playerId) {
      return {
        status: 'ok',
        newSession: false,
      };
    }
  }

  const newToken = createGuestSession(database);

  reply.setCookie('dinoboop_session', newToken, {
    path: '/api',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  });

  return reply.code(201).send({
    status: 'ok',
    newSession: true,
  });
});

const database = initializeDatabase();

app.addHook('onClose', async () => {
  database.close();
});

interface CreateDinosaurBody {
  name: string;
}

app.post<{ Body: CreateDinosaurBody }>(
  '/api/dinosaurs',
  {
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 20,
            pattern: '\\S',
          },
        },
      },
    },
  },
  async (request, reply) => {
    
    const token = request.cookies.dinoboop_session;

    if (!token) {
      return reply.code(401).send({
        error: 'Guest session required',
      });
    }

    const playerId = findGuestSession(database, token);

    if (!playerId) {
      return reply.code(401).send({
        error: 'Invalid or expired session',
      });
    }

    const existingDinosaur = database.prepare(`
      SELECT id
      FROM dinosaurs
      WHERE player_id = ?
      LIMIT 1
    `).get(playerId);

    if (existingDinosaur) {
      return reply.code(409).send({
        error: 'Player already has a dinosaur',
      });
    }

    const name = request.body.name.trim();
    const dinosaur = createDinosaur(name);

    saveDinosaur(database, dinosaur, playerId);

    return reply.code(201).send(dinosaur);

  }
);

app.get('/api/dinosaurs/me', async (request, reply) => {
  const token = request.cookies.dinoboop_session;

  if (!token) {
    return reply.code(401).send({
      error: 'Guest session required',
    });
  }

  const playerId = findGuestSession(database, token);

  if (!playerId) {
    return reply.code(401).send({
      error: 'Invalid or expired session',
    });
  }

  const dinosaur = getDinosaurByPlayerId(database, playerId);

  return { dinosaur };
});



if (process.env.NODE_ENV === 'production') {
  const frontendPath = fileURLToPath(
    new URL('../../frontend/dist/', import.meta.url)
  );

  await app.register(fastifyStatic, {
    root: frontendPath,
    prefix: '/',
  });
}




const port = Number(process.env.PORT ?? 3000);

const host = process.env.NODE_ENV === 'production'
  ? '0.0.0.0'
  : '127.0.0.1';

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}

