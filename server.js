const express = require('express');
const fetch = require('node-fetch');
const { formatDistanceToNow } = require('date-fns');
const { id } = require('date-fns/locale');

const scrapeArticle = require('./scrape');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../frontend')));



// Endpoint untuk get API dan menampilkan date seperti "30 menit yang lalu"
app.get('/api/news/internasional', async (req, res) => {
  try {
    const response = await fetch('https://api-berita-indonesia.vercel.app/cnn/internasional/');
    const data = await response.json();

    const newsWithRelativeTime = data.data.posts.map(item => {
      const pubDate = new Date(item.pubDate);
      const relativeTime = formatDistanceToNow(pubDate, { addSuffix: true, locale: id });
      return { ...item, relativeTime };
    });

    res.json({ posts: newsWithRelativeTime });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).send('Error fetching news');
  }
});

app.get('/api/news/olahraga', async (req, res) => {
  try {
    const response = await fetch('https://api-berita-indonesia.vercel.app/cnn/olahraga/');
    const data = await response.json();

    const newsWithRelativeTime = data.data.posts.map(item => {
      const pubDate = new Date(item.pubDate);
      const relativeTime = formatDistanceToNow(pubDate, { addSuffix: true, locale: id });
      return { ...item, relativeTime };
    });

    res.json({ posts: newsWithRelativeTime });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).send('Error fetching news');
  }
});

app.get('/api/news/gayaHidup', async (req, res) => {
  try {
    const response = await fetch('https://api-berita-indonesia.vercel.app/cnn/gayaHidup/');
    const data = await response.json();

    const newsWithRelativeTime = data.data.posts.map(item => {
      const pubDate = new Date(item.pubDate);
      const relativeTime = formatDistanceToNow(pubDate, { addSuffix: true, locale: id });
      return { ...item, relativeTime };
    });

    res.json({ posts: newsWithRelativeTime });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).send('Error fetching news');
  }
});



// Endpoint untuk mengambil Detail artikel
app.get('/article', async (req, res) => {
  const articleURL = req.query.url;
  if (!articleURL) {
    return res.status(400).send('URL is required');
  }

  const article = await scrapeArticle(articleURL);
  if (article) {
    res.json(article);
  } else {
    res.status(500).send('Error scraping article');
  }
});

// Menyajikan halaman HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
