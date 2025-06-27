import { SitemapStream, streamToPromise } from 'sitemap';
import fs from 'fs';

async function generate() {
  const sitemap = new SitemapStream({ hostname: 'https://www.nugra.my.id' });

  sitemap.write({ url: '/', changefreq: 'monthly' });
  sitemap.write({ url: '/about' });
  sitemap.write({ url: '/contact' });
  sitemap.write({ url: '/portfolio' });
  sitemap.end();

  const sm = await streamToPromise(sitemap);
  fs.writeFileSync('public/sitemap.xml', sm);
  console.log('✅ sitemap.xml generated in /public');
}

generate();
