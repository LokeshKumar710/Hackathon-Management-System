import React, { useRef, useState, useEffect } from "react";

function Canvas({ socket, color, width, tool, style }) {
    const canvasRef = useRef(null);
    const [drawings, setDrawings] = useState([]);  // Store drawings data
    const [currentTool, setCurrentTool] = useState(tool); // Track the current tool (brush/eraser)

    // Resize canvas to match window size
    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth - 40;
        canvas.height = window.innerHeight - 200;
    };

    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    // Function to draw on canvas based on stored drawing data
    const drawOnCanvas = (drawing, ctx) => {
        ctx.beginPath();
        // If the tool is eraser, draw with white color
        if (drawing.tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out"; // Erase drawing
            ctx.fillStyle = "#FFFFFF";  // White color to simulate eraser
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = drawing.color;
        }
        ctx.arc(drawing.x, drawing.y, drawing.width / 2, 0, Math.PI * 2);
        ctx.fill();
    };

    // Handle incoming draw data from other users
    const handleIncomingDraw = ({ x, y, color, width, tool }) => {
        const drawing = { x, y, color, width, tool };
        setDrawings((prevDrawings) => [...prevDrawings, drawing]);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        drawOnCanvas(drawing, ctx);
    };

    // Handle mouse drawing
    const draw = (e) => {
        if (e.buttons !== 1) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const canvasRect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / canvasRect.width;
        const scaleY = canvas.height / canvasRect.height;

        const x = (e.clientX - canvasRect.left) * scaleX;
        const y = (e.clientY - canvasRect.top) * scaleY;

        const drawing = { x, y, color, width, tool: currentTool }; // Use currentTool instead of prop tool
        setDrawings((prevDrawings) => [...prevDrawings, drawing]);
        drawOnCanvas(drawing, ctx);

        socket.emit("draw", drawing);
    };

    // Handle touch drawing
    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const canvasRect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / canvasRect.width;
        const scaleY = canvas.height / canvasRect.height;

        const x = (touch.clientX - canvasRect.left) * scaleX;
        const y = (touch.clientY - canvasRect.top) * scaleY;

        const drawing = { x, y, color, width, tool: currentTool };
        setDrawings((prevDrawings) => [...prevDrawings, drawing]);
        drawOnCanvas(drawing, ctx);

        socket.emit("draw", drawing);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const drawOnCanvas = (drawing, ctx) => {
            ctx.beginPath();
            // If the tool is eraser, draw with white color
            if (drawing.tool === "eraser") {
                ctx.globalCompositeOperation = "destination-out"; // Erase drawing
                ctx.fillStyle = "#FFFFFF";  // White color to simulate eraser
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.fillStyle = drawing.color;
            }
            ctx.arc(drawing.x, drawing.y, drawing.width / 2, 0, Math.PI * 2);
            ctx.fill();
        };
        // Draw all stored drawings on canvas
        drawings.forEach((drawing) => {
            drawOnCanvas(drawing, ctx);
        });
    }, [drawings]); // Re-run whenever drawings change

    // Change tool based on the selected tool (brush or eraser)
    useEffect(() => {
        setCurrentTool(tool); // Update current tool when the tool changes
    }, [tool]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseMove={draw}
                onTouchMove={handleTouchMove}
                style={style}
            ></canvas>
        </div>
    );
}

export default Canvas;
