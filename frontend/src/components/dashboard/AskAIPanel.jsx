import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, Trash2, HelpCircle } from 'lucide-react';
import axios from 'axios';

const AskAIPanel = ({ metadata, analytics }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: "👋 Hi! I'm your **InsightX AI Analyst**. I've profiled your dataset. Ask me anything—from specific metric averages, correlation drivers, to anomaly audits and strategic recommendations!",
      stat: "Ready",
      time: "Just now"
    }
  ]);

  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    "What is the average and range of values?",
    "Are there any outliers or anomalies?",
    "What is the strongest correlation driver?",
    "What are your top 3 recommendations?",
    "Explain the dataset overview and features"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleAsk = async (queryText) => {
    const q = queryText || question;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/query', {
        question: q,
        metadata: metadata || {},
        analytics: analytics || {}
      });

      const aiMsg = {
        sender: 'ai',
        text: response.data.answer,
        stat: response.data.stat,
        type: response.data.type,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I couldn't calculate an answer for that specific phrasing. Try asking about a specific column name (e.g. *'average revenue'*), or ask for *'anomalies'* or *'recommendations'*.",
          stat: "Notice",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([
      {
        sender: 'ai',
        text: "Chat cleared! How can I assist you with your dataset analysis?",
        stat: "Reset",
        time: "Just now"
      }
    ]);
  };

  // Simple formatter for bold text and bullet points
  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => {
      // Process bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i} className="block mb-1">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <div id="ai-chat" className="report-card p-6 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">AI Data Chatbot Assistant</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Dataset Online
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask natural-language questions to query, compare, and extract insights</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            title="Clear Chat History"
            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2">
          <Sparkles size={13} className="text-amber-500" />
          <span>Suggested Questions:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleAsk(sq)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer shadow-2xs"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="space-y-4 max-h-[360px] min-h-[180px] overflow-y-auto pr-2 mb-4 scrollbar-thin">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                <Bot size={16} />
              </div>
            )}

            <div className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-xs'
                : 'bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-xs'
            }`}>
              <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-75">
                <span className="font-semibold">{msg.sender === 'user' ? 'You' : 'InsightX AI'}</span>
                <div className="flex items-center gap-1.5">
                  {msg.stat && (
                    <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold text-[10px]">
                      {msg.stat}
                    </span>
                  )}
                  <span>{msg.time}</span>
                </div>
              </div>

              <div>
                {formatText(msg.text)}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-1">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot size={16} />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse delay-150"></div>
              <span>Querying dataset distributions...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this data... (e.g. 'What is the average revenue?', 'What are top drivers?')"
          className="w-full pl-4 pr-24 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-2xs"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin text-xs">...</span>
          ) : (
            <>
              <span>Ask AI</span>
              <Send size={13} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AskAIPanel;

