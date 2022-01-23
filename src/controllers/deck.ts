import { Request, Response, Router } from 'express';
import { DeckType } from '../types/deck';
import { createNewDeckWithCards, getDeckWithCards } from '../services/deck';
import { MissingFieldsError } from '../error/missingFieldsError';
import { CardDeckError } from '../error/cardDeckError';

async function createDeck (req: Request<{}, {}, { type: DeckType, shuffled: boolean }>, res: Response) {
    const { type, shuffled } = req.body;
    try {
        validateCreateDeck(type, shuffled);
    } catch (err) {
        return res.status(err.status).send({ error: err.message });
    }
    try {
        const { deck, remainingCards } = await createNewDeckWithCards(type, shuffled);
        return res.json({
            deckId: deck.id,
            type: deck.type,
            shuffled: deck.shuffled,
            remaining: remainingCards,
        });
    } catch (err) {
        if (err instanceof CardDeckError) {
            return res.status(err.status).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Failed to create deck' });
    }
}

function validateCreateDeck(type: DeckType, shuffled: boolean) {
    if (!(type && shuffled)) {
        throw new MissingFieldsError('Type and shuffled are required');
    }
}

async function openDeck (req: Request<{id: string}, {}, {}>, res: Response) {
    const { id } = req.params;
    try {
        const { deck, cards } = await getDeckWithCards(id);
        res.json({
            deckId: deck.id,
            type: deck.type,
            shuffled: deck.shuffled,
            remaining: cards.length,
            cards
        });
    } catch (err) {
        if (err instanceof CardDeckError) {
            return res.status(err.status).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Failed to open deck' });
    }
}

const router = Router();
router.get('/:id', openDeck);
router.post('/', createDeck);

export default router;
