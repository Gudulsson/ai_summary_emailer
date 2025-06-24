<<<<<<< HEAD
// morning_report_ai/index.js
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const OpenAI = require('openai');
const nodemailer = require('nodemailer');
const Parser = require('rss-parser');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const parser = new Parser();

const categorizedFeeds = {
  '🌍 Världsnyheter': [
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://www.aljazeera.com/xml/rss/all.xml'
  ],
  '💼 Affärer': [
    'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml',
    'https://www.investing.com/rss/news_25.rss'
  ],
  '📈 Börs': [
    'https://www.marketwatch.com/rss/topstories',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://www.ft.com/?format=rss'
  ],
  '🧠 Teknik': [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/rss'
  ],
  '🪙 Krypto': [
    'https://cointelegraph.com/rss',
    'https://cryptopotato.com/feed/',
    'https://decrypt.co/feed'
  ],
  '🐦 X-poster': [
    'https://nitter.privacydev.net/naval/rss',
    'https://nitter.privacydev.net/elonmusk/rss',
    'https://nitter.privacydev.net/worldnews/rss'
  ]
};

async function fetchNews() {
  const categorizedNews = {};

  for (const [category, feeds] of Object.entries(categorizedFeeds)) {
    categorizedNews[category] = [];

    for (const feed of feeds) {
      try {
        const data = await parser.parseURL(feed);
        const top = data.items.slice(0, 2);
        categorizedNews[category].push(...top.map(item => ({
          title: item.title,
          link: item.link,
          snippet: item.contentSnippet || ''
        })));
      } catch (e) {
        console.warn('⚠️ Kunde inte läsa RSS:', feed);
      }
    }
  }

  return categorizedNews;
}

async function summarize(categorizedNews) {
  const sectionPromises = Object.entries(categorizedNews).map(async ([category, items]) => {
    if (!Array.isArray(items) || items.length === 0) return '';

    const newsBlock = items.map(item => `Titel: ${item.title}\nLänk: ${item.link}\nSammanfattning: ${item.snippet}`).join('\n\n');

    const prompt = `Sammanfatta följande nyheter under kategorin ${category} på svenska.
Skapa HTML-liknande punktlista med:
- En klickbar titel i blå och fet stil
- En sammanfattning på svenska (2 meningar)
- En mening som förklarar varför detta är viktigt.

Nyheter:
${newsBlock}`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    });

    return `
    <div class="section">
      <h2>${category}</h2>
      ${chat.choices[0].message.content.trim()}
    </div>`;
  });

  const htmlSections = (await Promise.all(sectionPromises)).join('\n');

  const fullHtml = `
  <html>
    <head>
      <style>
        body {
          font-family: sans-serif;
          background: #121212;
          padding: 20px;
          color: #e0e0e0;
          max-width: 700px;
          margin: auto;
        }
        .section {
          background: #1e1e1e;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        h1 {
          text-align: center;
          color: #000000;
        }
        h2 {
          font-size: 26px;
          color: #ffffff;
        }
        li {
          font-size: 20px;
          margin-bottom: 15px;
          color: #cccccc;
        }
        a {
          font-weight: bold;
          color: #90caf9;
          font-size: 22px;
          text-decoration: none;
        }
        .logo {
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #000000;
        }
      </style>
    </head>
    <body>
      <div class="logo">📰 Schonbeck Newspaper</div>
      <p style="text-align:center; color: #000000;">Publicerad: ${new Date().toLocaleDateString('sv-SE')}</p>
      ${htmlSections}
      <hr />
      <p style="text-align:center; color: #888;">Skickat: ${new Date().toLocaleDateString('sv-SE')}</p>
    </body>
  </html>
  `;

  return fullHtml;
}

async function sendEmail(subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
}

(async () => {
  console.log('🌐 Hämtar nyheter och X...');
  const categorizedNews = await fetchNews();

  console.log('🧠 Genererar HTML-rapport på svenska...');
  const html = await summarize(categorizedNews);

  console.log('📧 Skickar e-post...');
  await sendEmail('🗞️ Schonbeck Newspaper – Morgonrapport', html);

  console.log('✅ Klart!');
})();
=======
// morning_report_ai/index.js
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const OpenAI = require('openai');
const nodemailer = require('nodemailer');
const Parser = require('rss-parser');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const parser = new Parser();

