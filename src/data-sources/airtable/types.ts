export type AirtableIntrospectionDetails = {
  tableId: string;
  baseId: string;
  introspectionDepth?: number;
};

export type AirtableConnectionDetails = {
  auth: string;
};

type AirtableFieldType = 'singleLineText' | 'email' | 'url' | 'multilineText' | 'number' | 'percent' | 'currency' | 'singleSelect' | 'multipleSelects' | 'singleCollaborator' | 'multipleCollaborators' | 'multipleRecordLinks' | 'date' | 'dateTime' | 'phoneNumber' | 'multipleAttachments' | 'checkbox' | 'formula' | 'createdTime' | 'rollup' | 'count' | 'lookup' | 'multipleLookupValues' | 'autoNumber' | 'barcode' | 'rating' | 'richText' | 'duration' | 'lastModifiedTime' | 'button' | 'createdBy' | 'lastModifiedBy' | 'externalSyncSource' | 'aiText';

export type AirtableField = {
  description?: string;
  options?: Record<string, any>
  id: string;
  name: string;
  type: AirtableFieldType;
};

type AirtableView = {
  id: string;
  type: 'grid' | 'form' | 'calendar' | 'gallery' | 'kanban' | 'timeline' | 'block';
  name: string;
  visibleFieldIds?: string[];
};

export type AirtableTable = {
  description?: string;
  fields: AirtableField[];
  id: string;
  name: string;
  primaryFieldId: string;
  views: AirtableView[];
};

export type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
  commentCount?: number;
};
