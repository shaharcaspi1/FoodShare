import { Constants } from "expo-constants";


export type ReceiptExtractResponse = { items: { name: string; qty: number; price: number }[] };
export type ApiError = { error: { code: string; message: string } };

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || process.env.API_BASE;

export default async function uploadReceipt(uri:string): Promise<ReceiptExtractResponse> {
    // Best-effort filename & mime
    const name = (uri.split('/').pop() ?? 'receipt').replace(/\?.*$/, '');
    const lower = name.toLowerCase();
    const type =
        lower.endsWith('.png') ? 'image/png' :
        lower.endsWith('.heic') || lower.endsWith('.heif') ? 'image/heic' :
        lower.endsWith('.webp') ? 'image/webp' :
        'image/jpeg';

    const safeName = /\.[a-z0-9]+$/i.test(name) ? name : `${name}.jpg`;
    const file: any = { uri, name: safeName, type };

    const fd = new FormData();
    fd.append('file', file);

    const result = await fetch(`${API_BASE}/api/receipt/extract`, {
        method: 'POST',
        body: fd,
    });

    const text = await result.text();
    let json: any = null;
    try {json = text ? JSON.parse(text) : null; } catch {};

    if (!result.ok){
        const msg = json?.error?.message || text || `HTTP ${result.status}`;
        throw new Error(`Upload/Parse failed: ${msg}`);
    }
    if (!json || !('items' in json)) throw new Error('Bad server response (missing items)');
    return json as ReceiptExtractResponse;
}