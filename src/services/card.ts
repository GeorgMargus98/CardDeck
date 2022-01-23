import {getDeck} from "../database/queries/deck";
import {deleteCards, getCards} from "../database/queries/card";
import {MissingDeckError} from "../error/missingDeckError";
import {NotEnoughCardsError} from "../error/notEnoughCardsError";

export async function getCardsFromDeck(deckId: string, count: number) {
    if (!await getDeck(deckId)) {
        throw new MissingDeckError();
    }
    const cards = await getCards(deckId, count);
    if (cards.length < count) {
        throw new NotEnoughCardsError();
    }
    await deleteCards(deckId, cards.map(card => card.code));
    return cards;
}