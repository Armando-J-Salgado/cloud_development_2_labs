require('./tracing');
const express = require('express');
const { trace } = require('@opentelemetry/api');
const app = express();
app.use(express.json());
 
function checkStockMonolith(productId) {
  return Math.random() > 0.1;
}
 
function processPaymentMonolith(orderId, amount) {
  return Math.random() > 0.05;
}
 
app.post('/checkout', (req, res) => {
  const { orderId, productId, amount } = req.body;

  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute('order.id', orderId);
    span.setAttribute('product.id', productId);
    span.setAttribute('order.amount', amount);
  }

  if (!checkStockMonolith(productId)) {
    return res.status(409).json({ success: false, reason: 'sin stock', source: 'monolito' });
  }
  if (!processPaymentMonolith(orderId, amount)) {
    return res.status(402).json({ success: false, reason: 'pago rechazado', source: 'monolito' });
  }
  return res.status(201).json({ success: true, orderId, source: 'monolito' });
});
 
app.post('/checkout-payment-only', (req, res) => {
  const { orderId, amount } = req.body;

  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute('order.id', orderId);
    span.setAttribute('order.amount', amount);
  }

  if (!processPaymentMonolith(orderId, amount)) {
    return res.status(402).json({ success: false, reason: 'pago rechazado', source: 'monolito (solo pago)' });
  }
  return res.status(201).json({ success: true, orderId, source: 'monolito (solo pago)' });
});
 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Monolito escuchando en ${PORT}`));
