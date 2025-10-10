// types to run the functions

type DocAIEntity = {
    type?: string;
    mentionText?: string;
    normalizedValue?: {
      numberValue?: number | string | null;
      moneyValue?: { amount?: number | string | null } | null;
    } | null;
    properties?: DocAIEntity[];
  };
  
type DocAIResponse = {
  document?: { entities?: DocAIEntity[] | null } | null;
};
  
type Item = { name: string; qty: number; price: number };

type Extracted = { items: Item[] };


// main function to extract data from image
export function extractItemsFromEntities(doc: DocAIResponse):Extracted {
    const entities = doc.document?.entities ?? [];
    const output: Extracted = {items:[]};

    for (const e of entities ?? []) {
        if (!e) continue;

        if (e.type === "line_item") {
          const desc: string[] = [];
          
          let qty: number | string | null = null;
          let price: number | string | null = null;
          for (const p of e.properties ?? []) {
            if (!p) continue;

            switch (p.type) {
              case "line_item/description": {
                const s = (p.mentionText ?? "").trim();
                if (s) desc.push(s);
                break;
              }
              case "line_item/amount": {
                // Prefer normalized amount; fallback to mentionText if needed.
                price =
                  p.normalizedValue?.moneyValue?.amount ??
                  p.normalizedValue?.numberValue ??
                  (p.mentionText ?? "").trim();
                break;
              }
              case "line_item/quantity": {
                qty =
                  p.normalizedValue?.numberValue ??
                  (p.mentionText ?? "").trim()
                 break;
              }
            }

            if (desc.length > 0 && price !== null)
              qty = 1;
          }

          if(desc.length === 0) continue;
          if (price == null || qty == null) continue;
          
          const itemName = desc.join(' ');
          const itemPrice = Number(price);
          const itemQuantity = Number(qty);

          // console.log(e)
          // console.log(itemName,itemPrice,itemQuantity)

          output.items.push({
            name: itemName,
            price: itemPrice,
            qty: itemQuantity
          })
        }
    }

    return output;
}

// ---- CLI wrapper: read a file path arg and print JSON ----
if (require.main === module) {
  const fs = require("fs");
  const path = process.argv[2] || "result.json";
  const raw = fs.readFileSync(path, "utf8");
  const data = JSON.parse(raw);
  const result = extractItemsFromEntities(data);
  console.log(JSON.stringify(result, null, 2));
}