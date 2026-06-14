'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalAISearch() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hello! I am the global CureCart Medical Assistant. You can describe your symptoms, ask about diseases, or inquire about general health. I use strict FDA and WHO guidelines.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    const newMessages: {role: 'user'|'bot', text: string}[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/health-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, medicineName: 'General Health Query' })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: `Error: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Failed to connect to the medical assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-3 tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
              Global Health Assistant
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1.5 font-medium">Verified medical data from FDA & WHO.</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-emerald-700 rounded-xl px-6 font-bold transition-all shadow-sm">
              Back to Shop
            </Button>
          </Link>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] p-4 md:p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-sm' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm whitespace-pre-wrap'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-500 border border-gray-100 p-4 md:p-5 rounded-2xl rounded-bl-sm text-sm animate-pulse shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                Consulting verified sources...
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-100 shrink-0">
          <div className="flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="e.g., What are the symptoms of a migraine?"
              className="flex-1 bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 h-auto rounded-xl font-bold shadow-sm transition-all">
              Send
            </Button>
          </div>
          <p className="text-center text-xs font-medium text-gray-400 mt-4">
            AI can make mistakes. Always consult a real doctor before taking any medication.
          </p>
        </div>
      </div>
    </div>
  );
}
