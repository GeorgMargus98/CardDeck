import { knex } from 'knex';

const dbConfig = {
    client: 'postgresql',
    connection: {
        host: 'db',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'postgres'
    }
};

export const db = knex(dbConfig);
