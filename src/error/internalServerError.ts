import { CardDeckError } from './cardDeckError';

export class InternalServerError extends CardDeckError {
    message: string;
    status: number;

    constructor(message: string) {
        super(message, 500);
        this.message = message;
    }
}