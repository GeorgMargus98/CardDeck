import { Request, Response, Router } from 'express';
import { getCardsFromDeck } from '../services/card';
import { CardDeckError } from '../error/cardDeckError';
import { BadRequestError } from '../error/badRequestError';
import { isValidUuid } from '../utils/stringUtils';

async function drawCards (req: Request, res: Response) {
    try {
        validate(req);
    } catch (err) {
        return res.status(err.status).send({ error: err.message });
    }
    const count = parseInt(req.query.count.toString()) || 1;
    const { deckId } = req.params;
    try {
        const cards = await getCardsFromDeck(deckId, count);
        return res.json({ cards });
    } catch (err) {
        if (err instanceof CardDeckError) {
            return res.status(err.status).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Failed to draw cards' });
    }
}

function validate(req: Request) {
    let count = parseInt(req.query.count.toString());
    if (isNaN(count)) {
        throw new BadRequestError('Count has to be a number');
    }
    if (count <= 0) {
        throw new BadRequestError('Invalid count');
    }
    const { deckId } = req.params;
    if (!isValidUuid(deckId)) {
        throw new BadRequestError('Invalid deck ID');
    }
}

const router = Router();
router.get('/:deckId', drawCards);

export default router;
