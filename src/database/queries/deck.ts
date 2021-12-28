import {db} from "../connection";
import {Deck, DeckType} from "../../types/deck";
import {Knex} from "knex";

export async function getDeck(id: string) {
    return db<Deck>('deck').where('id', id).first();
}

export async function insertDeck(type: DeckType, shuffled: boolean, trx?: Knex.Transaction): Promise<Deck> {
    const query = db<Deck>('deck').insert({type, shuffled}).returning('*');
    if (trx) {
        query.transacting(trx);
    }
    return (await query)[0];
}