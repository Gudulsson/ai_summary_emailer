const Parser = require('rss-parser');
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

module.exports = fetchNews;
