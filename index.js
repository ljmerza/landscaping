const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const sideFence = [
	'https://www.fast-growing-trees.com/products/black-mondo-grass',
	'https://www.fast-growing-trees.com/products/sunshine-ligustrum-shrub',
	'https://www.fast-growing-trees.com/products/orange-rocket-barberry-shrub',
	'https://www.fast-growing-trees.com/products/crimson-fire-loropetalum',
	'https://www.fast-growing-trees.com/products/ruby-loropetalum',
	'https://www.fast-growing-trees.com/products/purple-diamond-loropetalum',
	'https://www.fast-growing-trees.com/products/golden-euonymus-shrub',
	'https://www.fast-growing-trees.com/products/emerald-n-gold-wintercreeper',
	'https://www.fast-growing-trees.com/products/green-velvet-boxwood',
	'https://www.fast-growing-trees.com/products/fire-power-nandina-shrub',
	'https://www.fast-growing-trees.com/products/variegated-boxwood-shrub',
	'https://www.fast-growing-trees.com/products/apollo-winterberry-holly',
  'https://www.fast-growing-trees.com/products/crimson-pygmy-barberry',
  'https://www.fast-growing-trees.com/products/forsythia',
  'https://www.fast-growing-trees.com/products/enduring-summer-crape-myrtle',
  'https://www.fast-growing-trees.com/products/hopi-crape-myrtle-tree',
  'https://www.fast-growing-trees.com/products/tonto-crape-myrtle'
]

const backFence = [
  'https://www.fast-growing-trees.com/products/baby-giant-arborvitae',
  'https://www.fast-growing-trees.com/products/berckmans-gold-arborvitae',
  'https://www.fast-growing-trees.com/products/emerald-green-arborvitae',
]

const trees = [

]


async function scrapeData() {
  const scrapedData = [];

  for await(const url of sideFence) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // remove child text before adding parent text
    const title = $('h1.product__title').children().remove().end().text();
    const price = $('.product__price').text();

    const product = {
      title,
      price,
    }

    $('.details__table > tbody > tr').each((i , row) => {

      // erach row is split by a colon (easy way to split by column)
      const rowText= $(row).text().replace(/\s\s+/g, '');
      const [key, value] = rowText.split(':');

      // dont add these columns
      if(!['Does Not Ship To', 'Your Growing Zone', 'Grows Well In Zones', 'Botanical Name'].includes(key)) {
        product[key] = value;
      }
    });

    // put url last so we see it at end of table
    product.url = url;
    scrapedData.push(product);
  }

  console.table(scrapedData);

  fs.writeFile("scraped_data.json", JSON.stringify(scrapedData, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Successfully written data to file");
  });
}

scrapeData();