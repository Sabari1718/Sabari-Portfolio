"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioAPI } from "@/services/api";
import { Mail, MailOpen, Trash2, Calendar, User, Search, RefreshCw } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMessages = async () => {
    try {
      setIsRefreshing(true);
      const res = await PortfolioAPI.getMessages();
      if (res.success) {
        setMessages(res.data);
      } else {
        setError(res.message || "Failed to load messages");
      }
    } catch (err) {
      setError("An error occurred while fetching messages");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: number, currentStatus: boolean) => {
    if (currentStatus) return; // Already read
    
    try {
      const res = await PortfolioAPI.markMessageAsRead(id);
      if (res.success) {
        setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const res = await PortfolioAPI.deleteMessage(id);
      if (res.success) {
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.subject && m.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage contact form submissions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors w-full md:w-64"
            />
          </div>
          <button 
            onClick={fetchMessages}
            disabled={isRefreshing}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card className="bg-white/5 border-dashed border-white/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-medium mb-2">No messages found</h3>
            <p className="text-[var(--text-secondary)] max-w-md">
              {search ? "No messages match your search criteria." : "You haven't received any messages yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => (
            <Card 
              key={msg.id} 
              className={`transition-all duration-300 overflow-hidden border-l-4 hover:shadow-lg hover:shadow-black/20 ${msg.is_read ? 'border-l-white/10 bg-white/5' : 'border-l-[var(--primary)] bg-white/10'}`}
              onClick={() => handleMarkAsRead(msg.id, msg.is_read)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 cursor-pointer">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${msg.is_read ? 'bg-white/10 text-white/60' : 'bg-[var(--primary)]/20 text-[var(--primary)]'}`}>
                        {msg.is_read ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{msg.subject || 'No Subject'}</h3>
                        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mt-1">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {msg.name}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> <a href={`mailto:${msg.email}`} onClick={e => e.stopPropagation()} className="hover:text-[var(--primary)] transition-colors">{msg.email}</a></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] bg-white/5 px-3 py-1 rounded-full">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(msg.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-black/20 rounded-lg text-white/80 whitespace-pre-wrap font-mono text-sm">
                    {msg.message}
                  </div>
                </div>
                
                <div className="bg-black/20 border-t md:border-t-0 md:border-l border-white/5 p-4 md:w-20 flex flex-row md:flex-col items-center justify-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id);
                    }}
                    className="p-3 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all group"
                    title="Delete Message"
                  >
                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
