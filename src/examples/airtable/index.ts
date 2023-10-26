import { AirtableIntrospector } from '../../data-sources/airtable';
import { AirtableConnectionDetails } from '../../data-sources/airtable/types';

(async () => {
  const airtableConnectionDetails: AirtableConnectionDetails = {
    // Can be apiKey or token
    auth: 'oaaha...',
  };

  const airtableIntrospector = new AirtableIntrospector();
  await airtableIntrospector.init(airtableConnectionDetails);

  const airtableIntrospectionResult = await airtableIntrospector.introspect({
    baseId: 'app...',
    tableId: 'tbl...',
  });
  console.log({ airtableIntrospectionResult });

  await airtableIntrospector.destroy();
})();
