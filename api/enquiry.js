const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
const DATA_FILE = isVercel
  ? path.join('/tmp', 'enquiries.json')
  : path.join(__dirname, '..', 'data', 'enquiries.json');

module.exports = (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse body if not already parsed by Vercel helper
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const enquiry = body || {};
  if (!enquiry.name || !enquiry.phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  let list = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    }
  } catch (e) {
    list = [];
  }

  list.unshift(enquiry);

  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.warn('File persist note:', err.message);
  }

  return res.status(201).json({
    success: true,
    id: enquiry.id || 'DK-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    message: 'Enquiry received successfully'
  });
};
