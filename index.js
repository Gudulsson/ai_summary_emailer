// index.js
require('dotenv').config();

const fetchNews = require('./summary/fetchNews');
const summarizeNews = require('./summary/summarizeNews');
const sendEmail = require('./email/sendEmail');

(async () => {
  const categorizedNews = await fetchNews();
  const html = await summarizeNews(categorizedNews);
  await sendEmail('🗞️ Schonbeck Newspaper – Morgonrapport', html);
})();
