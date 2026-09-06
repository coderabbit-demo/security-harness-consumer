import { fetchQuote, PriceQuote } from "./client";

export interface Cart {
  subtotalCents: number;
  itemCount: number;
}

export interface CheckoutSummary {
  lineSubtotalCents: number;
  amountDueCents: number;
}

// Reads the upstream pricing contract. Both `subtotalCents` and `totalCents` are
// required fields on the PriceQuote returned by security-harness's
// POST /api/pricing/quote. A rename or retype of either field upstream breaks these
// call sites.
export async function buildCheckoutSummary(cart: Cart): Promise<CheckoutSummary> {
  const quote: PriceQuote = await fetchQuote({
    subtotalCents: cart.subtotalCents,
    itemCount: cart.itemCount,
  });

  return {
    lineSubtotalCents: quote.subtotalCents,
    amountDueCents: quote.totalCents,
  };
}

// Flat convenience fee added when a shopper picks express (same-day) checkout.
const EXPRESS_HANDLING_FEE_CENTS = 500;

// Express checkout: same as buildCheckoutSummary, but adds a flat same-day
// handling fee on top of the upstream total.
export async function buildExpressCheckoutSummary(cart: Cart): Promise<CheckoutSummary> {
  const quote: PriceQuote = await fetchQuote({
    subtotalCents: cart.subtotalCents,
    itemCount: cart.itemCount,
  });

  return {
    lineSubtotalCents: quote.subtotalCents,
    amountDueCents: quote.totalCents + EXPRESS_HANDLING_FEE_CENTS,
  };
}

// Display helper: money is integer cents everywhere; format only at the boundary.
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
