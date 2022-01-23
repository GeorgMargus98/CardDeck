import { Deck, DeckType } from '../types/deck';
import { db } from '../database/connection';
import { getDeck, insertDeck } from '../database/queries/deck';
import { cardValues, cardValuesShort, Suit } from '../types/card';
import { getCards, getRemainingCards, insertCardToDeck } from '../database/queries/card';
import { Knex } from 'knex';
import { MissingDeckError } from '../error/missingDeckError';

export async function createNewDeckWithCards(type: DeckType, shuffled: boolean) {
    const trx = await db.transaction();
    try {
        const deck = await insertDeck(type, shuffled, trx);
        await createCardsForDeck(deck, trx);
        await trx.commit();
        return { deck, remainingCards: await getRemainingCards(deck.id) };
    } catch (err) {
        trx.rollback();
        throw err;
    }
}

async function createCardsForDeck(deck: Deck, trx: Knex.Transaction) {
    const indices = getCardIndices(deck.type, deck.shuffled);
    await createCards(deck.id, deck.type, indices, trx);
}

function getCardIndices(type: DeckType, shuffled: boolean) {
    let indices = [...Array(type === DeckType.Full ? 52 : 32).keys()];
    if (shuffled) {
        indices = indices.sort(() => 0.5 - Math.random());
    }
    return indices;
}

async function createCards(deckId: string, type: DeckType, indices: number[], trx: Knex.Transaction) {
    let i = 0;
    for (const suit of Object.values(Suit)) {
        for (const value of type === DeckType.Full ? cardValues : cardValuesShort) {
            await insertCardToDeck(deckId, suit, value, indices[i], trx);
            i++;
        }
    }
}

export async function getDeckWithCards(deckId: string) {
    const deck = await getDeck(deckId);
    if (!deck) {
        throw new MissingDeckError();
    }
    const cards = await getCards(deck.id);
    return { deck, cards };
}