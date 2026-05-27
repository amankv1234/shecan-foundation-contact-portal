import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Trash2, Search, Mail, Calendar, User as UserIcon, Inbox } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/admin/login');
    } else {
      fetchMessages();
    }
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/messages');
      setMessages(data);
      setFilteredMessages(data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      } else {
        setError('Failed to fetch messages');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const results = messages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMessages(results);
  }, [searchTerm, messages]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/messages/${id}`);
        setMessages(messages.filter((msg) => msg._id !== id));
      } catch (error) {
        alert('Failed to delete message');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Inbox className="w-6 h-6 text-primary-600 mr-2" />
              <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Submissions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage and review all contact form messages.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full md:w-80 pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Inbox className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No messages</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm ? 'No messages found matching your search.' : 'You have not received any messages yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {filteredMessages.map((msg, index) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 flex items-center">
                          {msg.name}
                        </h3>
                        <div className="text-sm text-slate-500 flex items-center mt-1">
                          <Mail className="w-3.5 h-3.5 mr-1" />
                          <a href={`mailto:${msg.email}`} className="hover:text-primary-600 truncate max-w-[200px]">
                            {msg.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-slate-700 text-sm whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3 flex items-center text-xs text-slate-500">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {formatDate(msg.createdAt)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
