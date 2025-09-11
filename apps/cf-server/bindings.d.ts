import { D1Database } from '@cloudflare/workers-types/';
import { Env } from 'hono';

type Environment = Env & {
  Bindings: {
    DB: D1Database;
    ENV_TYPE: 'dev' | 'prod' | 'stage';
  };
};