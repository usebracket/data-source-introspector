import { AxiosInstance } from 'axios';
import { Client as PostgresClient } from 'pg';
import { AirtableConnectionDetails, AirtableIntrospectionDetails } from './airtable/types';
import { PostgresConnectionDetails, PostgresIntrospectionDetails } from './postgres/types';

export type DataSourceConnectionDetails = AirtableConnectionDetails
| PostgresConnectionDetails;
export type DataSourceClient = PostgresClient
| AxiosInstance;
export type DataSourceIntrospectDetails = AirtableIntrospectionDetails
| PostgresIntrospectionDetails;
