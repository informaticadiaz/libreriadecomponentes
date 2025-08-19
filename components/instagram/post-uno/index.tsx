"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Type, Palette, Monitor, RotateCcw } from 'lucide-react';

const InstagramImageCreator = () => {
  const canvasRef = useRef(null);
  const [config, setConfig] = useState({
    width: 1080,
    height: 1080,
    backgroundColor: '#6366f1',
    gradientEnabled: false,
    gradientStart: '#6366f1',
    gradientEnd: '#ec4899',
    gradientDirection: 'diagonal',
    text: 'Tu mensaje aquí',
    fontSize: 72,
    fontFamily: 'Arial',
    textColor: '#ffffff',
    textAlign: 'center',
    textVerticalAlign: 'middle',
    textWeight: 'bold'
  });

  const presetSizes = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1200, height: 675 }
  ];

  const fonts = [
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Verdana',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS'
  ];

  const gradientPresets = [
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
    canvas.width = config.width;
    canvas.height = config.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, config.width, config.height);

    // Dibujar fondo
    if (config.gradientEnabled) {
      const gradient = ctx.createLinearGradient(
        config.gradientDirection === 'horizontal' ? 0 : config.gradientDirection === 'vertical' ? 0 : 0,
        config.gradientDirection === 'horizontal' ? 0 : config.gradientDirection === 'vertical' ? 0 : 0,
        config.gradientDirection === 'horizontal' ? config.width : config.gradientDirection === 'vertical' ? 0 : config.width,
        config.gradientDirection === 'horizontal' ? 0 : config.gradientDirection === 'vertical' ? config.height : config.height
      );
      gradient.addColorStop(0, config.gradientStart);
      gradient.addColorStop(1, config.gradientEnd);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = config.backgroundColor;
    }
    ctx.fillRect(0, 0, config.width, config.height);

    // Configurar texto
    ctx.fillStyle = config.textColor;
    ctx.font = `${config.textWeight} ${config.fontSize}px ${config.fontFamily}`;
    ctx.textAlign = config.textAlign;

    // Dividir texto en líneas
    const words = config.text.split(' ');
    const lines = [];
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

    // Calcular posición vertical
    const lineHeight = config.fontSize * 1.2;
    const totalTextHeight = lines.length * lineHeight;
    let startY;

    switch (config.textVerticalAlign) {
      case 'top':
        startY = config.fontSize;
        break;
      case 'bottom':
        startY = config.height - totalTextHeight + config.fontSize;
        break;
      default: // middle
        startY = (config.height - totalTextHeight) / 2 + config.fontSize;
    }

    // Dibujar texto
    lines.forEach((line, index) => {
      const x = config.textAlign === 'left' ? config.width * 0.1 : 
                config.textAlign === 'right' ? config.width * 0.9 : 
                config.width / 2;
      const y = startY + (index * lineHeight);
      
      // Sombra de texto para mejor legibilidad
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(line, x, y);
    });

    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  useEffect(() => {
    drawCanvas();
  }, [config]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
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
      text: 'Tu mensaje aquí',
      fontSize: 72,
      fontFamily: 'Arial',
      textColor: '#ffffff',
      textAlign: 'center',
      textVerticalAlign: 'middle',
      textWeight: 'bold'
    });
  };

  const applyGradientPreset = (preset) => {
    setConfig(prev => ({
      ...prev,
      gradientStart: preset.start,
      gradientEnd: preset.end,
      gradientEnabled: true
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
                      checked={!config.gradientEnabled}
                      onChange={() => setConfig(prev => ({ ...prev, gradientEnabled: false }))}
                      className="mr-2"
                    />
                    Color sólido
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={config.gradientEnabled}
                      onChange={() => setConfig(prev => ({ ...prev, gradientEnabled: true }))}
                      className="mr-2"
                    />
                    Gradiente
                  </label>
                </div>

                {!config.gradientEnabled ? (
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700">Color:</label>
                    <input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-8 rounded border border-gray-300"
                    />
                  </div>
                ) : (
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
              </div>
            </div>

            {/* Configuración de Texto */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-indigo-600" />
                Texto
              </h3>
              
              <div className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
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
                      max="120"
                      value={config.fontSize}
                      onChange={(e) => setConfig(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Color del texto:</label>
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Peso:</label>
                    <select
                      value={config.textWeight}
                      onChange={(e) => setConfig(prev => ({ ...prev, textWeight: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Negrita</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Alineación horizontal:</label>
                    <select
                      value={config.textAlign}
                      onChange={(e) => setConfig(prev => ({ ...prev, textAlign: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="left">Izquierda</option>
                      <option value="center">Centro</option>
                      <option value="right">Derecha</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Alineación vertical:</label>
                    <select
                      value={config.textVerticalAlign}
                      onChange={(e) => setConfig(prev => ({ ...prev, textVerticalAlign: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="top">Arriba</option>
                      <option value="middle">Centro</option>
                      <option value="bottom">Abajo</option>
                    </select>
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
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
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
                <li>• Asegúrate de que el contraste sea bueno</li>
                <li>• Prueba diferentes gradientes</li>
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