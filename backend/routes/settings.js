const express = require('express');
const router = express.Router();

let settings = {
  provider: 'brapi',
  failover: true,
  logs: false,
  providers: [
    { id: 'yahoo', name: 'Yahoo Finance', plan: 'Free Tier', active: false, latency: 120, delay: '15 min' },
    { id: 'brapi', name: 'Brapi', plan: 'Premium', active: true, latency: 95, delay: 'Tempo Real' },
    { id: 'hgbrasil', name: 'HG Brasil', plan: 'API Key', active: false, apiKey: '' }
  ]
};

router.get('/', (req, res) => {
  res.json({ success: true, data: settings });
});

router.post('/', (req, res) => {
  const { provider, failover, logs, apiKey } = req.body || {};
  if (provider !== undefined) settings.provider = provider;
  if (failover !== undefined) settings.failover = failover;
  if (logs !== undefined) settings.logs = logs;
  if (apiKey !== undefined) {
    const p = settings.providers.find(x => x.id === 'hgbrasil');
    if (p) p.apiKey = apiKey;
  }
  res.json({ success: true, data: settings });
});

module.exports = router;
