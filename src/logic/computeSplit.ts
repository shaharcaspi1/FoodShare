import { Person,Assignment,Extras,Item } from '../models/types';


export function computeSplit(peopleList: Person[], items:Item[], assignments:Assignment[]):
Record<string,number> {
    const ids = peopleList.map(p => p.id);
    const idSet = new Set(ids);

    let totals: Record<string,number> = Object.fromEntries(ids.map(id => [id,0]));

    for (const a of assignments || []){
        const currentItem = items.find(item => item.id === a.itemId);

        if (!currentItem){
            console.warn('item with id ${a.itemId} not found');
            continue;
        }
        const price = currentItem.price;
        const peopleAmount = Object.keys(a.shares).length;

        const priceForEach = price / peopleAmount;

        for (const personId of Object.keys(a.shares)){
            totals[personId] = totals[personId] + priceForEach;
        }
    }

    return totals;
}
