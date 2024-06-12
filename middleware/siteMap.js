const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const AnnouncementData = require('../model/announcementdata'); // Announcement modelinizi import edin
const ShopData = require('../model/shopdata'); // Shop modelinizi import edin
let sitemap;

const createSitemap = async (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  if (sitemap) {
    res.send(sitemap);
    return;
  }

  try {
    const smStream = new SitemapStream({ hostname: 'http://localhost:3000' });
    const pipeline = smStream.pipe(createGzip());

    // Statik URL'leri ekleyin
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/user/home-page', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/user/shop-page', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/user/announcement-page', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/auth/login', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/auth/register', changefreq: 'weekly', priority: 0.8 });

    // Dinamik URL'leri çek ve ekle
    const announcements = await AnnouncementData.find({}, 'slug').exec();
    const shops = await ShopData.find({}, 'slug').exec();

    announcements.forEach(announcement => {
      smStream.write({ url: `/user/announcement-page/${announcement.slug}`, changefreq: 'weekly', priority: 0.8 });
    });

    shops.forEach(shop => {
      smStream.write({ url: `/user/shop-page/${shop.slug}`, changefreq: 'weekly', priority: 0.8 });
    });

    smStream.end();

    streamToPromise(pipeline).then(sm => sitemap = sm);
    pipeline.pipe(res).on('error', (e) => { throw e; });

  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

module.exports = createSitemap;
