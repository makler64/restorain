const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async function() {
  try {
    const url = 'https://www.vl.ru/afisha/vladivostok';
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    let events = [];

    $('[itemtype="http://schema.org/Event"]').each((i, el) => {
      let title = $(el).find('[itemprop="name"]').text().trim();
      let date = $(el).find('[itemprop="startDate"]').attr('content') || '';
      let location = $(el).find('[itemprop="location"] [itemprop="name"]').text().trim();
      events.push({title, date, location});
    });

    return {statusCode:200, body: JSON.stringify({events})};
  } catch(e){
    return {statusCode:500, body: JSON.stringify({error: e.toString()})};
  }
};
