import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../portfolio.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDatabase();
  }
});

function initDatabase() {
  // Messages table
  const createMessagesSql = `
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createMessagesSql, (err) => {
    if (err) {
      console.error('Error creating messages table:', err.message);
    } else {
      console.log('Database initialized: "messages" table ready.');
      db.run(`ALTER TABLE messages ADD COLUMN company TEXT`, () => {});
    }
  });

  // Portfolio CMS content table
  const createContentSql = `
    CREATE TABLE IF NOT EXISTS portfolio_content (
      id TEXT PRIMARY KEY,
      content_json TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createContentSql, (err) => {
    if (err) {
      console.error('Error creating portfolio_content table:', err.message);
    } else {
      console.log('Database initialized: "portfolio_content" table ready.');
    }
  });
}

// Contact messages helpers
export const saveMessage = ({ name, email, company, subject, message }) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO messages (name, email, company, subject, message) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [name, email, company || '', subject || 'General Inquiry', message], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          name,
          email,
          company: company || '',
          subject,
          message,
          created_at: new Date().toISOString()
        });
      }
    });
  });
};

export const updateMessage = ({ id, name, email, company, subject, message }) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE messages SET name = ?, email = ?, company = ?, subject = ?, message = ? WHERE id = ?`;
    db.run(sql, [name, email, company || '', subject || '', message, id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, name, email, company, subject, message, changes: this.changes });
      }
    });
  });
};

export const deleteMessage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM messages WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, changes: this.changes });
      }
    });
  });
};

export const getMessages = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM messages ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Portfolio CMS Content helpers
export const getPortfolioContent = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT content_json FROM portfolio_content WHERE id = 'master'`;
    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err);
      } else if (row && row.content_json) {
        try {
          resolve(JSON.parse(row.content_json));
        } catch (e) {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

export const savePortfolioContent = (contentObj) => {
  return new Promise((resolve, reject) => {
    const jsonStr = JSON.stringify(contentObj);
    const sql = `INSERT INTO portfolio_content (id, content_json, updated_at) VALUES ('master', ?, CURRENT_TIMESTAMP)
                 ON CONFLICT(id) DO UPDATE SET content_json = excluded.content_json, updated_at = CURRENT_TIMESTAMP`;
    db.run(sql, [jsonStr], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true, updated_at: new Date().toISOString() });
      }
    });
  });
};

export default db;
