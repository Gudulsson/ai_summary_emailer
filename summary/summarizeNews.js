const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeNews(categorizedNews) {
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
          color: #64b5f6;
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

module.exports = summarizeNews;
