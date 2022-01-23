import {CardDeckError} from "./cardDeckError";

export class NotEnoughCardsError extends CardDeckError {
    constructor() {
        super('Not enough cards', 400);
    }
}