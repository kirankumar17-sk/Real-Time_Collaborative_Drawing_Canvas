import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://real-time-collaborative-drawing-canvas-3.onrender.com', {
    transports: ['websocket']
});

const Canvas = ({ color, size, tool, setUsers, users }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const currentPath = useRef([]); // Store points for current stroke
    const [cursors, setCursors] = useState({});

    // 1. Initialize Canvas
    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            socket.emit('undo'); // Quick hack to force redraw on resize
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 2. Socket Event Listeners
    useEffect(() => {
        // Draw line from other users
        socket.on("draw_line", ({ prevPoint, currentPoint, color, size }) => {
            if (!ctxRef.current) return;
            drawLine(prevPoint, currentPoint, color, size);
        });

        // Handle full history redraw (Join, Undo, Clear)
        socket.on("history", (history) => {
            const ctx = ctxRef.current;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            history.forEach((stroke) => {
                if (stroke.points.length < 2) return;
                ctx.beginPath();
                ctx.strokeStyle = stroke.color;
                ctx.lineWidth = stroke.size;
                ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
                for (let i = 1; i < stroke.points.length; i++) {
                    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
                }
                ctx.stroke();
            });
        });

        // Update Users list
        socket.on("users_update", (updatedUsers) => {
            setUsers(updatedUsers);
        });

        // Update Cursors
        socket.on("cursor_move", ({ userId, x, y, color }) => {
            setCursors(prev => ({ ...prev, [userId]: { x, y, color } }));
        });

        return () => {
            socket.off("draw_line");
            socket.off("history");
            socket.off("users_update");
            socket.off("cursor_move");
        };
    }, [setUsers]);

    // Helper: Draw a single segment
    const drawLine = (start, end, strokeColor, strokeSize) => {
        const ctx = ctxRef.current;
        ctx.beginPath();
        ctx.lineWidth = strokeSize;
        ctx.strokeStyle = strokeColor;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    };

    // --- Mouse Event Handlers ---

    const startDrawing = (e) => {
        const { clientX, clientY } = e;
        setIsDrawing(true);
        currentPath.current = [{ x: clientX, y: clientY }]; // Start new path
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { clientX, clientY } = e;
        const newPoint = { x: clientX, y: clientY };
        const lastPoint = currentPath.current[currentPath.current.length - 1];

        // 1. Draw locally
        drawLine(lastPoint, newPoint, tool === 'eraser' ? '#f9f9f9' : color, size);

        // 2. Emit to others
        socket.emit("draw_line", {
            prevPoint: lastPoint,
            currentPoint: newPoint,
            color: tool === 'eraser' ? '#f9f9f9' : color,
            size,
        });

        // 3. Emit cursor
        socket.emit("cursor_move", { x: clientX, y: clientY });

        // 4. Save point
        currentPath.current.push(newPoint);
    };

    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        // Send the completed path to server for history
        if (currentPath.current.length > 0) {
            socket.emit("save_stroke", {
                points: currentPath.current,
                color: tool === 'eraser' ? '#f9f9f9' : color,
                size,
                tool
            });
        }
        currentPath.current = [];
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
            />
            {/* Render Remote Cursors */}
            {Object.entries(cursors).map(([id, pos]) => (
                <div
                    key={id}
                    className="cursor"
                    style={{ top: pos.y, left: pos.x }}
                >
                    <span className="cursor-label" style={{ backgroundColor: pos.color }}>
                        User {id.slice(0, 4)}
                    </span>
                </div>
            ))}
        </>
    );
};

export default Canvas;