import React from 'react';

const Toolbar = ({ color, setColor, size, setSize, tool, setTool, undo, clear, users }) => {
    return (
        <div className="toolbar">

            {/* Group 1: Settings (Color & Size) */}
            <div className="group">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    title="Color"
                />
                <input
                    type="range"
                    min="2" max="50"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    title="Brush Size"
                />
            </div>

            {/* Group 2: Tools (Brush & Eraser) */}
            <div className="group">
                <button
                    className={`tool-btn ${tool === 'brush' ? 'active' : ''}`}
                    onClick={() => setTool('brush')}
                    title="Brush"
                >
                    <i className="fa-solid fa-paintbrush"></i>
                </button>

                <button
                    className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
                    onClick={() => setTool('eraser')}
                    title="Eraser"
                >
                    <i className="fa-solid fa-eraser"></i>
                </button>
            </div>

            {/* Group 3: Actions (Undo & Clear) */}
            <div className="group">
                <button className="btn-undo" onClick={undo} title="Undo">
                    <i className="fa-solid fa-rotate-left"></i> Undo
                </button>
                <button className="btn-clear" onClick={clear} title="Clear Canvas">
                    <i className="fa-solid fa-trash"></i> Clear
                </button>
            </div>

            {/* Group 4: Users */}
            <div className="user-count" title="Online Users">
                <i className="fa-solid fa-users"></i>
                {Object.keys(users).length}
            </div>

        </div>
    );
};

export default Toolbar;