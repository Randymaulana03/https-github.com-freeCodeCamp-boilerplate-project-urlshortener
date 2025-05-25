require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

let urls = [];
let idCounter = 1;

// POST endpoint
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validasi URL dengan URL constructor
  try {
    const myURL = new URL(originalUrl);

    // DNS lookup untuk memverifikasi domain
    dns.lookup(myURL.hostname, (err, address) => {
      if (err || !address) {
        return res.json({ error: 'invalid url' });
      }

      // Simpan dan beri ID unik
      const short_url = idCounter++;
      urls[short_url] = originalUrl;

      res.json({
        original_url: originalUrl,
        short_url: short_url
      });
    });
  } catch (e) {
    return res.json({ error: 'invalid url' });
  }
});

// GET endpoint
app.get('/api/shorturl/:short', (req, res) => {
  const short = req.params.short;
  const originalUrl = urls[short];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
