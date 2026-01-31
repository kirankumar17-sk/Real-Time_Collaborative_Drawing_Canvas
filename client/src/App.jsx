import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import io from 'socket.io-client';
import './App.css';

// Socket instance needs to be accessed by toolbar for Undo
// DELETE THIS LINE:
// const socket = io('http://localhost:3001');

// PASTE THIS INSTEAD:
const socket = io('https://real-time-collaborative-drawing-canvas-1.onrender.com', {
  transports: ['websocket']
});
function App() {
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  const [tool, setTool] = useState('brush');
  const [users, setUsers] = useState({});

  const handleUndo = () => socket.emit('undo');
  const handleClear = () => socket.emit('clear');

  return (
    <div className="app-container">
      <Toolbar
        color={color} setColor={setColor}
        size={size} setSize={setSize}
        tool={tool} setTool={setTool}
        undo={handleUndo}
        clear={handleClear}
        users={users}
      />
      <Canvas
        color={color}
        size={size}
        tool={tool}
        setUsers={setUsers}
        users={users}
      />
    </div>
  );
}

export default App;