// define types for global variables
export type Person = {
    id: string; 
    name: string
}

export type Item = {
    id: string; 
    name: string; 
    price: number; 
    quantity: number
}

export type Assignment = {
    itemId: string;
    shares: Record<string, true>;
}

export type Extras = string