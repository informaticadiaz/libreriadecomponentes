// components/ApiStatsChecker.tsx
'use client';

import { useState } from 'react';
import { exerciseDB } from './exercisedb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Dumbbell, Target, Settings } from 'lucide-react';

interface ApiStats {
  totalExercises: number;
  bodyParts: string[];
  equipment: string[];
  targets: string[];
  sampleExercises: any[];
}

export default function ApiStatsChecker() {
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const checkApiStats = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Starting API analysis...');
      
      // Obtener listas disponibles
      const [bodyParts, equipment, targets] = await Promise.all([
        exerciseDB.getBodyPartsList(),
        exerciseDB.getEquipmentList(), 
        exerciseDB.getTargetList()
      ]);

      console.log('📋 Lists loaded:', { bodyParts: bodyParts.length, equipment: equipment.length, targets: targets.length });

      // Intentar obtener un número alto para ver el límite real
      console.log('🔢 Testing with limit 2000...');
      const manyExercises = await exerciseDB.getAllExercises(2000);
      
      console.log('✅ Got', manyExercises.length, 'exercises');

      // Si obtuvimos exactamente el límite, probar con más
      let totalExercises = manyExercises.length;
      if (manyExercises.length === 2000) {
        console.log('🔢 Testing with limit 5000...');
        const evenMore = await exerciseDB.getAllExercises(5000);
        totalExercises = evenMore.length;
        console.log('✅ Got', evenMore.length, 'exercises with higher limit');
      }

      setStats({
        totalExercises,
        bodyParts,
        equipment,
        targets,
        sampleExercises: manyExercises.slice(0, 5)
      });

    } catch (err) {
      console.error('❌ Error checking API stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const capitalizeWords = (str: string) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          API Statistics Checker
        </h1>
        <p className="text-muted-foreground mb-6">
          Let's find out exactly how many exercises are available in your RapidAPI subscription
        </p>
        
        <Button 
          onClick={checkApiStats} 
          disabled={loading}
          size="lg"
          className="mb-6"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing API...
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4 mr-2" />
              Check Real API Stats
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">❌ Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {stats && (
        <div className="grid gap-6">
          {/* Estadísticas principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                API Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalExercises}</div>
                  <div className="text-sm text-muted-foreground">Total Exercises</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.bodyParts.length}</div>
                  <div className="text-sm text-muted-foreground">Body Parts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.equipment.length}</div>
                  <div className="text-sm text-muted-foreground">Equipment Types</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats.targets.length}</div>
                  <div className="text-sm text-muted-foreground">Target Muscles</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Body Parts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Available Body Parts ({stats.bodyParts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.bodyParts.map(part => (
                  <Badge key={part} variant="secondary">
                    {capitalizeWords(part)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Available Equipment ({stats.equipment.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.equipment.map(eq => (
                  <Badge key={eq} variant="outline">
                    {capitalizeWords(eq)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sample exercises */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.sampleExercises.map(exercise => (
                  <div key={exercise.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{capitalizeWords(exercise.name)}</h4>
                      <Badge variant="secondary">ID: {exercise.id}</Badge>
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>Body: {capitalizeWords(exercise.bodyPart)}</span> •
                      <span>Target: {capitalizeWords(exercise.target)}</span> •
                      <span>Equipment: {capitalizeWords(exercise.equipment)}</span>
                    </div>
                    {exercise.imageUrl && (
                      <div className="text-xs text-blue-600 mt-1">
                        ✅ Has image URL
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}