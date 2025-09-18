// components/ExerciseExplorer.tsx
'use client';

import { useState, useEffect } from 'react';
import { exerciseDB, Exercise } from './exercisedb';
import ExerciseImage from './ExerciseImage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dumbbell, Target, Settings } from 'lucide-react';

export default function ExerciseExplorer() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [bodyPartsList, initialExercises] = await Promise.all([
          exerciseDB.getBodyPartsList(),
          exerciseDB.getAllExercises(12)
        ]);
        
        setBodyParts(bodyPartsList);
        setExercises(initialExercises);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleBodyPartFilter = async (bodyPart: string) => {
    setLoading(true);
    setSelectedBodyPart(bodyPart);
    
    try {
      const filteredExercises = bodyPart === '' 
        ? await exerciseDB.getAllExercises(12)
        : await exerciseDB.getExercisesByBodyPart(bodyPart);
      
      setExercises(filteredExercises.slice(0, 12));
    } catch (error) {
      console.error('Error filtering exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const capitalizeWords = (str: string) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading && exercises.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-indigo-600" />
          Exercise Explorer
        </h1>
        <p className="text-muted-foreground mb-6">
          Discover over 1,300 exercises with detailed instructions and muscle targeting
        </p>
        
        {/* Filtros por parte del cuerpo */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={selectedBodyPart === '' ? "default" : "outline"}
            onClick={() => handleBodyPartFilter('')}
            size="sm"
          >
            All ({exercises.length})
          </Button>
          {bodyParts.map((bodyPart) => (
            <Button
              key={bodyPart}
              variant={selectedBodyPart === bodyPart ? "default" : "outline"}
              onClick={() => handleBodyPartFilter(bodyPart)}
              size="sm"
            >
              {capitalizeWords(bodyPart)}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de ejercicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="text-lg flex items-start justify-between">
                <span className="line-clamp-2">{capitalizeWords(exercise.name)}</span>
                <Badge variant="secondary" className="ml-2 shrink-0">
                  {exercise.difficulty || 'Standard'}
                </Badge>
              </CardTitle>
              <CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {capitalizeWords(exercise.bodyPart)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {capitalizeWords(exercise.target)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    {capitalizeWords(exercise.equipment)}
                  </Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Imagen del ejercicio */}
              <div className="mb-4">
                <ExerciseImage exercise={exercise} />
              </div>
              
              {/* Músculos secundarios */}
              {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Secondary Muscles:</p>
                  <div className="flex flex-wrap gap-1">
                    {exercise.secondaryMuscles.slice(0, 3).map((muscle, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {capitalizeWords(muscle)}
                      </Badge>
                    ))}
                    {exercise.secondaryMuscles.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{exercise.secondaryMuscles.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* Instrucciones */}
              {exercise.instructions && exercise.instructions.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Instructions:</p>
                  <p className="line-clamp-3">{exercise.instructions[0]}</p>
                  {exercise.instructions.length > 1 && (
                    <p className="text-xs mt-1 text-indigo-600 font-medium">
                      +{exercise.instructions.length - 1} more steps
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && exercises.length > 0 && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            Loading more exercises...
          </div>
        </div>
      )}

      {exercises.length === 0 && !loading && (
        <div className="text-center py-12">
          <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No exercises found</h3>
          <p className="text-gray-400">Try selecting a different body part</p>
        </div>
      )}
    </div>
  );
}