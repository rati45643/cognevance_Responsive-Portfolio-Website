import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  saveMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  getPortfolioContent,
  savePortfolioContent
} from './db.js';
import { sendContactEmailNotification } from './email.js';
import {
  personalInfo as defaultPersonalInfo,
  skillsData as defaultSkillsData,
  projectsData as defaultProjectsData,
  experienceData as defaultExperienceData,
  certificatesData as defaultCertificatesData
} from '../src/data/portfolioData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Paarulove1804@';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auth helper middleware
const requireAdminAuth = (req, res, next) => {
  const passwordHeader = req.headers['x-admin-password'];
  const passwordBody = req.body.adminPassword;

  if (passwordHeader === ADMIN_PASSWORD || passwordBody === ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Ratish Kannur Portfolio Backend API & CMS',
    database: 'SQLite (portfolio.db)',
    notificationTarget: 'ratishkannur@gmail.com'
  });
});

// Full Portfolio Content CMS API
app.get('/api/content', async (req, res) => {
  try {
    const savedContent = await getPortfolioContent();
    if (savedContent) {
      return res.json({ success: true, isCustomized: true, content: savedContent });
    }
    
    // Default initial content
    const initialContent = {
      personalInfo: defaultPersonalInfo,
      skillsData: defaultSkillsData,
      projectsData: defaultProjectsData,
      experienceData: defaultExperienceData,
      certificatesData: defaultCertificatesData
    };

    res.json({ success: true, isCustomized: false, content: initialContent });
  } catch (error) {
    console.error('Error fetching portfolio content:', error);
    res.status(500).json({ error: 'Failed to retrieve portfolio content.' });
  }
});

// Password-protected Update Full Portfolio Content
app.put('/api/content', requireAdminAuth, async (req, res) => {
  try {
    const { personalInfo, skillsData, projectsData, experienceData, certificatesData } = req.body;

    if (!personalInfo || !skillsData || !projectsData) {
      return res.status(400).json({ error: 'Invalid portfolio content structure.' });
    }

    const newContent = {
      personalInfo,
      skillsData,
      projectsData,
      experienceData: experienceData || [],
      certificatesData: certificatesData || []
    };

    await savePortfolioContent(newContent);
    console.log('[CMS Update] Portfolio content updated successfully in SQLite DB!');

    res.json({
      success: true,
      message: 'Entire portfolio website updated live & saved to SQLite database!',
      content: newContent
    });
  } catch (error) {
    console.error('Error updating portfolio content:', error);
    res.status(500).json({ error: 'Failed to save portfolio content.' });
  }
});

// Reset Portfolio Content to defaults
app.post('/api/content/reset', requireAdminAuth, async (req, res) => {
  try {
    const initialContent = {
      personalInfo: defaultPersonalInfo,
      skillsData: defaultSkillsData,
      projectsData: defaultProjectsData,
      experienceData: defaultExperienceData,
      certificatesData: defaultCertificatesData
    };
    await savePortfolioContent(initialContent);
    res.json({ success: true, message: 'Portfolio content reset to defaults.', content: initialContent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset portfolio content.' });
  }
});

// Submit contact form -> saves to DB + sends email to ratishkannur@gmail.com
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;

    // Strict validation: ALL 5 fields are mandatory
    if (
      !name || !name.trim() ||
      !email || !email.trim() || !email.includes('@') ||
      !company || !company.trim() ||
      !subject || !subject.trim() ||
      !message || !message.trim()
    ) {
      return res.status(400).json({ error: 'All fields are required! Please complete all fields before sending.' });
    }

    const savedRecord = await saveMessage({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    console.log(`[Contact Form] New message saved (ID: ${savedRecord.id}) from ${savedRecord.email} (${savedRecord.company})`);

    // Dispatch email notification to Ratish's mail inbox (ratishkannur@gmail.com)
    const emailResult = await sendContactEmailNotification(savedRecord);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been stored in the database & sent to ratishkannur@gmail.com!',
      data: savedRecord,
      emailStatus: emailResult
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    res.status(500).json({ error: 'Failed to process contact submission. Please try again.' });
  }
});

// Get stored DB messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await getMessages();
    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages from database.' });
  }
});

// Admin verify password endpoint
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Admin authenticated successfully' });
  }
  return res.status(401).json({ success: false, error: 'Incorrect Admin Password' });
});

// Password-protected EDIT DB message endpoint
app.put('/api/messages/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, company, subject, message } = req.body;

    if (!name || !email || !company || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required for update.' });
    }

    const updated = await updateMessage({
      id,
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    res.json({
      success: true,
      message: `Message #${id} updated successfully.`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message.' });
  }
});

// Password-protected DELETE DB message endpoint
app.delete('/api/messages/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteMessage(id);
    res.json({
      success: true,
      message: `Message #${id} deleted from database.`,
      data: deleted
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const messages = await getMessages();
    res.json({
      totalMessages: messages.length,
      projectsCount: 5,
      skillsCount: 24,
      experienceYears: 'Fresh Graduate / Entry Level Software Engineer'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Serve frontend build if dist directory exists
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`Portfolio Backend Server running on http://localhost:${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`CMS API: http://localhost:${PORT}/api/content`);
  console.log(`Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`Messages API: http://localhost:${PORT}/api/messages`);
  console.log(`Email Target: ratishkannur@gmail.com`);
  console.log(`Admin Password: "${ADMIN_PASSWORD}"`);
  console.log(`=================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use by an active server instance. Continuing with existing process.`);
  } else {
    console.error('Server error:', err);
  }
});
