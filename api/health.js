module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({
    status: 'ok',
    service: 'DK Consultancy API',
    environment: process.env.VERCEL ? 'vercel' : 'node',
    timestamp: new Date().toISOString()
  });
};
