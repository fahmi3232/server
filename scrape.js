// scrape.js
const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk melakukan scraping
async function scrapeArticle(url) {
  try {
    // Mengambil HTML dari URL
    const { data } = await axios.get(url);
    
    // Memuat HTML ke cheerio
    const $ = cheerio.load(data);


    // Ganti <div class="paradetail"> dengan <br />
    $('div.paradetail').replaceWith('<br>');
    // $('table.linksisip').replaceWith('<br>')

    // Mengambil konten artikel dan menambahkan <p> di sekitar paragraf
    const content = $('.detail-text p').map((i, el) => `<p>${$(el).html()}</p>`).get().join('<br>'); // Tambahkan <p> di sekitar setiap paragraf



    const date = $('div.text-cnn_grey.text-sm').text().trim();

    // Mengambil gambar dari elemen dengan kelas detail-image
    // Contoh menambahkan atribut loading="lazy" dengan cheerio
    const imageUrls = $('.detail-image img').map((i, el) => {
      $(el).attr('loading', 'lazy'); // Menambahkan atribut loading
      return $(el).attr('src');
    }).get();



    // const relatedLinks = $('div.flex.flex-wrap.gap-3 a').map((i, el) => $(el).prop('outerHTML')).get().join('<br>');
    const relatedLinks = $('div.flex.flex-wrap.gap-3 a').map((i, el) => {
      const text = $(el).text().trim();
      const path = $(el).attr('href');
      const linkPath = new URL(path).pathname.split('/').pop(); // Get the tag path
      return `<a href="/tag/${linkPath}">${text}</a>`;
    }).get().join('<br>');

    
    return {
      title: $('h1').text(), // Ambil judul jika ada elemen <h1>
      content,
      images: imageUrls,
      date,
      relatedLinks
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Ekspor fungsi untuk digunakan di file lain
module.exports = scrapeArticle;
