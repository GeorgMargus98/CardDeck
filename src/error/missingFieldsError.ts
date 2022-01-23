import { CardDeckError } from './cardDeckError';

export class MissingFieldsError extends CardDeckError {
    message: string;
    status: number;

    constructor(message: string) {
        super(message, 422);
        this.message = message;
    }
}