import React, { useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { Button } from '@mui/material';

const canvasStyles = {
  border: '1px solid black',
  borderRadius: '5px',
  marginTop: '20px',
};

const DrawingCanvas = ({ onSave }) => {
  const canvasRef = useRef(null);

  const handleSave = async () => {
    const imageData = await canvasRef.current.exportImage('png');
    onSave(imageData);  // Send the image data back to the parent component
  };

  const handleClear = () => {
    canvasRef.current.clearCanvas();
  };

  return (
    <div>
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={2}
        strokeColor="black"
        canvasColor="#fff"
        width="100%"
        height="300px"
        style={canvasStyles}
      />
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <Button variant="contained" onClick={handleSave}>
          Save Drawing
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
