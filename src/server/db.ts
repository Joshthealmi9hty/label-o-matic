import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, 'images.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    label TEXT DEFAULT NULL,
    text_content TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Function to seed the database with images
export const seedDatabase = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM images').get() as { count: number };
  
  if (count.count === 0) {
    const stmt = db.prepare('INSERT INTO images (image_url) VALUES (?)');
    
    // Insert 50 random images
    for (let i = 1; i <= 50; i++) {
      stmt.run(`https://picsum.photos/800/600?random=${i}`);
    }
  }
};

export default db;