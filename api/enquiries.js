const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
const DATA_FILE = isVercel
  ? path.join('/tmp', 'enquiries.json')
  : path.join(__dirname, '..', 'data', 'enquiries.json');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let list = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    }
  } catch (e) {
    list = [];
  }

  return res.status(200).json(list);
};

