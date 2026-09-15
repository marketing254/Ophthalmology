// IndexNow submitter — run AFTER a deploy so the key file is live.
//   node indexnow.mjs
// Reads the live sitemap and submits every URL to api.indexnow.org
// (covers Bing, Yandex, Seznam, Naver in one call).
const HOST = 'www.obacademy.org';
const KEY = '4415a94909a4e0790f3164c63410ba07';

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) throw new Error('No URLs found in the live sitemap');

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
});
console.log(`Submitted ${urls.length} URLs to IndexNow — HTTP ${res.status} ${res.status === 200 || res.status === 202 ? '(accepted)' : '(check key file is live)'}`);
