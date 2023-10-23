import { PostgresIntrospector } from '../../data-sources/postgres';
import { PostgresConnectionDetails } from '../../data-sources/postgres/types';

(async () => {
  const postgresConnectionDetails: PostgresConnectionDetails = {
    user: 'myUser',
    port: 0,
    host: 'myHost',
    password: 'myPassword',
    // ---- OR ----
    connectionString: 'myConnectionString',
  };
  const pgIntrospector = new PostgresIntrospector();
  await pgIntrospector.init(postgresConnectionDetails);

  const pgIntrospectionResult = await pgIntrospector.introspect({
    table: 'myTable',
    schema: 'mySchema',
    // ---- OR ----
    query: 'SELECT * FROM myTable LIMIT 1',
  });
  console.log({ pgIntrospectionResult });

  await pgIntrospector.destroy();
})();
