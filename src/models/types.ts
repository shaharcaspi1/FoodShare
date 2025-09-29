export type Person = {id: string; name: string};

export type Item = {id: string; name: string; price: number; quantity: number};

export type Assignment = {
    itemId: string;
    shares: Record<string, number>;
}

export type Extras = {tip: number}