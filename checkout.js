// Facebook/Instagram Commerce "checkout URL" endpoint.
// Meta calls this as: https://pivhq.com/api/checkout?products=<CATALOG_ID>:<QTY>&coupon=<CODE>
// It maps the catalog product ID to the matching Stripe Payment Link and redirects there.

const PRODUCT_MAP = {
  'avp1dm4a0j': 'https://buy.stripe.com/28E3cvfBsdC8ab16Qn0co06', // F-91
  '66v4swecp0': 'https://buy.stripe.com/4gM8wP3SKfKg0ArcaH0co07', // CA-53W
  '3xk3y5jntp': 'https://buy.stripe.com/7sYcN51KC2Xuerh7Ur0co04', // Band 18mm
  'nggncwj162': 'https://buy.stripe.com/7sYdR99d4eGc4QH0rZ0co03', // Band 20mm
};

const FALLBACK_URL = 'https://pivhq.com/#checkout';

module.exports = (req, res) => {
  const productsParam = req.query.products || '';

  // products can be "id1:qty1,id2:qty2" — we only support single-item checkout today,
  // since each product is its own fixed-price Stripe Payment Link (no combined cart yet).
  const firstEntry = productsParam.split(',')[0] || '';
  const catalogId = firstEntry.split(':')[0];

  const stripeUrl = PRODUCT_MAP[catalogId];

  if (stripeUrl) {
    res.writeHead(302, { Location: stripeUrl });
    res.end();
    return;
  }

  // Unknown or missing product ID — send them to the homepage checkout instead of a dead end.
  res.writeHead(302, { Location: FALLBACK_URL });
  res.end();
};
