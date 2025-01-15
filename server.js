require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const app = express();

app.use(express.static(__dirname)); // Serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectionString = process.env.CONNECTION_STRING;

MongoClient.connect(connectionString)
  .then((client) => {
    console.log('Connected to Database');
    const db = client.db('assessment-db');
    const usersCollection = db.collection('users');
    const lyricsCollection = db.collection('lyrics');

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    app.get('/auth-status', (req, res) => {
      // Example logic for authentication status
      res.json({ authenticated: false }); // Update based on actual auth logic
    });

    app.get('/lyrics', async (req, res) => {
      try {
        const lyrics = await lyricsCollection.find().toArray();
        res.json(lyrics);
      } catch (error) {
        console.error('Error fetching lyrics:', error);
        res.status(500).json({ error: 'Failed to fetch lyrics' });
      }
    });

    app.post('/lyrics', async (req, res) => {
      try {
        await lyricsCollection.insertOne(req.body);
        res.redirect('/');
      } catch (error) {
        console.error('Error saving lyric:', error);
        res.status(500).json({ error: 'Failed to save lyric' });
      }
    });

    app.post('/register', async (req, res) => {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          return res
            .status(400)
            .json({ error: 'Username and password are required.' });
        }

        const userExists = await usersCollection.findOne({ username });
        if (userExists) {
          return res.status(409).json({ error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, password: hashedPassword });
        res.status(201).send('Registration successful');
      } catch (error) {
        console.error('Registration error:', error);
        res
          .status(500)
          .json({ error: 'Internal server error during registration.' });
      }
    });

    app.post('/login', async (req, res) => {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          return res
            .status(400)
            .json({ error: 'Username and password are required.' });
        }

        const user = await usersCollection.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res
            .status(401)
            .json({ error: 'Invalid username or password.' });
        }

        res.status(200).send('Login successful');
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login.' });
      }
    });

    app.post('/logout', (req, res) => {
      try {
        res.status(200).send('Logout successful');
      } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error during logout.' });
      }
    });

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
