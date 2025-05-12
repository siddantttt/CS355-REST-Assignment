const express = require('express');       // load express module
const nedb = require("nedb-promises");    // load nedb module

const app = express();                    // init app
const db = nedb.create('users.jsonl');    // init db

app.use(express.static('public'));        // serve static files from ./public
app.use(express.json());                  // automatically decode JSON requests

// ✅ GET /users - Get all users
app.get('/users', (req, res) => {
    db.find({})
      .then(docs => res.json(docs))
      .catch(error => res.json({ error }));
});

// ✅ GET /users/:username - Get one user by username
app.get('/users/:username', (req, res) => {
    const username = req.params.username;
    db.findOne({ username })
      .then(doc => {
          if (!doc) return res.json({ error: 'Username not found.' });
          res.json(doc);
      })
      .catch(error => res.json({ error }));
});

// ✅ POST /users - Register new user
app.post('/users', (req, res) => {
    const { username, password, name, email } = req.body;
    if (!username || !password || !name || !email) {
        return res.json({ error: 'Missing fields.' });
    }

    db.findOne({ username })
      .then(existing => {
          if (existing) return res.json({ error: 'Username already exists.' });
          return db.insert({ username, password, name, email });
      })
      .then(newDoc => {
          if (newDoc) res.json(newDoc);
      })
      .catch(error => res.json({ error }));
});

// ✅ PATCH /users/:username - Update user info
app.patch('/users/:username', (req, res) => {
    const username = req.params.username;
    const { name, email } = req.body;

    db.update({ username }, { $set: { name, email } })
      .then(count => {
          if (count === 0) return res.json({ error: 'Something went wrong.' });
          res.json({ ok: true });
      })
      .catch(error => res.json({ error }));
});

// ✅ DELETE /users/:username - Delete user
app.delete('/users/:username', (req, res) => {
    const username = req.params.username;

    db.delete({ username })
      .then(count => {
          if (count === 0) return res.json({ error: 'Something went wrong.' });
          res.json({ ok: true });
      })
      .catch(error => res.json({ error }));
});

// fallback route
app.all('*', (req, res) => res.status(404).send('Invalid URL.'));

// start server
app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
