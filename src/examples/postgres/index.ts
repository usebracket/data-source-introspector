import 'dotenv/config';
import { PostgresIntrospector } from '../../data-sources/postgres';
import { PostgresConnectionDetails } from '../../data-sources/postgres/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_PORT: string;
      POSTGRES_HOST: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_USER: string;
      POSTGRES_TABLE: string;
      POSTGRES_SCHEMA: string;
    }
  }
}

(async () => {
  const postgresConnectionDetails: PostgresConnectionDetails = {
    user: process.env.POSTGRES_USER,
    port: +process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    // ---- OR ----
    // connectionString: 'myConnectionString',
  };
  const pgIntrospector = new PostgresIntrospector();
  await pgIntrospector.init(postgresConnectionDetails);

  const pgIntrospectionResult = await pgIntrospector.introspect({
    table: process.env.POSTGRES_TABLE,
    schema: process.env.POSTGRES_SCHEMA,
    // ---- OR ----
    // query: 'SELECT * FROM myTable LIMIT 1',
  });
  console.dir({ pgIntrospectionResult }, { depth: null });

  await pgIntrospector.destroy();
})();
