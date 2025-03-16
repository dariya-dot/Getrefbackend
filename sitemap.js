const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
];

const stream = new SitemapStream({ hostname: 'https://www.getreference.site' });

links.forEach(link => stream.write(link));
stream.end();

streamToPromise(stream).then(data => fs.writeFileSync('./public/sitemap.xml', data));
