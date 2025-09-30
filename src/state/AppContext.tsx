import React, { createContext, useContext, useState } from 'react';
import { Person,Assignment, Extras,Item } from '../models/types';

// create type for appState for context across the app
type AppState = {
    people: Person[];
    items: Item[];
    assignments: Assignment[];
    tip: Extras;
    setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
    setTip: React.Dispatch<React.SetStateAction<Extras>>;
}

// variable for using AppContext
const AppContext = createContext<AppState | null>(null);

// export useState functions for the global variables
export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [people, setPeople] = useState<Person[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [tip, setTip] = useState<Extras>('');
    return (
        <AppContext.Provider value={{ people, items, assignments, tip, setPeople, setItems, setAssignments, setTip }}>
            {children}
        </AppContext.Provider>
    );
}

// export useApp to use global variables
export const useApp = () => {
    const v = useContext(AppContext);
    if (!v) throw new Error('useApp must be used within an AppProvider');
    return v;
}
