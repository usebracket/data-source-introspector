import 'dotenv/config';
import { AirtableIntrospector } from '../../data-sources/airtable';
import { AirtableConnectionDetails } from '../../data-sources/airtable/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AIRTABLE_AUTH: string;
      AIRTABLE_TABLE_ID: string;
      AIRTABLE_BASE_ID: string;
    }
  }
}

(async () => {
  const airtableConnectionDetails: AirtableConnectionDetails = {
    // Can be apiKey or token
    auth: process.env.AIRTABLE_AUTH, // 'oaaha...',
  };

  const airtableIntrospector = new AirtableIntrospector();
  await airtableIntrospector.init(airtableConnectionDetails);

  const airtableIntrospectionResult = await airtableIntrospector.introspect({
    baseId: process.env.AIRTABLE_BASE_ID, // 'app...',
    tableId: process.env.AIRTABLE_TABLE_ID, // 'tbl...',
  });
  console.dir({ airtableIntrospectionResult }, { depth: null });

  await airtableIntrospector.destroy();
})();
