import {Request, Response, Router} from "express";
import {getCards, markCardsAsDrawn} from "../database/queries/card";
import {getDeck} from "../database/queries/deck";

async function drawCards(req: Request, res: Response) {
    const { deckId } = req.params;
    try {
        if (!await getDeck(deckId)) {
            return res.status(400).send({error: 'Deck not found!'});
        }
        const count = req.query.count || 1;
        const cards = await getCards(deckId, parseInt(count.toString()));
        await markCardsAsDrawn(deckId, cards.map(card => card.code));
        return res.json({cards});
    } catch (err) {
        return res.status(500).send({ error: 'Failed to draw cards' });
    }
}

const router = Router();
router.get('/draw/:deckId', drawCards);

export default router;
