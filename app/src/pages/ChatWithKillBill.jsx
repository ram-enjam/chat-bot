import { useState, useEffect } from 'react';
import Header from '../components/header'; // Adjust the path to your Header component
import { PaperClipIcon, MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function ChatWithKillBill() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Sanitize and format the bot's response
  const sanitizeResponse = (response) => {
    // Replace code blocks (```...```) with <pre><code>...</code></pre>
    let sanitized = response.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Replace line breaks (\n) with HTML <br> tags
    sanitized = sanitized.replace(/\n/g, '<br>');

    // Replace **Text** with <strong>Text</strong>
    sanitized = sanitized.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    return sanitized;
  };

  // Simulate bot typing
  useEffect(() => {
    if (isBotTyping) {
      const timer = setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: sanitizeResponse("I'm here to help!") },
        ]);
        setIsBotTyping(false);
      }, 2000); // Bot typing for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isBotTyping]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSend = async () => {
    if (userInput.trim() === '') return;

    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: userInput },
    ]);

    // Clear user input field
    setUserInput('');
    setIsBotTyping(true); // Start the typing animation for the bot

    try {
      // Make API call to send user input to the backend
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userInput, // Send the user's message as 'query' in the body
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Sanitize and format the bot's response
        const sanitizedResponse = sanitizeResponse(data.response);

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: sanitizedResponse },
        ]);
      } else {
        console.error('Error with the API request');
      }
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setIsBotTyping(false); // Stop the typing animation once the bot responds
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen chat-page">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 p-6 pt-40 overflow-y-auto">
        <div className="space-y-4">
          {/* Display Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                } space-x-2`}
            >
              {message.sender === 'bot' && (
                <div className="flex items-center">
                  {/* Bot Icon */}
                  <img
                    className="bot-icon"
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712139.png"
                    alt="Bot"
                  />
                </div>
              )}

              <div
                className={`p-3 rounded-lg ${message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : '!ml-3 bg-light-gray text-black'
                  }`}
                dangerouslySetInnerHTML={{
                  __html: message.text,
                }} // Render sanitized HTML
              ></div>
            </div>
          ))}

          {/* Bot Typing Animation */}
          {isBotTyping && (
            <div className="flex justify-start space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          {/* Attachment Icon */}
          <button className="text-gray-500 hover:text-indigo-500">
            <PaperClipIcon className="w-6 h-6" />
          </button>

          {/* Input Field */}
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            onKeyDown={handleKeyDown} // Add onKeyDown event listener for Enter key
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Audio Icon */}
          <button className="text-gray-500 hover:text-indigo-500">
            <MicrophoneIcon className="w-6 h-6" />
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
