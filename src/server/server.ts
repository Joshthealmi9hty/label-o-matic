import express from 'express';
import cors from 'cors';
import db, { seedDatabase } from './db';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Seed database on startup
seedDatabase();

// Get one unlabeled image
app.get('/api/get-image', (req, res) => {
  const image = db.prepare('SELECT * FROM images WHERE label IS NULL LIMIT 1').get();
  
  if (!image) {
    return res.json({ message: 'No more images to label' });
  }
  
  res.json(image);
});

// Submit a label for an image
app.post('/api/submit-label', (req, res) => {
  const { id, label } = req.body;
  
  try {
    db.prepare('UPDATE images SET label = ? WHERE id = ?').run(label, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update label' });
  }
});

// Add a new image
app.post('/api/add-image', (req, res) => {
  const { image_url } = req.body;
  
  try {
    const result = db.prepare('INSERT INTO images (image_url) VALUES (?)').run(image_url);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});