const categorizedFeeds = {
  '🌍 Världsnyheter': [
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://www.aljazeera.com/xml/rss/all.xml'
  ],
  '💼 Affärer': [
    'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml',
    'https://www.investing.com/rss/news_25.rss'
  ],
  '📈 Börs': [
    'https://www.marketwatch.com/rss/topstories',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://www.ft.com/?format=rss'
  ],
  '🧠 Teknik': [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/rss'
  ],
  '🪙 Krypto': [
    'https://cointelegraph.com/rss',
    'https://cryptopotato.com/feed/',
    'https://decrypt.co/feed'
  ],
  '🐦 X-poster': [
    'https://nitter.privacydev.net/naval/rss',
    'https://nitter.privacydev.net/elonmusk/rss',
    'https://nitter.privacydev.net/worldnews/rss'
  ]
};

async function fetchNews() {
  const categorizedNews = {};

  for (const [category, feeds] of Object.entries(categorizedFeeds)) {
    categorizedNews[category] = [];

    for (const feed of feeds) {
      try {
        const data = await parser.parseURL(feed);
        const top = data.items.slice(0, 2);
        categorizedNews[category].push(...top.map(item => ({
          title: item.title,
          link: item.link,
          snippet: item.contentSnippet || ''
        })));
      } catch (e) {
        console.warn('⚠️ Kunde inte läsa RSS:', feed);
      }
    }
  }

  return categorizedNews;
}

async function summarize(categorizedNews) {
  const sectionPromises = Object.entries(categorizedNews).map(async ([category, items]) => {
    if (!Array.isArray(items) || items.length === 0) return '';

    const newsBlock = items.map(item => `Titel: ${item.title}\nLänk: ${item.link}\nSammanfattning: ${item.snippet}`).join('\n\n');

    const prompt = `Sammanfatta följande nyheter under kategorin ${category} på svenska.
Skapa HTML-liknande punktlista med:
- En klickbar titel i blå och fet stil
- En sammanfattning på svenska (2 meningar)
- En mening som förklarar varför detta är viktigt.

Nyheter:
${newsBlock}`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    });

    return `
    <div class="section">
      <h2>${category}</h2>
      ${chat.choices[0].message.content.trim()}
    </div>`;
  });

  const htmlSections = (await Promise.all(sectionPromises)).join('\n');

  const fullHtml = `
  <html>
    <head>
      <style>
        body {
          font-family: sans-serif;
          background: #121212;
          padding: 20px;
          color: #e0e0e0;
          max-width: 700px;
          margin: auto;
        }
        .section {
          background: #1e1e1e;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        h1 {
          text-align: center;
          color: #000000;
        }
        h2 {
          font-size: 26px;
          color: #ffffff;
        }
        li {
          font-size: 20px;
          margin-bottom: 15px;
          color: #cccccc;
        }
        a {
          font-weight: bold;
          color: #90caf9;
          font-size: 22px;
          text-decoration: none;
        }
        .logo {
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #000000;
        }
      </style>
    </head>
    <body>
      <div class="logo">📰 Schonbeck Newspaper</div>
      <p style="text-align:center; color: #000000;">Publicerad: ${new Date().toLocaleDateString('sv-SE')}</p>
      ${htmlSections}
      <hr />
      <p style="text-align:center; color: #888;">Skickat: ${new Date().toLocaleDateString('sv-SE')}</p>
    </body>
  </html>
  `;

  return fullHtml;
}

async function sendEmail(subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
}

(async () => {
  console.log('🌐 Hämtar nyheter och X...');
  const categorizedNews = await fetchNews();

  console.log('🧠 Genererar HTML-rapport på svenska...');
  const html = await summarize(categorizedNews);

  console.log('📧 Skickar e-post...');
  await sendEmail('🗞️ Schonbeck Newspaper – Morgonrapport', html);

  console.log('✅ Klart!');
})();
>>>>>>> 21dd0a3 (first commit)
