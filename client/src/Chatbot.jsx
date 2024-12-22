import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, receiveMessage } from './actions/actionCreators/chatActions';
import axios from 'axios';

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [answer, setAnswer] = useState('');

  const apiKey = 'AIzaSyB1LvxLMvKp8DaSyo8T-adDDEi7zo7BEsk';

  const chatHistory = useSelector((state) => state.chat.chatHistory);
  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    if (!userMessage) return;

    dispatch(sendMessage(userMessage));

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        method: 'post',
        data: {
          contents: [{ parts: [{ text: userMessage }] }],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;

      dispatch(receiveMessage(aiResponse));
      setAnswer(aiResponse);
    } catch (error) {
      console.error(error);
      setAnswer('Sorry - Something went wrong. Please try again!');
    }

    setUserMessage('');
  };

  return (
    <div
      style={{
        backgroundColor: '#1f1f1f',
        padding: '20px',
        borderRadius: '10px',
        width: '40%',
        height: '80vh',
        overflow: 'hidden',
        margin: '1%',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
        float:'left',
        overflowY:'hidden'
      }}
    >
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Ask Me</h3>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
        }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              margin: '10px 0',
              textAlign: message.type === 'user' ? 'right' : 'left',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: message.type === 'user' ? '#4a4a4a' : '#333',
                color: 'white',
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>

      {/* Send Button & Text Area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'stretch',
          gap: '10px',
        }}
      >
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask me something..."
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#2a2a2a',
            color: 'white',
            border: '1px solid #444',
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-end',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
