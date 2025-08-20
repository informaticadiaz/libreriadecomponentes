"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Type, Palette, Monitor, RotateCcw } from 'lucide-react';

// Interfaces para tipado
interface GradientPreset {
  name: string;
  start: string;
  end: string;
}

interface PresetSize {
  name: string;
  width: number;
  height: number;
}

interface DragOffset {
  x: number;
  y: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const InstagramImageCreator = () => {
  // Tipado correcto de los refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Tipado del estado de imagen y drag
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
  
  const [config, setConfig] = useState({
    width: 1080,
    height: 1080,
    backgroundColor: '#6366f1',
    gradientEnabled: false,
    gradientStart: '#6366f1',
    gradientEnd: '#ec4899',
    gradientDirection: 'diagonal',
    backgroundImage: null,
    imageOpacity: 100,
    imageScale: 100,
    imagePositionX: 50,
    imagePositionY: 50,
    backgroundType: 'color' as 'color' | 'gradient' | 'image',
    text: 'Tu mensaje aquí',
    fontSize: 72,
    fontFamily: 'Arial',
    textColor: '#ffffff',
    textAlign: 'center' as 'left' | 'center' | 'right',
    textVerticalAlign: 'middle',
    textPositionX: 50,
    textPositionY: 50,
    textWeight: 'bold',
    textStyle: 'normal' as 'normal' | 'italic',
    textDecoration: 'none' as 'none' | 'underline',
    textTransform: 'none' as 'none' | 'uppercase' | 'lowercase' | 'capitalize',
    lineHeight: 1.2,
    letterSpacing: 0,
    textRotation: 0,
    // Efectos de texto
    textShadowEnabled: true,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowBlur: 4,
    textShadowOffsetX: 2,
    textShadowOffsetY: 2,
    textOutlineEnabled: false,
    textOutlineColor: '#000000',
    textOutlineWidth: 2,
    textBackgroundEnabled: false,
    textBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    textBackgroundPadding: 20,
    textBackgroundRadius: 10
  });

  const presetSizes: PresetSize[] = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1200, height: 675 }
  ];

  const fonts: string[] = [
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Verdana',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS',
    'Courier New',
    'Palatino',
    'Garamond',
    'Bookman',
    'Avant Garde'
  ];

  const gradientPresets: GradientPreset[] = [
    { name: 'Sunset', start: '#ff7e5f', end: '#feb47b' },
    { name: 'Ocean', start: '#667eea', end: '#764ba2' },
    { name: 'Forest', start: '#2c5530', end: '#7bc143' },
    { name: 'Purple', start: '#667eea', end: '#764ba2' },
    { name: 'Pink', start: '#ec4899', end: '#f97316' },
    { name: 'Blue', start: '#3b82f6', end: '#1e40af' }
  ];

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = config.width;
    canvas.height = config.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, config.width, config.height);

    // Dibujar fondo
    if (config.backgroundType === 'image' && loadedImage) {
      // Configurar opacidad
      ctx.globalAlpha = config.imageOpacity / 100;
      
      // Calcular dimensiones escaladas
      const scale = config.imageScale / 100;
      const imgWidth = loadedImage.width * scale;
      const imgHeight = loadedImage.height * scale;
      
      // Calcular posición basada en porcentajes
      const x = (config.width * (config.imagePositionX / 100)) - (imgWidth / 2);
      const y = (config.height * (config.imagePositionY / 100)) - (imgHeight / 2);
      
      ctx.drawImage(loadedImage, x, y, imgWidth, imgHeight);
      
      // Resetear opacidad para el texto
      ctx.globalAlpha = 1;
    } else if (config.backgroundType === 'gradient') {
      const gradient = ctx.createLinearGradient(
        config.gradientDirection === 'horizontal' ? 0 : config.gradientDirection === 'vertical' ? 0 : 0,
        config.gradientDirection === 'horizontal' ? 0 : config.gradientDirection === 'vertical' ? 0 : 0,
        config.gradientDirection === 'horizontal' ? config.width : config.gradientDirection === 'vertical' ? 0 : config.width,
        config.gradientDirection === 'horizontal' ? 0 : config.gradientDirection === 'vertical' ? config.height : config.height
      );
      gradient.addColorStop(0, config.gradientStart);
      gradient.addColorStop(1, config.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, config.width, config.height);
    } else {
      // Color sólido
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, config.width, config.height);
    }

    // Preparar texto transformado
    let processedText = config.text;
    switch (config.textTransform) {
      case 'uppercase':
        processedText = processedText.toUpperCase();
        break;
      case 'lowercase':
        processedText = processedText.toLowerCase();
        break;
      case 'capitalize':
        processedText = processedText.replace(/\b\w/g, l => l.toUpperCase());
        break;
    }

    // Configurar fuente
    const fontStyle = config.textStyle === 'italic' ? 'italic ' : '';
    const fontWeight = config.textWeight === 'bold' ? 'bold ' : '';
    ctx.font = `${fontStyle}${fontWeight}${config.fontSize}px ${config.fontFamily}`;
    ctx.textAlign = config.textAlign as CanvasTextAlign;

    // Dividir texto en líneas
    const words = processedText.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = config.width * 0.8; // 80% del ancho para márgenes

    for (let word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // Calcular posición basada en porcentajes en lugar de alineación
    const lineHeight = config.fontSize * config.lineHeight;
    const totalTextHeight = lines.length * lineHeight;
    
    // Posición base del texto (centro del bloque de texto)
    const baseX = (config.width * config.textPositionX) / 100;
    const baseY = (config.height * config.textPositionY) / 100;
    
    // Ajustar Y para que sea el centro del bloque de texto
    const startY = baseY - (totalTextHeight / 2) + config.fontSize;

    // Configurar punto de rotación (centro del texto)
    const centerX = baseX;
    const centerY = baseY;

    if (config.textRotation !== 0) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((config.textRotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }

    // Dibujar cada línea
    lines.forEach((line, index) => {
      // Calcular X basado en la alineación pero centrado en baseX
      let x: number;
      const textMetrics = ctx.measureText(line);
      const textWidth = textMetrics.width;

      switch (config.textAlign) {
        case 'left':
          x = baseX;
          break;
        case 'right':
          x = baseX;
          break;
        default: // center
          x = baseX;
      }

      const y = startY + (index * lineHeight);

      // Dibujar fondo del texto si está habilitado
      if (config.textBackgroundEnabled) {
        const padding = config.textBackgroundPadding;
        let bgX: number, bgWidth: number;
        
        switch (config.textAlign) {
          case 'left':
            bgX = x - padding;
            bgWidth = textWidth + (padding * 2);
            break;
          case 'right':
            bgX = x - textWidth - padding;
            bgWidth = textWidth + (padding * 2);
            break;
          default: // center
            bgX = x - (textWidth / 2) - padding;
            bgWidth = textWidth + (padding * 2);
        }

        // Mejor cálculo para la posición Y del fondo
        const textAscent = config.fontSize * 0.8;
        const textDescent = config.fontSize * 0.2;
        const bgY = y - textAscent - padding;
        const bgHeight = textAscent + textDescent + (padding * 2);

        ctx.fillStyle = config.textBackgroundColor;
        
        if (config.textBackgroundRadius > 0) {
          // Fondo con bordes redondeados
          ctx.beginPath();
          ctx.roundRect(bgX, bgY, bgWidth, bgHeight, config.textBackgroundRadius);
          ctx.fill();
        } else {
          // Fondo rectangular
          ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
        }
      }

      // Configurar sombra del texto
      if (config.textShadowEnabled) {
        ctx.shadowColor = config.textShadowColor;
        ctx.shadowBlur = config.textShadowBlur;
        ctx.shadowOffsetX = config.textShadowOffsetX;
        ctx.shadowOffsetY = config.textShadowOffsetY;
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // Dibujar outline del texto si está habilitado
      if (config.textOutlineEnabled) {
        ctx.strokeStyle = config.textOutlineColor;
        ctx.lineWidth = config.textOutlineWidth;
        ctx.strokeText(line, x, y);
      }

      // Dibujar el texto principal
      ctx.fillStyle = config.textColor;
      
      if (config.letterSpacing === 0) {
        ctx.fillText(line, x, y);
      } else {
        // Dibujar letra por letra para el espaciado
        let currentX = x;
        const chars = line.split('');
        
        if (config.textAlign === 'center') {
          const totalWidth = chars.reduce((width, char) => {
            return width + ctx.measureText(char).width + config.letterSpacing;
          }, 0) - config.letterSpacing;
          currentX = x - (totalWidth / 2);
        } else if (config.textAlign === 'right') {
          const totalWidth = chars.reduce((width, char) => {
            return width + ctx.measureText(char).width + config.letterSpacing;
          }, 0) - config.letterSpacing;
          currentX = x - totalWidth;
        }

        chars.forEach((char) => {
          if (config.textOutlineEnabled) {
            ctx.strokeText(char, currentX, y);
          }
          ctx.fillText(char, currentX, y);
          currentX += ctx.measureText(char).width + config.letterSpacing;
        });
      }
    });

    // Restaurar transformación si se aplicó rotación
    if (config.textRotation !== 0) {
      ctx.restore();
    }

    // Resetear efectos
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  useEffect(() => {
    drawCanvas();
  }, [config, loadedImage]);

  // Funciones para drag and drop del texto - tipadas correctamente
  const getCanvasMousePosition = (e: MouseEvent): MousePosition => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    const mousePos = getCanvasMousePosition(e);
    
    // Convertir posición del texto a coordenadas del canvas
    const textX = (config.width * config.textPositionX) / 100;
    const textY = (config.height * config.textPositionY) / 100;
    
    // Área aproximada del texto (usamos el fontSize como referencia para el área clickeable)
    const textAreaSize = config.fontSize * 2; // Área más grande para facilitar el click
    
    // Verificar si el click está cerca del texto
    const distanceX = Math.abs(mousePos.x - textX);
    const distanceY = Math.abs(mousePos.y - textY);
    
    if (distanceX <= textAreaSize && distanceY <= textAreaSize) {
      setIsDragging(true);
      setDragOffset({
        x: mousePos.x - textX,
        y: mousePos.y - textY
      });
      
      // Cambiar cursor
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const mousePos = getCanvasMousePosition(e);
    
    if (isDragging) {
      // Calcular nueva posición
      const newX = mousePos.x - dragOffset.x;
      const newY = mousePos.y - dragOffset.y;
      
      // Convertir a porcentajes y limitar a los bordes del canvas
      const newPositionX = Math.max(0, Math.min(100, (newX / config.width) * 100));
      const newPositionY = Math.max(0, Math.min(100, (newY / config.height) * 100));
      
      setConfig(prev => ({
        ...prev,
        textPositionX: newPositionX,
        textPositionY: newPositionY
      }));
    } else {
      // Verificar si el mouse está sobre el texto para cambiar cursor
      const textX = (config.width * config.textPositionX) / 100;
      const textY = (config.height * config.textPositionY) / 100;
      const textAreaSize = config.fontSize * 2;
      
      const distanceX = Math.abs(mousePos.x - textX);
      const distanceY = Math.abs(mousePos.y - textY);
      
      if (canvasRef.current) {
        if (distanceX <= textAreaSize && distanceY <= textAreaSize) {
          canvasRef.current.style.cursor = 'grab';
        } else {
          canvasRef.current.style.cursor = 'default';
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'default';
      }
    }
  };

  // Event listeners para el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, dragOffset, config.textPositionX, config.textPositionY, config.fontSize, config.width, config.height]);

  // Tipado correcto del evento de carga de imagen
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const img = new Image();
          img.onload = () => {
            setLoadedImage(img);
            setConfig(prev => ({ ...prev, backgroundType: 'image' }));
          };
          img.src = result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setLoadedImage(null);
    setConfig(prev => ({ ...prev, backgroundType: 'color' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'instagram-post.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const resetToDefaults = () => {
    setConfig({
      width: 1080,
      height: 1080,
      backgroundColor: '#6366f1',
      gradientEnabled: false,
      gradientStart: '#6366f1',
      gradientEnd: '#ec4899',
      gradientDirection: 'diagonal',
      backgroundImage: null,
      imageOpacity: 100,
      imageScale: 100,
      imagePositionX: 50,
      imagePositionY: 50,
      backgroundType: 'color',
      text: 'Tu mensaje aquí',
      fontSize: 72,
      fontFamily: 'Arial',
      textColor: '#ffffff',
      textAlign: 'center',
      textVerticalAlign: 'middle',
      textPositionX: 50,
      textPositionY: 50,
      textWeight: 'bold',
      textStyle: 'normal',
      textDecoration: 'none',
      textTransform: 'none',
      lineHeight: 1.2,
      letterSpacing: 0,
      textRotation: 0,
      textShadowEnabled: true,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowBlur: 4,
      textShadowOffsetX: 2,
      textShadowOffsetY: 2,
      textOutlineEnabled: false,
      textOutlineColor: '#000000',
      textOutlineWidth: 2,
      textBackgroundEnabled: false,
      textBackgroundColor: 'rgba(0, 0, 0, 0.5)',
      textBackgroundPadding: 20,
      textBackgroundRadius: 10
    });
    setLoadedImage(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Tipado correcto del parámetro
  const applyGradientPreset = (preset: GradientPreset) => {
    setConfig(prev => ({
      ...prev,
      gradientStart: preset.start,
      gradientEnd: preset.end,
      backgroundType: 'gradient'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Creador de Imágenes para Instagram
          </h1>
          <p className="text-gray-600">
            Diseña posts atractivos para redes sociales de manera fácil y rápida
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de Control */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tamaños Preestablecidos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-indigo-600" />
                Tamaño de Imagen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {presetSizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setConfig(prev => ({ ...prev, width: size.width, height: size.height }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      config.width === size.width && config.height === size.height
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {size.name}
                    <div className="text-xs text-gray-500 mt-1">
                      {size.width} × {size.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuración de Fondo */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-indigo-600" />
                Fondo
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={config.backgroundType === 'color'}
                      onChange={() => setConfig(prev => ({ ...prev, backgroundType: 'color' }))}
                      className="mr-2"
                    />
                    Color sólido
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={config.backgroundType === 'gradient'}
                      onChange={() => setConfig(prev => ({ ...prev, backgroundType: 'gradient' }))}
                      className="mr-2"
                    />
                    Gradiente
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={config.backgroundType === 'image'}
                      onChange={() => setConfig(prev => ({ ...prev, backgroundType: 'image' }))}
                      className="mr-2"
                    />
                    Imagen
                  </label>
                </div>

                {config.backgroundType === 'color' && (
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700">Color:</label>
                    <input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-8 rounded border border-gray-300"
                    />
                  </div>
                )}

                {config.backgroundType === 'gradient' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {gradientPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyGradientPreset(preset)}
                          className="h-12 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-colors"
                          style={{
                            background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`
                          }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Inicio:</label>
                        <input
                          type="color"
                          value={config.gradientStart}
                          onChange={(e) => setConfig(prev => ({ ...prev, gradientStart: e.target.value }))}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Final:</label>
                        <input
                          type="color"
                          value={config.gradientEnd}
                          onChange={(e) => setConfig(prev => ({ ...prev, gradientEnd: e.target.value }))}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Dirección:</label>
                      <select
                        value={config.gradientDirection}
                        onChange={(e) => setConfig(prev => ({ ...prev, gradientDirection: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                        <option value="diagonal">Diagonal</option>
                      </select>
                    </div>
                  </div>
                )}

                {config.backgroundType === 'image' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Subir imagen:</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {loadedImage && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Imagen cargada</span>
                          <button
                            onClick={removeImage}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Opacidad: {config.imageOpacity}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={config.imageOpacity}
                            onChange={(e) => setConfig(prev => ({ ...prev, imageOpacity: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Escala: {config.imageScale}%
                          </label>
                          <input
                            type="range"
                            min="20"
                            max="200"
                            value={config.imageScale}
                            onChange={(e) => setConfig(prev => ({ ...prev, imageScale: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Posición X: {config.imagePositionX}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={config.imagePositionX}
                              onChange={(e) => setConfig(prev => ({ ...prev, imagePositionX: parseInt(e.target.value) }))}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Posición Y: {config.imagePositionY}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={config.imagePositionY}
                              onChange={(e) => setConfig(prev => ({ ...prev, imagePositionY: parseInt(e.target.value) }))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Configuración de Texto */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-indigo-600" />
                Texto
              </h3>
              
              <div className="space-y-6">
                {/* Contenido del texto */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Mensaje:</label>
                  <textarea
                    value={config.text}
                    onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                {/* Fuente y Tamaño */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Fuente:</label>
                    <select
                      value={config.fontFamily}
                      onChange={(e) => setConfig(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      {fonts.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Tamaño: {config.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      value={config.fontSize}
                      onChange={(e) => setConfig(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Estilo de Fuente */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Estilo:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <select
                      value={config.textWeight}
                      onChange={(e) => setConfig(prev => ({ ...prev, textWeight: e.target.value }))}
                      className="p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Negrita</option>
                    </select>
                    
                    <select
                      value={config.textStyle}
                      onChange={(e) => setConfig(prev => ({ ...prev, textStyle: e.target.value as 'normal' | 'italic' }))}
                      className="p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="italic">Cursiva</option>
                    </select>

                    <select
                      value={config.textTransform}
                      onChange={(e) => setConfig(prev => ({ ...prev, textTransform: e.target.value as 'none' | 'uppercase' | 'lowercase' | 'capitalize' }))}
                      className="p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="none">Original</option>
                      <option value="uppercase">MAYÚSCULAS</option>
                      <option value="lowercase">minúsculas</option>
                      <option value="capitalize">Capitalizado</option>
                    </select>

                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                      title="Color del texto"
                    />
                  </div>
                </div>

                {/* Alineación y Posición */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Posición del texto:
                  </label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-yellow-700">
                      💡 <strong>Arrastra el texto</strong> directamente en la vista previa para posicionarlo
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Posición X: {config.textPositionX.toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={config.textPositionX}
                        onChange={(e) => setConfig(prev => ({ ...prev, textPositionX: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Posición Y: {config.textPositionY.toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={config.textPositionY}
                        onChange={(e) => setConfig(prev => ({ ...prev, textPositionY: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Alineación:</label>
                      <select
                        value={config.textAlign}
                        onChange={(e) => setConfig(prev => ({ ...prev, textAlign: e.target.value as 'left' | 'center' | 'right' }))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="left">Izquierda</option>
                        <option value="center">Centro</option>
                        <option value="right">Derecha</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Espaciado y Rotación */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Altura de línea: {config.lineHeight}
                    </label>
                    <input
                      type="range"
                      min="0.8"
                      max="2.5"
                      step="0.1"
                      value={config.lineHeight}
                      onChange={(e) => setConfig(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Espaciado letras: {config.letterSpacing}px
                    </label>
                    <input
                      type="range"
                      min="-5"
                      max="20"
                      value={config.letterSpacing}
                      onChange={(e) => setConfig(prev => ({ ...prev, letterSpacing: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Rotación: {config.textRotation}°
                    </label>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      value={config.textRotation}
                      onChange={(e) => setConfig(prev => ({ ...prev, textRotation: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Efectos de Texto */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Efectos de Texto</h4>
                  
                  {/* Sombra */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.textShadowEnabled}
                        onChange={(e) => setConfig(prev => ({ ...prev, textShadowEnabled: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Sombra</span>
                    </label>

                    {config.textShadowEnabled && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-6">
                        <input
                          type="color"
                          value={config.textShadowColor.includes('rgba') ? '#000000' : config.textShadowColor}
                          onChange={(e) => setConfig(prev => ({ ...prev, textShadowColor: e.target.value }))}
                          className="w-full h-8 rounded border"
                          title="Color de sombra"
                        />
                        <div>
                          <label className="text-xs text-gray-600">Desenfoque: {config.textShadowBlur}</label>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={config.textShadowBlur}
                            onChange={(e) => setConfig(prev => ({ ...prev, textShadowBlur: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Offset X: {config.textShadowOffsetX}</label>
                          <input
                            type="range"
                            min="-10"
                            max="10"
                            value={config.textShadowOffsetX}
                            onChange={(e) => setConfig(prev => ({ ...prev, textShadowOffsetX: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Offset Y: {config.textShadowOffsetY}</label>
                          <input
                            type="range"
                            min="-10"
                            max="10"
                            value={config.textShadowOffsetY}
                            onChange={(e) => setConfig(prev => ({ ...prev, textShadowOffsetY: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Borde */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.textOutlineEnabled}
                        onChange={(e) => setConfig(prev => ({ ...prev, textOutlineEnabled: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Borde</span>
                    </label>

                    {config.textOutlineEnabled && (
                      <div className="grid grid-cols-2 gap-3 pl-6">
                        <input
                          type="color"
                          value={config.textOutlineColor}
                          onChange={(e) => setConfig(prev => ({ ...prev, textOutlineColor: e.target.value }))}
                          className="w-full h-8 rounded border"
                          title="Color del borde"
                        />
                        <div>
                          <label className="text-xs text-gray-600 block">Grosor: {config.textOutlineWidth}px</label>
                          <input
                            type="range"
                            min="1"
                            max="8"
                            value={config.textOutlineWidth}
                            onChange={(e) => setConfig(prev => ({ ...prev, textOutlineWidth: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fondo del Texto */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.textBackgroundEnabled}
                        onChange={(e) => setConfig(prev => ({ ...prev, textBackgroundEnabled: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Fondo del texto</span>
                    </label>

                    {config.textBackgroundEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-6">
                        <input
                          type="color"
                          value={config.textBackgroundColor.includes('rgba') ? '#000000' : config.textBackgroundColor}
                          onChange={(e) => setConfig(prev => ({ ...prev, textBackgroundColor: e.target.value }))}
                          className="w-full h-8 rounded border"
                          title="Color de fondo"
                        />
                        <div>
                          <label className="text-xs text-gray-600 block">Padding: {config.textBackgroundPadding}px</label>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            value={config.textBackgroundPadding}
                            onChange={(e) => setConfig(prev => ({ ...prev, textBackgroundPadding: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block">Radio: {config.textBackgroundRadius}px</label>
                          <input
                            type="range"
                            min="0"
                            max="30"
                            value={config.textBackgroundRadius}
                            onChange={(e) => setConfig(prev => ({ ...prev, textBackgroundRadius: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vista Previa y Controles */}
          <div className="space-y-6">
            {/* Vista Previa */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
              <div className="flex justify-center">
                <div className="border border-gray-200 rounded-lg overflow-hidden relative">
                  <canvas
                    ref={canvasRef}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'block',
                      cursor: isDragging ? 'grabbing' : 'default'
                    }}
                  />
                  {isDragging && (
                    <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      Arrastrando texto...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-3">
                <button
                  onClick={downloadImage}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Descargar Imagen
                </button>
                
                <button
                  onClick={resetToDefaults}
                  className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Resetear
                </button>
              </div>
            </div>

            {/* Información */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Consejos:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Usa textos cortos para mayor impacto</li>
                <li>• Combina sombras y bordes para mejor legibilidad</li>
                <li>• El fondo del texto ayuda en imágenes complejas</li>
                <li>• Ajusta la opacidad de la imagen para mejor contraste</li>
                <li>• Experimenta con rotaciones sutiles (-15° a 15°)</li>
                <li>• El espaciado entre letras puede crear efectos únicos</li>
                <li>• Usa mayúsculas para títulos impactantes</li>
                <li>• Las imágenes se descargan en alta calidad</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramImageCreator;