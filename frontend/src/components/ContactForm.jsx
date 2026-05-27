import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, User, Mail, MessageSquare } from 'lucide-react';
import api from '../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
    validationErrors: {},
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (status.validationErrors[e.target.name]) {
      setStatus({
        ...status,
        validationErrors: { ...status.validationErrors, [e.target.name]: null }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setStatus({ ...status, validationErrors: errors });
      return;
    }

    setStatus({ loading: true, success: false, error: null, validationErrors: {} });

    try {
      await api.post('/contact', formData);
      setStatus({ loading: false, success: true, error: null, validationErrors: {} });
      setFormData({ name: '', email: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      let errorMsg = error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again later.';
      
      // If the server returns an error object (like Vercel's default 500 error: { code, message })
      if (typeof errorMsg === 'object' && errorMsg !== null) {
        errorMsg = errorMsg.message || JSON.stringify(errorMsg);
      }

      setStatus({ 
        loading: false, 
        success: false, 
        error: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
        validationErrors: {} 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background animated blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden relative z-10"
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
          <p className="text-primary-100">She Can Foundation Internship Evaluation</p>
        </div>

        <div className="p-8">
          {status.success ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h3>
              <p className="text-slate-600">Form Submitted Successfully ✅</p>
              <button 
                onClick={() => setStatus({ ...status, success: false })}
                className="mt-6 text-primary-600 font-medium hover:text-primary-700"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status.error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{status.error}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field pl-10 ${status.validationErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Jane Doe"
                  />
                </div>
                {status.validationErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{status.validationErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field pl-10 ${status.validationErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="jane@example.com"
                  />
                </div>
                {status.validationErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{status.validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Your Message</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={`input-field pl-10 py-3 ${status.validationErrors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                {status.validationErrors.message && (
                  <p className="mt-1 text-sm text-red-500">{status.validationErrors.message}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: status.loading ? 1 : 1.02 }}
                whileTap={{ scale: status.loading ? 1 : 0.98 }}
                type="submit"
                disabled={status.loading}
                className="btn-primary"
              >
                {status.loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </div>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactForm;
