import React, { createContext, useContext, useState } from 'react';

type Person = {id: string; name: string};
type Item = {id: string; name: string; price: number; quantity: number};

type AppState = {
    people: Person[];
    items: Item[];
    setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [people, setPeople] = useState<Person[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    return (
        <AppContext.Provider value={{ people, items, setPeople, setItems }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const v = useContext(AppContext);
    if (!v) throw new Error('useApp must be used within an AppProvider');
    return v;
}
