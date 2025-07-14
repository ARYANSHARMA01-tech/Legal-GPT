import React, { useState } from 'react';
import axios from 'axios';
import ScrollToBottom from 'react-scroll-to-bottom';
import './App.css';
import logo from './logo.png';
import Footer from './pages/Footer'; // ✅ Make sure Footer.js exists

function App() {
  const [file, setFile] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [chat, setChat] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleUpload = async () => {
    if (!file || !userQuery) {
      alert("Please upload a document and enter a query.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_query', userQuery);

    setLoading(true);
    try {
      const res = await axios.post(
        'https://legalgpt-duvt.onrender.com/process',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('🟢 Backend response:', res.data);
      setAnalysis(res.data);
    } catch (err) {
      alert('❌ Failed to process document.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleChatSend = async () => {
    if (!userMessage) return;

    const newChat = [...chat, { sender: 'user', message: userMessage }];
    setChat(newChat);
    setUserMessage('');

    try {
      const res = await axios.post('https://legalgpt-duvt.onrender.com/chat', {
        message: userMessage,
        context: analysis?.result || '',
      });

      setChat([...newChat, { sender: 'bot', message: res.data.reply }]);
    } catch (err) {
      setChat([...newChat, { sender: 'bot', message: "⚠️ Sorry, something went wrong." }]);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <nav className="top-navbar">
        <div className="nav-brand">
          <img src={logo} alt="LegalGPT" className="logo-img" />
          LegalGPT
        </div>
        <div className="nav-toggle" onClick={() => setShowMenu(prev => !prev)}>☰</div>
        <div className={`nav-links ${showMenu ? 'show' : ''}`}>
          <button>About</button>
          <button>Info</button>
          <button>Contact</button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>📄 LegalGPT</h2>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Enter your legal query (e.g. Summary)"
            style={{ marginTop: '8px', padding: '6px', width: '100%' }}
          />
          <button onClick={handleUpload} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Document'}
          </button>

          {analysis && (
            <div className="analysis-box">
              <h3>📌 Result</h3>
              <p>{analysis.result || "❌ No response available"}</p>

              <h3>💡 Full Response (Debug)</h3>
              <pre style={{ fontSize: '12px' }}>
                {JSON.stringify(analysis, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Chatbox */}
        <div className="chatbox">
          <ScrollToBottom className="chat-window">
            {chat.length === 0 ? (
              <div className="chat-placeholder">
                <h2>👋 Welcome to LegalGPT</h2>
                <p>Upload a document on the left to get started.</p>
                <p>Then ask me any legal questions here.</p>
              </div>
            ) : (
              chat.map((entry, i) => (
                <div key={i} className={`chat-msg ${entry.sender}`}>
                  <span>{entry.message}</span>
                </div>
              ))
            )}
          </ScrollToBottom>

          <div className="chat-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask LegalGPT anything..."
            />
            <button onClick={handleChatSend}>Send</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
