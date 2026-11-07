require('./tracing');
const express = require('express');
const { trace } = require('@opentelemetry/api');
const app = express();
 
app.get('/check-stock', (req, res) => {
  const { productId } = req.query;
  const span = trace.getActiveSpan();
  if (span) span.setAttribute('product.id', productId);
  const inStock = Math.random() > 0.1;
  res.json({ productId, inStock, source: 'microservicio-inventario' });
});
 
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Microservicio de inventario escuchando en ${PORT}`));