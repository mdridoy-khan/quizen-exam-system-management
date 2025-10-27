import { useEffect, useRef, useState } from "react";
import {
  FaComments,
  FaHistory,
  FaMicrophone,
  FaRegKeyboard,
  FaTimes,
} from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 5000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { type: "text", content: input };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newMessage = { type: "voice", content: audioUrl };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access denied or error:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      {/* Chat Icon with Tip */}
      {!isOpen && (
        <div>
          {showTip && (
            <div className="bg-gray-800 fixed bottom-[115px] lg:bottom-[150px] right-5 z-50 text-white text-xs px-3 py-1 rounded shadow-lg animate-fade">
              How can I assist you today?
            </div>
          )}
          <div className="fixed bottom-[72px] lg:bottom-24 right-5 flex flex-col items-center space-y-2">
            <div className="relative">
              <span className="custom-ping absolute z-10 inline-flex h-full w-full rounded-full bg-blue600 opacity-75"></span>
              <span className="custom-ping delay-200 absolute z-10 inline-flex h-full w-full rounded-full bg-blue600 opacity-50"></span>
              <button
                className="z-20 relative w-[44px] lg:w-[55px] h-[44px] lg:h-[55px] flex items-center justify-center bg-blue600 text-white p-3 rounded-full shadow-lg"
                onClick={() => setIsOpen(true)}
              >
                <FaComments size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-80 bg-white shadow-lg rounded-xl overflow-hidden border border-gray300 z-50">
          {/* Header */}
          <div className="bg-blue600 text-white flex justify-between items-center p-3">
            <span className="font-semibold">Chatbot</span>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className="h-60 p-3 overflow-y-auto text-sm">
            {activeTab === "text" && (
              <>
                <div className="mb-2">
                  Text mode enabled. Type your message below.
                </div>
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded">
                      {msg.content}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "voice" && (
              <div className="text-center">
                <p className="mb-2 text-gray-600">
                  {isRecording ? "Recording..." : "Click to record a message"}
                </p>
                <button
                  onClick={
                    isRecording ? handleStopRecording : handleStartRecording
                  }
                  className={`px-4 py-2 rounded text-white ${
                    isRecording ? "bg-red500" : "bg-green500"
                  }`}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div key={index} className="bg-yellow-100 p-2 rounded">
                    {msg.type === "voice" ? (
                      <audio controls src={msg.content}></audio>
                    ) : (
                      msg.content
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Section (only for text tab) */}
          {activeTab === "text" && (
            <div className="flex items-center border-t p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border p-2 text-sm rounded mr-2 shadow-none outline-none focus:border focus:border-blue600"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSend}
                className="bg-blue600 text-white px-3 py-1 rounded text-sm"
              >
                Send
              </button>
            </div>
          )}

          {/* Tab Buttons */}
          <div className="flex justify-around border-b">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 p-2 ${
                activeTab === "text" ? "bg-blue-100" : ""
              }`}
            >
              <FaRegKeyboard className="inline mr-1" /> Text
            </button>
            <button
              onClick={() => setActiveTab("voice")}
              className={`flex-1 p-2 ${
                activeTab === "voice" ? "bg-blue-100" : ""
              }`}
            >
              <FaMicrophone className="inline mr-1" /> Voice
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 p-2 ${
                activeTab === "history" ? "bg-blue-100" : ""
              }`}
            >
              <FaHistory className="inline mr-1" /> History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
