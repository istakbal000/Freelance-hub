import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    const SOCKET_URL = process.env.NODE_ENV === 'production'
      ? 'https://freelance-hub-n8dk.onrender.com'
      : 'http://localhost:5000';
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('joinRoom', { userId: user?.id });
    socketRef.current.on('receiveMessage', (data) => {
      if (data.senderId === selectedUser?._id) {
        setMessages(prev => [...prev, {
          sender: { _id: data.senderId },
          message: data.message,
          createdAt: data.timestamp
        }]);
      }
      fetchConversations();
    });
    return () => { socketRef.current.disconnect(); };
  }, [user?.id, selectedUser]);

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => { if (userId) fetchUserAndMessages(userId); }, [userId]);
  useEffect(() => { scrollToBottom(); }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/messages/conversations/list');
      setConversations(res.data.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAndMessages = async (id) => {
    try {
      const userRes = await axios.get(`/api/users/${id}`);
      setSelectedUser(userRes.data.data);
      const messagesRes = await axios.get(`/api/messages/${id}`);
      setMessages(messagesRes.data.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      await axios.post('/api/messages', { receiver: selectedUser._id, message: newMessage });
      socketRef.current.emit('sendMessage', { senderId: user?.id, receiverId: selectedUser._id, message: newMessage });
      setMessages(prev => [...prev, { sender: { _id: user?.id }, message: newMessage, createdAt: new Date() }]);
      setNewMessage('');
      fetchConversations();
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="h-[calc(100vh-64px)] max-w-6xl mx-auto flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Messages</h3>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">No conversations yet</div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.user._id}
                  onClick={() => {
                    navigate(`/chat/${conv.user._id}`);
                    setSelectedUser(conv.user);
                    fetchUserAndMessages(conv.user._id);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 transition-colors ${selectedUser?._id === conv.user._id
                    ? 'bg-indigo-50'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {conv.user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{conv.user.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {conv.lastMessage.message.substring(0, 30)}...
                    </div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white shadow-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{selectedUser.name}</div>
                  <div className="text-xs text-gray-400">
                    {selectedUser.role === 'experienced' ? 'Experienced Freelancer' : 'Beginner Freelancer'}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-2">💬</div>
                      <p className="text-sm">Say hello to {selectedUser.name}</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMine = msg.sender._id === user?.id;
                    return (
                      <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMine
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                          }`}>
                          <div>{msg.message}</div>
                          <div className={`text-xs mt-1 ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-white">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div className="text-gray-400">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-sm">Select a conversation or start messaging from a profile</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
