import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const AskAIPanel = ({ metadata, analytics }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      q: "What are the key highlights of this dataset?",
      a: "The dataset has been cleaned and profiled. Key numerical metrics and distributions have been mapped, with automated correlation tests and anomaly scans complete.",
      stat: "Ready"
    }
  ]);

  const sampleQuestions = [
    "Are there any outliers or anomalies?",
    "What is the strongest correlation?",
    "What is the average and range of values?",
    "Is there an observable growth trend?",
    "How many rows and columns were processed?"
  ];

  const handleAsk = async (queryText) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/query', {
        question: q,
        metadata: metadata,
        analytics: analytics
      });

      setChatHistory(prev => [
        { q: q, a: response.data.answer, stat: response.data.stat },
        ...prev
      ]);
      setQuestion('');
    } catch (err) {
      setChatHistory(prev => [
        { q: q, a: "Could not compute answer for this query. Try rephrasing with specific metric names.", stat: "Error" },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-card p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">Ask in Plain English</h3>
            <p className="text-xs text-slate-500">The AI answers questions by querying your dataset directly</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Interactive Q&A
        </span>
      </div>

      {/* Suggested questions */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <span className="text-xs font-medium text-slate-400 self-center mr-1">Suggested:</span>
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleAsk(sq)}
            className="text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors cursor-pointer"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="relative mb-5">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about your data... (e.g., 'What is the highest category?')"
          className="w-full pl-4 pr-24 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin text-xs">...</span>
          ) : (
            <>
              <span>Ask</span>
              <Send size={12} />
            </>
          )}
        </button>
      </form>

      {/* Responses */}
      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
        {chatHistory.map((item, index) => (
          <div key={index} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center justify-between text-slate-500 font-medium mb-1.5">
              <span className="text-slate-800 font-semibold">Q: {item.q}</span>
              {item.stat && (
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                  {item.stat}
                </span>
              )}
            </div>
            <p className="text-slate-700 leading-relaxed pl-2 border-l-2 border-blue-500">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AskAIPanel;
