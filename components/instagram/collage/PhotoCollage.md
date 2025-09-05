"use client";

import React, { useState, useRef } from 'react';
import { Upload, Download, X, Grid, Camera, RotateCcw } from 'lucide-react';

export const PhotoCollage = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState('grid-2x2');
  const [showBirthday, setShowBirthday] = useState(false);
  const [birthdayText, setBirthdayText] = useState('¡Feliz Cumpleaños!');
  const [textStyle, setTextStyle] = useState('gradient');
  const fileInputRef = useRef(null);

  const textStyles = {
    gradient: {
      name: '🌈 Gradiente Animado',
      style: {
        background: 'linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8)',
        backgroundSize: '300% 300%',
        animation: 'gradient-animation 3s ease infinite',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '24px',
        fontWeight: '900',
        fontFamily: 'Arial, sans-serif',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        letterSpacing: '1px',
        transform: 'rotate(-5deg)',
      }
    },
    neon: {
      name: '✨ Neón Brillante',
      style: {
        color: '#fff',
        fontSize: '22px',
        fontWeight: '900',
        fontFamily: 'Arial, sans-serif',
        textShadow: '0 0 8px #ff00ff, 0 0 16px #ff00ff, 0 0 24px #ff00ff, 0 0 32px #ff00ff',
        letterSpacing: '2px',
        transform: 'rotate(-3deg)',
        animation: 'neon-glow 2s ease-in-out infinite alternate'
      }
    },
    retro: {
      name: '🕹️ Retro 80s',
      style: {
        background: 'linear-gradient(45deg, #ff0080, #8000ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '20px',
        fontWeight: '900',
        fontFamily: 'Courier New, monospace',
        textShadow: '2px 2px 0px #00ffff, 4px 4px 0px rgba(0,255,255,0.5)',
        letterSpacing: '2px',
        transform: 'skew(-10deg)',
      }
    },
    shadow3d: {
      name: '🎯 Sombra 3D',
      style: {
        color: '#fff',
        fontSize: '24px',
        fontWeight: '900',
        fontFamily: 'Impact, Arial, sans-serif',
        textShadow: '1px 1px 0px #ff6b6b, 2px 2px 0px #ff6b6b, 3px 3px 0px #ff6b6b, 4px 4px 0px #ff6b6b, 5px 5px 8px rgba(0,0,0,0.6)',
        letterSpacing: '1px',
        transform: 'rotate(-2deg)',
      }
    },
    rainbow: {
      name: '🌈 Arcoíris Estático',
      style: {
        background: 'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '22px',
        fontWeight: '900',
        fontFamily: 'Comic Sans MS, Arial, sans-serif',
        letterSpacing: '1px',
        transform: 'rotate(-1deg)',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }
    },
    elegant: {
      name: '💎 Elegante Dorado',
      style: {
        background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '22px',
        fontWeight: '700',
        fontFamily: 'Georgia, serif',
        letterSpacing: '2px',
        textShadow: '2px 2px 8px rgba(255,215,0,0.5)',
        fontStyle: 'italic'
      }
    },
    cartoon: {
      name: '🎪 Cartoon Divertido',
      style: {
        color: '#fff',
        fontSize: '20px',
        fontWeight: '900',
        fontFamily: 'Comic Sans MS, Arial, sans-serif',
        textShadow: '2px 2px 0px #ff69b4, -1px -1px 0px #00bfff, 0px 0px 8px rgba(0,0,0,0.5)',
        letterSpacing: '1px',
        transform: 'rotate(-8deg) scale(1.1)',
        animation: 'bounce 2s ease-in-out infinite'
      }
    }
  };

  const layouts = {
    'grid-2x2': {
      name: 'Grid 2x2',
      slots: 4,
      gridClass: 'grid-cols-2',
      cols: 2,
      rows: 2,
      textPosition: 2 // Después de las primeras 2 fotos
    },
    'grid-3x3': {
      name: 'Grid 3x3', 
      slots: 9,
      gridClass: 'grid-cols-3',
      cols: 3,
      rows: 3,
      textPosition: 4 // Después de las primeras 4 fotos (fila del medio)
    },
    'horizontal': {
      name: 'Horizontal',
      slots: 4,
      gridClass: 'grid-cols-4',
      cols: 4,
      rows: 1,
      textPosition: 2 // En el medio de la fila
    },
    'vertical': {
      name: 'Vertical',
      slots: 3,
      gridClass: 'grid-cols-1',
      cols: 1,
      rows: 3,
      textPosition: 1 // En el medio vertical
    },
    'magazine': {
      name: 'Revista',
      slots: 6,
      gridClass: 'grid-cols-2',
      cols: 2,
      rows: 3,
      textPosition: 2 // Después de la primera fila
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target.result) {
            const newPhoto = {
              id: Date.now() + Math.random(),
              src: e.target.result,
              name: file.name
            };
            setPhotos(prev => [...prev, newPhoto]);
          }
        };
        reader.onerror = (error) => {
          console.error('Error loading file:', file.name, error);
        };
        reader.readAsDataURL(file);
      }
    });

    event.target.value = '';
  };

  const removePhoto = (photoId) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
  };

  const clearAllPhotos = () => {
    setPhotos([]);
  };

  const drawImageToFit = (ctx, img, x, y, width, height) => {
    const imgAspect = img.width / img.height;
    const slotAspect = width / height;

    let drawWidth, drawHeight, drawX, drawY;

    if (imgAspect > slotAspect) {
      drawHeight = height;
      drawWidth = height * imgAspect;
      drawX = x - (drawWidth - width) / 2;
      drawY = y;
    } else {
      drawWidth = width;
      drawHeight = width / imgAspect;
      drawX = x;
      drawY = y - (drawHeight - height) / 2;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    // Borde sutil
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  };

  const downloadCollage = async () => {
    const layout = layouts[selectedLayout];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Tamaño del canvas 
    const scale = 2;
    const textHeight = (showBirthday && birthdayText) ? 100 : 0;
    const canvasHeight = 800 + textHeight;
    canvas.width = 800 * scale;
    canvas.height = canvasHeight * scale;
    ctx.scale(scale, scale);

    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, canvasHeight);

    const cellWidth = 800 / layout.cols;
    const cellHeight = 800 / layout.rows;
    const displayPhotos = photos.slice(0, layout.slots);

    if (displayPhotos.length === 0) {
      // Collage vacío
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 800, canvasHeight);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Collage Vacío', 400, canvasHeight / 2);

      const link = document.createElement('a');
      link.download = `collage-vacio-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      return;
    }

    // 🔑 Calculamos UNA VEZ la posición Y del texto dentro de la grilla
    const textRowIndex = Math.floor(layout.textPosition / layout.cols);
    const textY = textRowIndex * cellHeight + (cellHeight / 2) + 50; // mismo +50 que usabas

    let loadedImages = 0;
    const totalImages = displayPhotos.length;
    let currentImageIndex = 0;

    // Función para dibujar el texto (se llamará SOLO al final)
    const drawText = (yPosition) => {
      if (!showBirthday || !birthdayText) return;

      // Fondo para el texto
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, yPosition - 40, 800, 80);

      // Borde del área de texto
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, yPosition - 40, 800, 80);

      let fontSize = 38;
      let fontFamily = 'Arial, sans-serif';
      let fillStyle = '#ff6b6b';
      let strokeStyle = '#ffffff';

      // Ajustar según el estilo
      switch(textStyle) {
        case 'neon':
          fontSize = 36;
          fillStyle = '#ffffff';
          break;
        case 'retro':
          fontSize = 34;
          fontFamily = 'Courier New, monospace';
          fillStyle = '#ff0080';
          break;
        case 'shadow3d':
          fontSize = 38;
          fontFamily = 'Impact, Arial, sans-serif';
          fillStyle = '#ffffff';
          break;
        case 'rainbow':
          fontSize = 36;
          fontFamily = 'Comic Sans MS, Arial, sans-serif';
          const rainbowGradient = ctx.createLinearGradient(0, yPosition - 20, 800, yPosition + 20);
          rainbowGradient.addColorStop(0, '#ff0000');
          rainbowGradient.addColorStop(0.16, '#ff7f00');
          rainbowGradient.addColorStop(0.33, '#ffff00');
          rainbowGradient.addColorStop(0.5, '#00ff00');
          rainbowGradient.addColorStop(0.66, '#0000ff');
          rainbowGradient.addColorStop(0.83, '#4b0082');
          rainbowGradient.addColorStop(1, '#9400d3');
          fillStyle = rainbowGradient;
          break;
        case 'elegant':
          fontSize = 36;
          fontFamily = 'Georgia, serif';
          const goldGradient = ctx.createLinearGradient(0, yPosition - 20, 800, yPosition + 20);
          goldGradient.addColorStop(0, '#ffd700');
          goldGradient.addColorStop(0.5, '#ffed4e');
          goldGradient.addColorStop(1, '#ffd700');
          fillStyle = goldGradient;
          break;
        case 'cartoon':
          fontSize = 34;
          fontFamily = 'Comic Sans MS, Arial, sans-serif';
          fillStyle = '#ffffff';
          break;
        default: // gradient
          const gradient = ctx.createLinearGradient(0, yPosition - 20, 800, yPosition + 20);
          gradient.addColorStop(0, '#ff6b6b');
          gradient.addColorStop(0.2, '#ffd93d');
          gradient.addColorStop(0.4,