import React, { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styles
import UserIcon from "./user.png";

// Add undo/redo icons using Quill icons
const UndoIcon = () => <i className="fa fa-undo" />;
const RedoIcon = () => <i className="fa fa-redo" />;

const App = () => {
  const [text, setText] = useState(""); // State to manage text in editor
  const [showToolbar, setShowToolbar] = useState(false); // State to control the inline toolbar
  const [selectionRange, setSelectionRange] = useState(null); // Store text selection range
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 }); // State to position toolbar
  const quillRef = useRef(null); // Ref to access Quill instance
  const [rate, setRate] = useState(50); // State to manage the rate slider

  // Quill modules configuration
  const modules = {
    toolbar: false, // Disable the default toolbar
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };

  // Add custom functionality to Undo and Redo
  const handleUndo = () => {
    const editor = quillRef.current.getEditor();
    editor.history.undo();
  };

  const handleRedo = () => {
    const editor = quillRef.current.getEditor();
    editor.history.redo();
  };

  // Show inline toolbar when text is selected
  const handleSelectionChange = (range, oldRange, source) => {
    if (range && range.length > 0) {
      setSelectionRange(range);
      setShowToolbar(true);
      positionToolbar(range); // Position the toolbar
    } else {
      setShowToolbar(false);
    }
  };

  // Function to position the toolbar directly below the selected text
  const positionToolbar = (range) => {
    const editor = quillRef.current.getEditor();

    // Make sure quillRef and its container are available
    if (editor && quillRef.current && quillRef.current.container) {
      const bounds = editor.getBounds(range.index, range.length); // Get bounds of the selection
      const editorContainer = quillRef.current.container.getBoundingClientRect(); // Get editor's position on the screen

      setToolbarPosition({
        top: editorContainer.top + bounds.bottom + window.scrollY, // Position toolbar below the selected text
        left: editorContainer.left + bounds.left + window.scrollX,
      });
    }
  };

  // Apply bold formatting
  const applyBold = () => {
    const editor = quillRef.current.getEditor();
    editor.format("bold", true);
  };

  // Apply rate (highlight text with specific color)
  const applyRate = () => {
    const editor = quillRef.current.getEditor();
    editor.format("background", `rgba(255, 255, 0, ${rate / 100})`); // Use a yellowish background based on rate
  };

  // Add comment to selected text
  const addComment = () => {
    const editor = quillRef.current.getEditor();
    const comment = prompt("Add your comment:");
    if (comment) {
      editor.format("background", "#d3d3d3"); // Highlight the text with a light grey background
      alert(`Comment added: "${comment}"`);
    }
  };

  return (
    <div style={{ backgroundColor: "#222", color: "#fff", padding: "20px" }}>
      {/* Header and settings */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
          <img src={UserIcon} alt="User Icon" style={{ width: "50px", borderRadius: "50%" }} />
          <span style={{ fontSize: "24px", marginLeft: "10px" }}>Adele</span>
        </div>
        {/* Pitch, Volume, Rate Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div>
            <label style={{ marginRight: "5px" }}>Pitch</label>
            <input type="number" min="0.1" max="2.0" step="0.1" defaultValue="1.0" />
          </div>
          <div>
            <label style={{ marginRight: "5px" }}>Volume</label>
            <input type="number" min="0.1" max="2.0" step="0.1" defaultValue="1.0" />
          </div>
          <div>
            <label style={{ marginRight: "5px" }}>Rate</label>
            <input type="number" min="0.1" max="2.0" step="0.1" defaultValue="1.0" />
          </div>
        </div>
      </div>

      {/* Text Editor */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={text}
        onChange={setText}
        modules={modules}
        style={{
          backgroundColor: "#333",
          color: "#fff",
          borderRadius: "5px",
          padding: "10px",
          minHeight: "100px",
        }}
        onChangeSelection={handleSelectionChange}
      />

      {/* Undo and Redo Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={handleUndo} style={{ cursor: "pointer" }}>
          <UndoIcon /> Undo
        </button>
        <button onClick={handleRedo} style={{ cursor: "pointer" }}>
          <RedoIcon /> Redo
        </button>
      </div>

      {/* Inline Toolbar */}
      {showToolbar && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#555",
            padding: "10px",
            borderRadius: "5px",
            display: "flex",
            gap: "10px",
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            zIndex: 10,
          }}
        >
          <button onClick={applyBold}>Bold</button>
          <div>
            <label>Rate:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              onMouseUp={applyRate}
            />
          </div>
          <button onClick={addComment}>Comment</button>
        </div>
      )}
    </div>
  );
};

export default App;
