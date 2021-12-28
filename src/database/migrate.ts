import { db } from './connection';
import { cardValues, Suit } from '../types/card';

(async () => {
    try {
        await db.schema.dropTableIfExists('deck');
        await db.schema.dropTableIfExists('card_to_deck');
        await db.schema.dropTableIfExists('card');

        await db.schema.createTable('deck', (table) => {
            table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
            table.string('type', 5).notNullable();
            table.boolean('shuffled').notNullable();
        });

        await db.schema.createTable('card', (table) => {
            table.string('code', 2).primary();
            table.string('suit', 8).notNullable();
            table.string('value', 5).notNullable();
        });

        await db.schema.createTable('card_to_deck', (table) => {
            table.uuid('deck_id');
            table.string('card_code', 3).notNullable();
            table.boolean('is_drawn').notNullable().defaultTo(false);
            table.specificType('card_index', 'smallint').notNullable();
            table.foreign('card_code').references('code').inTable('card');
            table.primary(['deck_id', 'card_code']);
        });

        for (const suit of Object.values(Suit)) {
            for (const value of cardValues) {
                const code = (value === '10' ? 'T' : value[0]) + suit[0];
                await db('card').insert({ code, value, suit });
            }
        }
        console.log('Migration successful');
        process.exit(0);
    } catch (err) {
        console.log('Migration failed');
        console.log(err);
        process.exit(1);
    }
})();
