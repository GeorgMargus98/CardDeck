export enum Suit {
    Clubs = 'CLUBS',
    Spades = 'SPADES',
    Diamonds = 'DIAMONDS',
    Hearts = 'HEARTS',
}

export const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'] as const;
export const cardValuesShort = ['7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'] as const;

export type CardValue = typeof cardValues[number];

export type Card = {
    code: string,
    suit: Suit,
    value: typeof cardValues[number],
}
