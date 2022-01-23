import {CardDeckError} from "./cardDeckError";

export class MissingDeckError extends CardDeckError {
    constructor() {
        super('Deck not found', 404);
    }
}