import React, { useState, useRef, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { imageEffects } from './effects/imageEffects';
import { videoEffects } from './effects/videoEffects';
import './ImageVideoEditor.scss';

const ImageVideoEditor: React.FC = () => {
  const [editorType, setEditorType] = useState<string>('');
  const [file, setFile] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleTypeChange = (event: SelectChangeEvent) => {
    setEditorType(event.target.value as string);
    setFile(null);
  };

  const handleFileChange = (file: File) => {
    setFile(URL.createObjectURL(file));
  };

  const applyImageEffect = (effect: (ctx: CanvasRenderingContext2D) => void) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        effect(ctx);
        setFile(canvas.toDataURL());
      };
      img.src = file as string;
    }
  };

  const applyVideoEffect = (effect: (video: HTMLVideoElement) => void) => {
    if (videoRef.current) {
      effect(videoRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file);
    };
  }, [file]);

  return (
    <div className="image-video-editor">
      <div className="editor-controls">
        <FormControl fullWidth>
          <InputLabel>Tipo di Editor</InputLabel>
          <Select
            value={editorType}
            label="Tipo di Editor"
            onChange={handleTypeChange}
          >
            <MenuItem value="image">Editor di Immagini</MenuItem>
            <MenuItem value="video">Editor di Video</MenuItem>
          </Select>
        </FormControl>
      </div>

      {editorType && (
        <div className="file-uploader">
          <FileUploader handleChange={handleFileChange} name="file" types={editorType === "image" ? ["PNG", "JPG"] : ["MP4", "AVI"]} />
        </div>
      )}

      {file && (
        <div className="preview">
          {editorType === "image" ? (
            <img src={file} alt="Immagine caricata" />
          ) : (
            <video ref={videoRef} src={file} controls />
          )}
        </div>
      )}

      {file && (
        <div className="effects-container">
          {editorType === "image" && imageEffects.map((effect, index) => (
            <button key={index} className="image-effect" onClick={() => applyImageEffect(effect.func)}>
              {effect.name}
            </button>
          ))}
          {editorType === "video" && videoEffects.map((effect, index) => (
            <button key={index} className="video-effect" onClick={() => applyVideoEffect(effect.func)}>
              {effect.name}
            </button>
          ))}
        </div>
      )}

      <canvas ref={canvasRef} style={{display: 'none'}} />
    </div>
  );
};

export default ImageVideoEditor;