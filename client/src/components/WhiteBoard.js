import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Canvas from "./Canvas";
import { HexColorPicker } from "react-colorful";
import BrushIcon from '@material-ui/icons/Brush';
import DeleteIcon from '@material-ui/icons/Delete';

const socket = io("http://192.168.51.200:1313", {
    transports: ["websocket", "polling"],
});

function WhiteBoard() {
    const [color, setColor] = useState("#aabbcc");
    const [width, setWidth] = useState(5);
    const [tool, setTool] = useState("brush");
    const [activeUsers, setActiveUsers] = useState(0);

    useEffect(() => {
        socket.on("activeUsers", (count) => {
            setActiveUsers(count - 2);
        });

        return () => {
            socket.off("activeUsers");
        };
    }, []);

    // Inline styles object
    const containerStyle = {
       
        maxWidth: "48%",
        height: "150vh",
        padding: "40px",
        backgroundColor: "rgba(255, 255, 255, 1)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        boxSizing: "border-box",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
        border: "2px  solid grey",
        margin:"1%",
        float:"right"
    };

    const headerStyle = {
        fontSize: "1.8rem",
        margin: "10px 0",
        color: "#555",
    };

    const activeUsersStyle = {
        fontSize: "1rem",
        margin: "5px 0",
        color: "#666",
    };

    const toolbarStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "center",
        width: "20%",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "10px",
        borderRadius: "8px",
        boxSizing: "border-box",
    };

    const buttonStyle = {
        padding: "8px 12px",
        fontSize: "1rem",
        border: "1px solid #ddd",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
    };

    const buttonActiveStyle = {
        backgroundColor: "#cce4ff",
        borderColor: "#99d3ff",
    };

    const rangeInputStyle = {
        margin: "0 10px",
        width: "80px",
    };

    const canvasStyle = {
        border: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        width: "100%",
        height: "100vh",
    };

    return (
        <div style={containerStyle}>
            {/* <h1 style={headerStyle}>Collaborative Whiteboard</h1> */}
            {/* <p style={activeUsersStyle}>Active Users: {activeUsers}</p> */}

            <div style={toolbarStyle}>
                <div className="hexa" style={{ width: "120px", height: "120px" }}>
                    <label>
                        <HexColorPicker color={color} onChange={setColor} style={{ width: "100%", height: "100%" }} />
                    </label>
                </div>

                <div>
                    <label>
                        <strong>Brush Width:</strong>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={width}
                            onChange={(e) => setWidth(parseInt(e.target.value))}
                            style={rangeInputStyle}
                        />
                        <span>{width}px</span>
                    </label>
                </div>

                <div>
                    <label><strong>Tool:</strong></label>
                    <button
                        style={{ ...buttonStyle, ...(tool === "brush" ? buttonActiveStyle : {}) }}
                        onClick={() => setTool("brush")}
                    >
                        <BrushIcon /> {/* Brush Icon */}
                    </button>
                    <button
                        style={{ ...buttonStyle, ...(tool === "eraser" ? buttonActiveStyle : {}) }}
                        onClick={() => setTool("eraser")}
                    >
                        <DeleteIcon /> {/* Eraser Icon */}
                    </button>
                </div>
            </div>

            <Canvas color={color} width={width} tool={tool} socket={socket} style={canvasStyle} />
        </div>
    );
}

export default WhiteBoard;
