export enum DeckType {
    Full = 'FULL',
    Short = 'SHORT',
};

export type Deck = {
    id: string,
    shuffled: boolean,
    type: DeckType,
};