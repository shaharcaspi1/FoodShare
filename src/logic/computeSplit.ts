import { Person,Assignment,Extras,Item } from '../models/types';

// function to compute split
// input: people[], items[], assignments[]
// output: record<personId, total> (function like dictionary)
export function computeSplit(peopleList: Person[], items:Item[], assignments:Assignment[]):
Record<string,number> {
    // create list of people ids
    const ids = peopleList.map(p => p.id);

    // create Record with ids, initialize with 0
    let totals: Record<string,number> = Object.fromEntries(ids.map(id => [id,0]));

    // for loop, run on all the assignments by itemId
    for (const a of assignments || []){
        const currentItem = items.find(item => item.id === a.itemId);

        // check for itemId in assignments list
        if (!currentItem){
            console.warn('item with id ${a.itemId} not found');
            continue;
        }

        // calculate each sharing part
        const price = currentItem.price;
        const peopleAmount = Object.keys(a.shares).length;

        const priceForEach = price / peopleAmount;

        // add the priceForEach for each one sharing
        for (const personId of Object.keys(a.shares)){
            totals[personId] = totals[personId] + priceForEach;
        }
    }

    return totals;
}
