// HTTP client for the upstream security-harness pricing API.
//
// The shape below mirrors the contract that security-harness's
// POST /api/pricing/quote returns. These field names are load-bearing: this repo
// depends on `subtotalCents` and `totalCents`. If the upstream service renames or
// retypes them, the call sites in checkout.ts break.

export interface PriceQuote {
  subtotalCents: number;
  itemCount: number;
  totalCents: number;
}

export interface QuoteRequest {
  subtotalCents: number;
  itemCount: number;
}

const SERVICE_URL = process.env.PRICING_SERVICE_URL ?? "http://security-harness.internal";

export async function fetchQuote(req: QuoteRequest): Promise<PriceQuote> {
  const res = await fetch(`${SERVICE_URL}/api/pricing/quote`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req),
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) {
    throw new Error(`pricing quote failed: ${res.status}`);
  }
  return (await res.json()) as PriceQuote;
}
