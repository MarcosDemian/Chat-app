import { useState, useEffect } from 'react';
import socket from './socket';
import './styles.css';

const App = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //escuchar mensajes desde el servidor
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off('receive_message');
  }, []);

  //Enviar mensaje
  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { text: message, userName };
    socket.emit('send_message', newMessage); //enviar el mensaje al servidor
    setMessage('');
  };

  const handleLogin = () => {
    if (userName.trim()) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <div className="login">
          <input
            className='submit-name'
            type="text"
            placeholder="Ingresa tu nombre"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button className='btn-name' onClick={handleLogin}>Unirse</button>
        </div>
      ) : (
        <>
          <div className="header">Chat en Tiempo Real</div>
          <div className="chat-box">
            {chat.map((msg, index) => (
              <div key={index} className={`message ${msg.userName === userName ? 'own' : ''}`}>
                <span className="user">{msg.userName === userName ? 'Tú' : msg.userName}:</span>{' '}
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
            />
            <button onClick={sendMessage}>Enviar</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;