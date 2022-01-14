import { Request, Response, Router } from 'express';
import { getCards, deleteCards } from '../database/queries/card';
import { getDeck } from '../database/queries/deck';

async function drawCards (req: Request, res: Response) {
    if (req.query.count <= 0) {
        return res.status(400).send({ error: 'Invalid count' });
    }
    const count = req.query.count || 1;
    const { deckId } = req.params;
    try {
        if (!await getDeck(deckId)) {
            return res.status(404).send({ error: 'Deck not found' });
        }
        const cards = await getCards(deckId, parseInt(count.toString()));
        if (cards.length < count) {
            return res.status(400).send({ error: 'Not enough cards' });
        }
        await deleteCards(deckId, cards.map(card => card.code));
        return res.json({ cards });
    } catch (err) {
        return res.status(500).send({ error: 'Failed to draw cards' });
    }
}

const router = Router();
router.get('/:deckId', drawCards);

export default router;
