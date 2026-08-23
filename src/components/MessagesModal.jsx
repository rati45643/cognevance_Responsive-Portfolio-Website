import React, { useState } from 'react';
import { X, Database, RefreshCw, Mail, Calendar, User, MessageSquare, Lock, Unlock, Edit2, Trash2, Save, Building2, KeyRound, AlertCircle, LogOut, ExternalLink, Eye, EyeOff } from 'lucide-react';

const MessagesModal = ({ isOpen, onClose, messages = [], onRefresh }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', company: '', subject: '', message: '' });
  const [actionStatus, setActionStatus] = useState('');

  if (!isOpen) return null;

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        setShowPasswordInput(false);
        setAuthError('');
        setActionStatus('Unlocked Admin Edit Mode!');
        setTimeout(() => setActionStatus(''), 3000);
      } else {
        setAuthError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setAuthError('Connection error verifying password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminPassword('');
    setShowPasswordText(false);
    setEditingId(null);
    setShowPasswordInput(false);
    setActionStatus('Logged out of Admin Edit Mode.');
    setTimeout(() => setActionStatus(''), 3000);
  };

  const handleStartEdit = (msg) => {
    setEditingId(msg.id);
    setEditForm({
      name: msg.name || '',
      email: msg.email || '',
      company: msg.company || '',
      subject: msg.subject || '',
      message: msg.message || ''
    });
  };

  const handleSaveEdit = async (id) => {
    setActionStatus('Saving changes...');
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminPassword,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditingId(null);
        setActionStatus('Message updated in SQLite database!');
        onRefresh();
        setTimeout(() => setActionStatus(''), 3000);
      } else {
        alert(data.error || 'Failed to update message');
      }
    } catch (err) {
      alert('Error updating message');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete message #${id} from the database?`)) {
      return;
    }
    setActionStatus('Deleting...');
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Password': adminPassword,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionStatus(`Message #${id} deleted.`);
        onRefresh();
        setTimeout(() => setActionStatus(''), 3000);
      } else {
        alert(data.error || 'Failed to delete message');
      }
    } catch (err) {
      alert('Error deleting message');
    }
  };

  const openInGmail = (msg) => {
    const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${msg.subject || 'Inquiry'} from ${msg.name}`);
    const mailBody = encodeURIComponent(
      `Hi Ratish,\n\n${msg.message}\n\n---\nSender Details:\nName: ${msg.name}\nEmail: ${msg.email}\nCompany: ${msg.company || 'N/A'}\nSubject: ${msg.subject || 'General Inquiry'}`
    );
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ratishkannur@gmail.com&su=${mailSubject}&body=${mailBody}`;
    window.open(gmailComposeUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} title="Close Modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>Database Inquiries Drawer</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Live records stored in SQLite database (<code>portfolio.db</code>)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onRefresh}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>

            {/* Admin Password / Logout Toggle Button */}
            {!isAdminAuthenticated ? (
              <button
                className="btn btn-outline"
                onClick={() => setShowPasswordInput(!showPasswordInput)}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem', borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }}
              >
                <Lock size={14} />
                <span>Admin Unlock (Edit Mode)</span>
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-full)', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: '700' }}>
                  <Unlock size={14} />
                  <span>Admin Unlocked</span>
                </div>

                <button
                  onClick={handleAdminLogout}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  title="Logout from Admin Edit Mode"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Admin Password Form */}
        {showPasswordInput && !isAdminAuthenticated && (
          <form onSubmit={handleAdminLogin} style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--accent-pink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={18} />
              Owner Admin Authentication
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Enter your password to enable message editing and deletion rights:
            </p>
            
            {authError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={15} />
                <span>{authError}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  placeholder="Enter Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title={showPasswordText ? "Hide Password" : "Show Password"}
                >
                  {showPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem' }}>
                Unlock
              </button>
            </div>
          </form>
        )}

        {actionStatus && (
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {actionStatus}
          </div>
        )}

        {/* Messages List */}
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
            <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h4>No Database Inquiries Yet</h4>
            <p style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>
              Submit a message via the Contact Form to test live SQLite database persistence!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '55vh', overflowY: 'auto' }}>
            {messages.map((msg) => {
              const isEditing = editingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className="glass-card"
                  style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}
                >
                  {!isEditing ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          <User size={16} style={{ color: 'var(--accent-primary)' }} />
                          <span>{msg.name}</span>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                            #{msg.id}
                          </span>
                          {msg.company && (
                            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Building2 size={13} />
                              {msg.company}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} />
                            <span>{new Date(msg.created_at).toLocaleString()}</span>
                          </div>

                          <button
                            onClick={() => openInGmail(msg)}
                            style={{ background: 'rgba(236, 72, 153, 0.15)', border: 'none', color: 'var(--accent-pink)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}
                            title="Open in Gmail"
                          >
                            <ExternalLink size={13} />
                            <span>Gmail</span>
                          </button>

                          {/* Admin Edit & Delete Buttons */}
                          {isAdminAuthenticated && (
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                onClick={() => handleStartEdit(msg)}
                                style={{ background: 'rgba(99, 102, 241, 0.15)', border: 'none', color: 'var(--accent-primary)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                                title="Edit message (Admin)"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(msg.id)}
                                style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                                title="Delete message (Admin)"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={14} />
                        <a href={`mailto:${msg.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {msg.email}
                        </a>
                        {msg.subject && <span style={{ color: 'var(--text-muted)' }}>• Subject: {msg.subject}</span>}
                      </div>

                      <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', background: 'rgba(0, 0, 0, 0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                        {msg.message}
                      </p>
                    </>
                  ) : (
                    /* Inline Admin Edit Form */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Edit2 size={16} />
                        Editing Database Message #{msg.id}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                        <input
                          type="email"
                          className="form-input"
                          placeholder="Email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Company"
                          value={editForm.company}
                          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        />
                      </div>

                      <input
                        type="text"
                        className="form-input"
                        placeholder="Subject"
                        value={editForm.subject}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      />

                      <textarea
                        className="form-textarea"
                        placeholder="Message"
                        style={{ minHeight: '80px' }}
                        value={editForm.message}
                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                      ></textarea>

                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }} onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                        <button className="btn btn-primary" style={{ padding: '0.35rem 1rem', fontSize: '0.85rem' }} onClick={() => handleSaveEdit(msg.id)}>
                          <Save size={14} />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Total Database Records: <strong>{messages.length}</strong></span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isAdminAuthenticated && (
              <button className="btn btn-secondary" style={{ color: '#ef4444' }} onClick={handleAdminLogout}>
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>Close Drawer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesModal;
