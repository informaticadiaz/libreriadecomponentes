"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Type, Palette, Monitor, RotateCcw } from 'lucide-react';

// Tipos para las configuraciones
interface PresetSize {
  name: string;
  width: number;
  height: number;
}

interface GradientPreset {
  name: string;
  start: string;
  end: string;
}

interface Config {
  width: number;
  height: number;
  backgroundColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: 'horizontal' | 'vertical' | 'diagonal';
  imageOpacity: number;
  imageScale: number;
  imagePositionX: number;
  imagePositionY: number;
  backgroundType: 'color' | 'gradient' | 'image';
}

interface TextElement {
  id: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  textAlign: 'left' | 'center' | 'right';
  textPositionX: number;
  textPositionY: number;
  textWeight: 'normal' | 'bold';
  textStyle: 'normal' | 'italic';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  lineHeight: number;
  letterSpacing: number;
  textRotation: number;
  textShadowEnabled: boolean;
  textShadowColor: string;
  textShadowBlur: number;
  textShadowOffsetX: number;
  textShadowOffsetY: number;
  textOutlineEnabled: boolean;
  textOutlineColor: string;
  textOutlineWidth: number;
  textBackgroundEnabled: boolean;
  textBackgroundColor: string;
  textBackgroundPadding: number;
  textBackgroundRadius: number;
}

interface DragOffset {
  x: number;
  y: number;
}

interface MousePosition {
  x: number;
  y: number;
}

