import {CardDeckError} from "./cardDeckError";

export class BadRequestError extends CardDeckError {
    message: string;
    status: number;

    constructor(message: string) {
        super(message, 400);
        this.message = message;
    }
}