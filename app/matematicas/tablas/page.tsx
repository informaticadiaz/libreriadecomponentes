// app/learn/page.tsx
'use client';

import { useState } from 'react';
import { MultiplicationTablesTrainer } from '@/components/educa/matematicas/tablas/MultiplicationTablesTrainer';
import type { ProgressSnapshot } from '@/components/educa/matematicas/tablas/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Trophy, Zap } from 'lucide-react';

export default function LearnPage() {
  const [progressData, setProgressData] = useState<ProgressSnapshot | null>(null);

  const handleProgressChange = (snapshot: ProgressSnapshot) => {
    setProgressData(snapshot);
    console.log('Progress updated:', snapshot);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Centro de Aprendizaje
              </h1>
              <p className="mt-2 text-gray-600">
                Practica y domina las tablas de multiplicar de forma divertida
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Matemáticas • 6-10 años
            </Badge>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        {/* Sidebar con información */}
        <div className="lg:col-span-1 space-y-6">
            {/* Información general */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Cómo usar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <p><strong>Explorar:</strong> Revisa las tablas para familiarizarte</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <p><strong>Practicar:</strong> Entrena sin presión de tiempo</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Trophy className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                  <p><strong>Quiz:</strong> Desafiate con tiempo y puntuación</p>
                </div>
              </CardContent>
            </Card>

            {/* Progreso actual */}
            {progressData && progressData.totalAttempts > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tu progreso actual</CardTitle>
                  <CardDescription>
                    Última actualización: {progressData.lastUpdated.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Precisión general</span>
                    <Badge 
                      variant={progressData.overallAccuracy >= 80 ? "default" : "secondary"}
                      className="font-semibold"
                    >
                      {progressData.overallAccuracy.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Respuestas correctas</span>
                    <span className="font-semibold">{progressData.totalCorrect}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de intentos</span>
                    <span className="font-semibold">{progressData.totalAttempts}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips y consejos */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Usa las pistas si necesitas ayuda</p>
                <p>• Practica las tablas más difíciles más seguido</p>
                <p>• Trata de encontrar patrones en los números</p>
                <p>• No te preocupes por el tiempo al principio</p>
              </CardContent>
            </Card>
          </div>
        <div className="mt-8">
          {/* Componente principal */}
          <div className="">
            <MultiplicationTablesTrainer
              minTable={1}
              maxTable={12}
              defaultMode="explore"
              defaultSelectedTables={[2, 3, 4, 5]}
              defaultQuestionCount={10}
              enableTimer={true}
              onProgressChange={handleProgressChange}
              className="bg-white rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Sección de configuraciones adicionales (demo) */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Configuraciones de demostración
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Configuración básica */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modo Básico</CardTitle>
                <CardDescription>Tablas del 1 al 5 para principiantes</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiplicationTablesTrainer
                  minTable={1}
                  maxTable={5}
                  defaultMode="practice"
                  defaultSelectedTables={[2, 3]}
                  defaultQuestionCount={5}
                  enableTimer={false}
                  onProgressChange={handleProgressChange}
                />
              </CardContent>
            </Card>

            {/* Configuración avanzada */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modo Avanzado</CardTitle>
                <CardDescription>Tablas del 6 al 12 con timer</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiplicationTablesTrainer
                  minTable={6}
                  maxTable={12}
                  defaultMode="quiz"
                  defaultSelectedTables={[7, 8, 9]}
                  defaultQuestionCount={15}
                  enableTimer={true}
                  onProgressChange={handleProgressChange}
                />
              </CardContent>
            </Card>

            {/* Configuración personalizada */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personalizado</CardTitle>
                <CardDescription>Con textos personalizados</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiplicationTablesTrainer
                  minTable={1}
                  maxTable={10}
                  defaultMode="explore"
                  i18n={{
                    modes: {
                      explore: 'Mirar',
                      practice: 'Entrenar',
                      quiz: 'Competir'
                    },
                    feedback: {
                      correct: '¡Genial!',
                      incorrect: 'Casi...',
                      excellent: '¡Increíble!',
                      wellDone: '¡Fantástico!',
                      goodJob: '¡Súper!',
                      keepPracticing: '¡Vas muy bien!',
                      almostThere: '¡Ya casi!',
                      perfectScore: '¡Eres increíble!'
                    }
                  }}
                  onProgressChange={handleProgressChange}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Componente de entrenamiento de matemáticas • 
              Accesible • Compatible con Next.js • 
              Guarda progreso localmente
            </p>
            <p className="text-xs mt-2">
              Construido con React, TypeScript, Tailwind CSS y shadcn/ui
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