// Componente principal
const InstagramImageCreator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
  const [draggedTextId, setDraggedTextId] = useState<number | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<number>(0);

  const [config, setConfig] = useState<Config>({
    width: 1080,
    height: 1080,
    backgroundColor: '#6366f1',
    gradientStart: '#6366f1',
    gradientEnd: '#ec4899',
    gradientDirection: 'diagonal',
    imageOpacity: 100,
    imageScale: 100,
    imagePositionX: 50,
    imagePositionY: 50,
    backgroundType: 'color'
  });

  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: 0,
      text: 'Tu mensaje aquí',
      fontSize: 72,
      fontFamily: 'Arial',
      textColor: '#ffffff',
      textAlign: 'center',
      textPositionX: 50,
      textPositionY: 50,
      textWeight: 'bold',
      textStyle: 'normal',
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
    }
  ]);

  const presetSizes: PresetSize[] = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1200, height: 675 }
  ];

  const fonts: string[] = [
    'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana', 'Impact',
    'Comic Sans MS', 'Trebuchet MS', 'Courier New', 'Palatino', 'Garamond'
  ];

  const gradientPresets: GradientPreset[] = [
    { name: 'Sunset', start: '#ff7e5f', end: '#feb47b' },
    { name: 'Ocean', start: '#667eea', end: '#764ba2' },
    { name: 'Forest', start: '#2c5530', end: '#7bc143' },
    { name: 'Purple', start: '#667eea', end: '#764ba2' },
    { name: 'Pink', start: '#ec4899', end: '#f97316' },
    { name: 'Blue', start: '#3b82f6', end: '#1e40af' }
  ];

  const getSelectedText = (): TextElement => {
    return textElements.find(t => t.id === selectedTextId) || textElements[0];
  };

  const updateSelectedText = (updates: Partial<TextElement>): void => {
    setTextElements(prev => prev.map(text => 
      text.id === selectedTextId ? { ...text, ...updates } : text
    ));
  };

  const addNewText = (): void => {
    const newId = Math.max(...textElements.map(t => t.id)) + 1;
    const newText: TextElement = {
      id: newId,
      text: 'Nuevo texto',
      fontSize: 72,
      fontFamily: 'Arial',
      textColor: '#ffffff',
      textAlign: 'center',
      textPositionX: 50,
      textPositionY: 30 + (textElements.length * 15),
      textWeight: 'bold',
      textStyle: 'normal',
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
    };
    
    setTextElements(prev => [...prev, newText]);
    setSelectedTextId(newId);
  };

  const deleteText = (id: number): void => {
    if (textElements.length > 1) {
      setTextElements(prev => prev.filter(text => text.id !== id));
      if (selectedTextId === id) {
        const remaining = textElements.filter(text => text.id !== id);
        setSelectedTextId(remaining[0]?.id || 0);
      }
    }
  };

  const drawTextElement = (
    ctx: CanvasRenderingContext2D, 
    textElement: TextElement, 
    isSelected: boolean = false
  ): void => {
    let processedText = textElement.text;
    switch (textElement.textTransform) {
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

    const fontStyle = textElement.textStyle === 'italic' ? 'italic ' : '';
    const fontWeight = textElement.textWeight === 'bold' ? 'bold ' : '';
    ctx.font = `${fontStyle}${fontWeight}${textElement.fontSize}px ${textElement.fontFamily}`;
    ctx.textAlign = textElement.textAlign;

    const words = processedText.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = config.width * 0.8;

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

    const lineHeight = textElement.fontSize * textElement.lineHeight;
    const totalTextHeight = lines.length * lineHeight;
    const baseX = (config.width * textElement.textPositionX) / 100;
    const baseY = (config.height * textElement.textPositionY) / 100;
    const startY = baseY - (totalTextHeight / 2) + textElement.fontSize;

    if (textElement.textRotation !== 0) {
      ctx.save();
      ctx.translate(baseX, baseY);
      ctx.rotate((textElement.textRotation * Math.PI) / 180);
      ctx.translate(-baseX, -baseY);
    }

    lines.forEach((line, index) => {
      let x = baseX;
      const textMetrics = ctx.measureText(line);
      const textWidth = textMetrics.width;
      const y = startY + (index * lineHeight);

      // Fondo del texto
      if (textElement.textBackgroundEnabled) {
        const padding = textElement.textBackgroundPadding;
        let bgX: number, bgWidth: number;
        
        switch (textElement.textAlign) {
          case 'left':
            bgX = x - padding;
            bgWidth = textWidth + (padding * 2);
            break;
          case 'right':
            bgX = x - textWidth - padding;
            bgWidth = textWidth + (padding * 2);
            break;
          default:
            bgX = x - (textWidth / 2) - padding;
            bgWidth = textWidth + (padding * 2);
        }

        const textAscent = textElement.fontSize * 0.8;
        const textDescent = textElement.fontSize * 0.2;
        const bgY = y - textAscent - padding;
        const bgHeight = textAscent + textDescent + (padding * 2);

        ctx.fillStyle = textElement.textBackgroundColor;
        
        if (textElement.textBackgroundRadius > 0) {
          ctx.beginPath();
          ctx.roundRect(bgX, bgY, bgWidth, bgHeight, textElement.textBackgroundRadius);
          ctx.fill();
        } else {
          ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
        }
      }

      // Sombra
      if (textElement.textShadowEnabled) {
        ctx.shadowColor = textElement.textShadowColor;
        ctx.shadowBlur = textElement.textShadowBlur;
        ctx.shadowOffsetX = textElement.textShadowOffsetX;
        ctx.shadowOffsetY = textElement.textShadowOffsetY;
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // Borde
      if (textElement.textOutlineEnabled) {
        ctx.strokeStyle = textElement.textOutlineColor;
        ctx.lineWidth = textElement.textOutlineWidth;
        ctx.strokeText(line, x, y);
      }

      // Texto principal
      ctx.fillStyle = textElement.textColor;
      
      if (textElement.letterSpacing === 0) {
        ctx.fillText(line, x, y);
      } else {
        let currentX = x;
        const chars = line.split('');
        
        if (textElement.textAlign === 'center') {
          const totalWidth = chars.reduce((width, char) => {
            return width + ctx.measureText(char).width + textElement.letterSpacing;
          }, 0) - textElement.letterSpacing;
          currentX = x - (totalWidth / 2);
        } else if (textElement.textAlign === 'right') {
          const totalWidth = chars.reduce((width, char) => {
            return width + ctx.measureText(char).width + textElement.letterSpacing;
          }, 0) - textElement.letterSpacing;
          currentX = x - totalWidth;
        }

        chars.forEach((char) => {
          if (textElement.textOutlineEnabled) {
            ctx.strokeText(char, currentX, y);
          }
          ctx.fillText(char, currentX, y);
          currentX += ctx.measureText(char).width + textElement.letterSpacing;
        });
      }
    });

    if (textElement.textRotation !== 0) {
      ctx.restore();
    }

    // Indicador de selección
    if (isSelected) {
      ctx.save();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      
      const indicatorSize = textElement.fontSize * 1.5;
      const indicatorX = baseX - indicatorSize / 2;
      const indicatorY = baseY - indicatorSize / 2;
      
      ctx.strokeRect(indicatorX, indicatorY, indicatorSize, indicatorSize);
      ctx.restore();
    }

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  const drawCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = config.width;
    canvas.height = config.height;

    ctx.clearRect(0, 0, config.width, config.height);

    // Dibujar fondo
    if (config.backgroundType === 'image' && loadedImage) {
      ctx.globalAlpha = config.imageOpacity / 100;
      const scale = config.imageScale / 100;
      const imgWidth = loadedImage.width * scale;
      const imgHeight = loadedImage.height * scale;
      const x = (config.width * (config.imagePositionX / 100)) - (imgWidth / 2);
      const y = (config.height * (config.imagePositionY / 100)) - (imgHeight / 2);
      ctx.drawImage(loadedImage, x, y, imgWidth, imgHeight);
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
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, config.width, config.height);
    }

    // Dibujar todos los textos
    textElements.forEach((textElement) => {
      drawTextElement(ctx, textElement, textElement.id === selectedTextId);
    });
  };

  useEffect(() => {
    drawCanvas();
  }, [config, loadedImage, textElements, selectedTextId]);

  // Drag and drop
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

  const getTextElementAtPosition = (mousePos: MousePosition): TextElement | null => {
    for (let i = textElements.length - 1; i >= 0; i--) {
      const textElement = textElements[i];
      const textX = (config.width * textElement.textPositionX) / 100;
      const textY = (config.height * textElement.textPositionY) / 100;
      const textAreaSize = textElement.fontSize * 2;
      
      const distanceX = Math.abs(mousePos.x - textX);
      const distanceY = Math.abs(mousePos.y - textY);
      
      if (distanceX <= textAreaSize && distanceY <= textAreaSize) {
        return textElement;
      }
    }
    return null;
  };

  const handleMouseDown = (e: MouseEvent): void => {
    const mousePos = getCanvasMousePosition(e);
    const textAtPosition = getTextElementAtPosition(mousePos);
    
    if (textAtPosition) {
      if (textAtPosition.id !== selectedTextId) {
        setSelectedTextId(textAtPosition.id);
      }
      
      const textX = (config.width * textAtPosition.textPositionX) / 100;
      const textY = (config.height * textAtPosition.textPositionY) / 100;
      
      setIsDragging(true);
      setDraggedTextId(textAtPosition.id);
      setDragOffset({
        x: mousePos.x - textX,
        y: mousePos.y - textY
      });
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
    }
  };

  const handleMouseMove = (e: MouseEvent): void => {
    const mousePos = getCanvasMousePosition(e);
    
    if (isDragging && draggedTextId !== null) {
      const newX = mousePos.x - dragOffset.x;
      const newY = mousePos.y - dragOffset.y;
      
      const newPositionX = Math.max(0, Math.min(100, (newX / config.width) * 100));
      const newPositionY = Math.max(0, Math.min(100, (newY / config.height) * 100));
      
      setTextElements(prev => prev.map(text => 
        text.id === draggedTextId 
          ? { ...text, textPositionX: newPositionX, textPositionY: newPositionY }
          : text
      ));
    } else {
      const textAtPosition = getTextElementAtPosition(mousePos);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = textAtPosition ? 'grab' : 'default';
      }
    }
  };

  const handleMouseUp = (): void => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedTextId(null);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'default';
      }
    }
  };

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
  }, [isDragging, dragOffset, textElements, draggedTextId, config.width, config.height]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
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

  const removeImage = (): void => {
    setLoadedImage(null);
    setConfig(prev => ({ ...prev, backgroundType: 'color' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadImage = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'instagram-post.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const resetToDefaults = (): void => {
    setConfig({
      width: 1080,
      height: 1080,
      backgroundColor: '#6366f1',
      gradientStart: '#6366f1',
      gradientEnd: '#ec4899',
      gradientDirection: 'diagonal',
      imageOpacity: 100,
      imageScale: 100,
      imagePositionX: 50,
      imagePositionY: 50,
      backgroundType: 'color'
    });
    
    setTextElements([
      {
        id: 0,
        text: 'Tu mensaje aquí',
        fontSize: 72,
        fontFamily: 'Arial',
        textColor: '#ffffff',
        textAlign: 'center',
        textPositionX: 50,
        textPositionY: 50,
        textWeight: 'bold',
        textStyle: 'normal',
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
      }
    ]);
    
    setSelectedTextId(0);
    setLoadedImage(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const applyGradientPreset = (preset: GradientPreset): void => {
    setConfig(prev => ({
      ...prev,
      gradientStart: preset.start,
      gradientEnd: preset.end,
      backgroundType: 'gradient'
    }));
  };

  const selectedText = getSelectedText();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Creador de Imágenes para Instagram
          </h1>
          <p className="text-gray-600">
            Diseña posts atractivos para redes sociales con múltiples elementos de texto
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Tamaños */}
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

            {/* Gestión de Textos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-indigo-600" />
                Elementos de Texto ({textElements.length})
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={addNewText}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    + Agregar Texto
                  </button>
                  
                  {textElements.length > 1 && (
                    <button
                      onClick={() => deleteText(selectedTextId)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {textElements.map((textElement, index) => (
                    <div
                      key={textElement.id}
                      onClick={() => setSelectedTextId(textElement.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        textElement.id === selectedTextId
                          ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            Texto {index + 1} {textElement.id === selectedTextId && '(seleccionado)'}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-48">
                            "{textElement.text}"
                          </div>
                          <div className="text-xs text-gray-400">
                            {textElement.fontFamily} • {textElement.fontSize}px
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: textElement.textColor }}
                          />
                          {textElements.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteText(textElement.id);
                              }}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Configuración del Texto Seleccionado */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración del Texto Seleccionado
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Mensaje:</label>
                  <textarea
                    value={selectedText.text}
                    onChange={(e) => updateSelectedText({ text: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Fuente:</label>
                    <select
                      value={selectedText.fontFamily}
                      onChange={(e) => updateSelectedText({ fontFamily: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      {fonts.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Tamaño: {selectedText.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      value={selectedText.fontSize}
                      onChange={(e) => updateSelectedText({ fontSize: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Color:</label>
                    <input
                      type="color"
                      value={selectedText.textColor}
                      onChange={(e) => updateSelectedText({ textColor: e.target.value })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Estilo:</label>
                    <select
                      value={selectedText.textWeight}
                      onChange={(e) => updateSelectedText({ textWeight: e.target.value as 'normal' | 'bold' })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Negrita</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Posición X: {selectedText.textPositionX.toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedText.textPositionX}
                      onChange={(e) => updateSelectedText({ textPositionX: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Posición Y: {selectedText.textPositionY.toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedText.textPositionY}
                      onChange={(e) => updateSelectedText({ textPositionY: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Efectos básicos */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Efectos</h4>
                  
                  <label className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={selectedText.textShadowEnabled}
                      onChange={(e) => updateSelectedText({ textShadowEnabled: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Sombra</span>
                  </label>

                  <label className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={selectedText.textBackgroundEnabled}
                      onChange={(e) => updateSelectedText({ textBackgroundEnabled: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Fondo del texto</span>
                  </label>
                </div>
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
                  </div>
                )}

                {config.backgroundType === 'image' && (
                  <div className="space-y-4">
                    <div>
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
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vista Previa y Controles */}
          <div className="space-y-6">
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

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Consejos:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Múltiples textos:</strong> Agrega y gestiona varios elementos</li>
                <li>• <strong>Selección:</strong> Haz click en un texto para editarlo</li>
                <li>• <strong>Drag & Drop:</strong> Arrastra textos en la vista previa</li>
                <li>• <strong>Indicador:</strong> El texto seleccionado tiene borde azul</li>
                <li>• Combina diferentes fuentes y efectos</li>
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