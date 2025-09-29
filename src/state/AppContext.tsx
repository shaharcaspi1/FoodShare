import React, { createContext, useContext, useState } from 'react';

type Person = {id: string; name: string};
type Item = {id: string; name: string; price: number; quantity: number};
type Assignment = {
    itemId: string;
    shares: Record<string, number>;
}

type AppState = {
    people: Person[];
    items: Item[];
    assignments: Assignment[];
    setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [people, setPeople] = useState<Person[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    return (
        <AppContext.Provider value={{ people, items, assignments, setPeople, setItems, setAssignments }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const v = useContext(AppContext);
    if (!v) throw new Error('useApp must be used within an AppProvider');
    return v;
}
