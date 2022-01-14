import { getDeck, insertDeck } from '../database/queries/deck';
import { Request, Response, Router } from 'express';
import { DeckType } from '../types/deck';
import { cardValues, cardValuesShort, Suit } from '../types/card';
import { getCards, getRemainingCards, insertCardToDeck } from '../database/queries/card';
import { db } from '../database/connection';

async function createDeck (req: Request<{}, {}, { type: DeckType, shuffled: boolean }>, res: Response) {
    const { type, shuffled } = req.body;
    if (!(type && shuffled)) {
        return res.status(422).send({ error: 'Type and shuffled are required' });
    }
    const trx = await db.transaction();
    try {
        const deck = await insertDeck(type, shuffled, trx);
        let indices = [...Array(type === DeckType.Full ? 52 : 32).keys()];
        if (shuffled) {
            indices = indices
                .map(idx => ({ idx, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ idx }) => idx);
        }
        let i = 0;
        for (const suit of Object.values(Suit)) {
            for (const value of type === DeckType.Full ? cardValues : cardValuesShort) {
                await insertCardToDeck(deck.id, suit, value, indices[i], trx);
                i++;
            }
        }
        await trx.commit();
        return res.json({
            deckId: deck.id,
            type: deck.type,
            shuffled: deck.shuffled,
            remaining: await getRemainingCards(deck.id)
        });
    } catch (err) {
        trx.rollback();
        return res.status(500).send({ error: 'Failed to create deck' });
    }
}

async function openDeck (req: Request<{id: string}, {}, {}>, res: Response) {
    const { id } = req.params;
    try {
        const deck = await getDeck(id);
        if (!deck) {
            return res.status(404).send({ error: 'Deck not found' });
        }
        const cards = await getCards(deck.id);
        res.json({
            deckId: deck.id,
            type: deck.type,
            shuffled: deck.shuffled,
            remaining: cards.length,
            cards
        });
    } catch (err) {
        return res.status(500).send({ error: 'Failed to open deck' });
    }
}

const router = Router();
router.get('/:id', openDeck);
router.post('/', createDeck);

export default router;
