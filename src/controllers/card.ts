import { Request, Response, Router } from 'express';
import { getCards, deleteCards } from '../database/queries/card';
import { getDeck } from '../database/queries/deck';

async function drawCards (req: Request, res: Response) {
    let count = parseInt(req.query.count.toString());
    if (typeof count !== 'number' || count <= 0) {
        return res.status(400).send({ error: 'Invalid count' });
    }
    count = count || 1;
    if (!(typeof count === 'number')) {
        return res.status(400).send({ error: 'Count has to be a number' });
    }
    const { deckId } = req.params;
    try {
        if (!await getDeck(deckId)) {
            return res.status(404).send({ error: 'Deck not found' });
        }
        const cards = await getCards(deckId, count);
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
