import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --------------------------------------------------
// ADMIN AUTH
// --------------------------------------------------

const requireAdminAuth = (req, res, next) => {
  const passwordHeader = req.headers['x-admin-password'];
  const passwordBody = req.body?.adminPassword;

  if (
    ADMIN_PASSWORD &&
    (passwordHeader === ADMIN_PASSWORD ||
      passwordBody === ADMIN_PASSWORD)
  ) {
    return next();
  }

  return res.status(401).json({
    error: 'Unauthorized: Invalid Admin Password'
  });
};

// --------------------------------------------------
// HEALTH
// --------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Ratish Kannur Portfolio Backend API & CMS',
    database: 'SQLite (portfolio.db)',
    notificationTarget:
      process.env.NOTIFICATION_EMAIL || 'configured'
  });
});

// --------------------------------------------------
// GET PORTFOLIO CONTENT
// --------------------------------------------------

app.get('/api/content', async (req, res) => {
  try {
    const savedContent = await getPortfolioContent();

    if (savedContent) {
      return res.json({
        success: true,
        isCustomized: true,
        content: savedContent
      });
    }

    const initialContent = {
      personalInfo: defaultPersonalInfo,
      skillsData: defaultSkillsData,
      projectsData: defaultProjectsData,
      experienceData: defaultExperienceData,
      certificatesData: defaultCertificatesData
    };

    return res.json({
      success: true,
      isCustomized: false,
      content: initialContent
    });
  } catch (error) {
    console.error(
      'Error fetching portfolio content:',
      error
    );

    return res.status(500).json({
      error: 'Failed to retrieve portfolio content.'
    });
  }
});

// --------------------------------------------------
// UPDATE PORTFOLIO CONTENT
// --------------------------------------------------

app.put('/api/content', requireAdminAuth, async (req, res) => {
  try {
    const {
      personalInfo,
      skillsData,
      projectsData,
      experienceData,
      certificatesData
    } = req.body;

    if (!personalInfo || !skillsData || !projectsData) {
      return res.status(400).json({
        error: 'Invalid portfolio content structure.'
      });
    }

    const newContent = {
      personalInfo,
      skillsData,
      projectsData,
      experienceData: experienceData || [],
      certificatesData: certificatesData || []
    };

    await savePortfolioContent(newContent);

    console.log(
      '[CMS Update] Portfolio content updated successfully.'
    );

    return res.json({
      success: true,
      message: 'Portfolio content updated successfully.',
      content: newContent
    });
  } catch (error) {
    console.error(
      'Error updating portfolio content:',
      error
    );

    return res.status(500).json({
      error: 'Failed to save portfolio content.'
    });
  }
});

// --------------------------------------------------
// RESET PORTFOLIO CONTENT
// --------------------------------------------------

app.post(
  '/api/content/reset',
  requireAdminAuth,
  async (req, res) => {
    try {
      const initialContent = {
        personalInfo: defaultPersonalInfo,
        skillsData: defaultSkillsData,
        projectsData: defaultProjectsData,
        experienceData: defaultExperienceData,
        certificatesData: defaultCertificatesData
      };

      await savePortfolioContent(initialContent);

      return res.json({
        success: true,
        message: 'Portfolio content reset to defaults.',
        content: initialContent
      });
    } catch (error) {
      console.error(
        'Error resetting portfolio content:',
        error
      );

      return res.status(500).json({
        error: 'Failed to reset portfolio content.'
      });
    }
  }
);

// --------------------------------------------------
// CONTACT FORM
// --------------------------------------------------

app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      subject,
      message
    } = req.body;

    if (
      !name ||
      !name.trim() ||
      !email ||
      !email.trim() ||
      !email.includes('@') ||
      !company ||
      !company.trim() ||
      !subject ||
      !subject.trim() ||
      !message ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: 'All fields are required!'
      });
    }

    const savedRecord = await saveMessage({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    console.log(
      `[Contact Form] New message saved. ID: ${savedRecord.id}`
    );

    const emailResult =
      await sendContactEmailNotification(savedRecord);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: savedRecord,
      emailStatus: emailResult
    });
  } catch (error) {
    console.error(
      'Error handling contact form submission:',
      error
    );

    return res.status(500).json({
      error: 'Failed to process contact submission.'
    });
  }
});

// --------------------------------------------------
// GET MESSAGES
// --------------------------------------------------

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await getMessages();

    return res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error(
      'Error fetching messages:',
      error
    );

    return res.status(500).json({
      error: 'Failed to retrieve messages from database.'
    });
  }
});

// --------------------------------------------------
// ADMIN LOGIN
// --------------------------------------------------

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (
    ADMIN_PASSWORD &&
    password === ADMIN_PASSWORD
  ) {
    return res.json({
      success: true,
      message: 'Admin authenticated successfully'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Incorrect Admin Password'
  });
});

// --------------------------------------------------
// UPDATE MESSAGE
// --------------------------------------------------

app.put(
  '/api/messages/:id',
  requireAdminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        name,
        email,
        company,
        subject,
        message
      } = req.body;

      if (
        !name ||
        !email ||
        !company ||
        !subject ||
        !message
      ) {
        return res.status(400).json({
          error: 'All fields are required for update.'
        });
      }

      const updated = await updateMessage({
        id,
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        subject: subject.trim(),
        message: message.trim()
      });

      return res.json({
        success: true,
        message: `Message #${id} updated successfully.`,
        data: updated
      });
    } catch (error) {
      console.error(
        'Error updating message:',
        error
      );

      return res.status(500).json({
        error: 'Failed to update message.'
      });
    }
  }
);

// --------------------------------------------------
// DELETE MESSAGE
// --------------------------------------------------

app.delete(
  '/api/messages/:id',
  requireAdminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await deleteMessage(id);

      return res.json({
        success: true,
        message: `Message #${id} deleted successfully.`,
        data: deleted
      });
    } catch (error) {
      console.error(
        'Error deleting message:',
        error
      );

      return res.status(500).json({
        error: 'Failed to delete message.'
      });
    }
  }
);

// --------------------------------------------------
// STATS
// --------------------------------------------------

app.get('/api/stats', async (req, res) => {
  try {
    const messages = await getMessages();

    return res.json({
      totalMessages: messages.length,
      projectsCount: defaultProjectsData.length,
      skillsCount: Array.isArray(defaultSkillsData)
        ? defaultSkillsData.length
        : 0,
      experienceYears:
        'Fresh Graduate / Entry Level Software Engineer'
    });
  } catch (error) {
    console.error(
      'Error fetching stats:',
      error
    );

    return res.status(500).json({
      error: 'Failed to fetch stats'
    });
  }
});

// --------------------------------------------------
// SERVE VITE BUILD
// --------------------------------------------------

const distPath = path.resolve(
  __dirname,
  '../dist'
);

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(
    path.join(distPath, 'index.html')
  );
});

// --------------------------------------------------
// START EXPRESS SERVER
// --------------------------------------------------

const server = app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      '================================================='
    );

    console.log(
      `Portfolio Backend Server running on port ${PORT}`
    );

    console.log(
      `Health endpoint: /api/health`
    );

    console.log(
      `CMS API: /api/content`
    );

    console.log(
      `Contact API: /api/contact`
    );

    console.log(
      `Messages API: /api/messages`
    );

    console.log(
      '================================================='
    );
  }
);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use.`
    );
  } else {
    console.error(
      'Server error:',
      err
    );
  }
});
