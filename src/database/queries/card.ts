import { Card, CardValue, Suit } from '../../types/card';
import { db } from '../connection';
import { Knex } from 'knex';

async function getCard (suit: Suit, value: CardValue) {
    return db('card').where({ suit, value }).first();
}

export function getCards (deckId: string, count?: number): Promise<Card[]> {
    const query = db<Card>('card')
        .join('card_to_deck AS ctd', 'card.code', '=', 'ctd.card_code')
        .where({ deck_id: deckId, is_drawn: false })
        .select('card.*')
        .orderBy('card_index');
    if (count && count > 0) {
        query.limit(count);
    }
    return query;
}

export async function markCardsAsDrawn (deckId: string, cardCodes: string[]) {
    return db('card_to_deck')
        .where({ deck_id: deckId, is_drawn: false })
        .whereIn('card_code', cardCodes)
        .update({ is_drawn: true })
        .returning('*');
}

export async function getRemainingCards (deckId: string) {
    return (await db('card_to_deck')
        .where({ deck_id: deckId, is_drawn: false })
        .count({ count: '*' }))[0].count;
}

export async function insertCardToDeck (deckId: string, suit: Suit, value: CardValue, cardIndex: number, trx?: Knex.Transaction) {
    const card = await getCard(suit, value);
    const query = db('card_to_deck')
        .insert({ deck_id: deckId, card_code: card.code, card_index: cardIndex });
    if (trx) {
        query.transacting(trx);
    }
    return query;
}
