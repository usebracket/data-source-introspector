## Installation

To install all of the template files, run the following script from the root of your project's directory:

```
npm i data-source-introspector
```

----

# data-source-introspector

  - **Description**:  data-source-introspector is a tool designed for introspecting (get table & fields info) for popular data sources like `Airtable`, `Postgres` and others (coming soon)

  - **Technology stack**: 
    - TS
    - NodeJS

  - **Status**:  This project in *Alpha* version.

## Dependencies

For running this project need to be installed following deps 

```
├── @types/node@20.8.7
├── @types/pg@8.10.7
├── @typescript-eslint/eslint-plugin@6.8.0
├── @typescript-eslint/parser@6.8.0
├── axios@1.5.1
├── eslint-config-airbnb-typescript@17.1.0
├── eslint-plugin-import@2.29.0
├── eslint-plugin-n@16.2.0
├── eslint-plugin-promise@6.1.1
├── eslint@8.52.0
├── nodemon@3.0.1
├── pg@8.11.3
├── ts-node@10.9.1
└── typescript@5.2.2
```

## Usage

For introspection ane data source we need to do this three common steps: 
1. Define connection details to data source: 
```
  const postgresConnectionDetails: PostgresConnectionDetails = {
    user: 'myUser',
    port: 0,
    host: 'myHost',
    password: 'myPassword',
    // ---- OR ----
    connectionString: 'myConnectionString',
  };
```
2. Create instance of data source introspector & `init()` them.
```
  const pgIntrospector = new PostgresIntrospector();
  await pgIntrospector.init(postgresConnectionDetails);
```
3. Call `introspect` method & pass introspection params
```
  const pgIntrospectionResult = await pgIntrospector.introspect({
    table: 'myTable',
    schema: 'mySchema',
    // ---- OR ----
    query: 'SELECT * FROM myTable LIMIT 1',
  });
  console.log({ pgIntrospectionResult });
```


## Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's [Issue Tracker](https://github.com/usebracket/data-source-introspector/issues/new) 

## Contributing

General instructions on _how_ to contribute to this project can be founded [here](CONTRIBUTING.md).

This repository is maintained by the [Bracket](https://www.usebracket.com/) engineering team.


----
