// components/ExerciseImage.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { Exercise } from './exercisedb';

interface ExerciseImageProps {
  exercise: Exercise;
  className?: string;
}

export default function ExerciseImage({ exercise, className = "w-full object-cover rounded-lg border" }: ExerciseImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!exercise.imageUrl) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(exercise.imageUrl, {
          headers: {
            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          }
        });

        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch (err) {
        console.error('Error loading exercise image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    // Cleanup object URL on unmount
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [exercise.imageUrl]);

  // Placeholder para ejercicios sin imagen o con error
  const ExercisePlaceholder = () => (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center ${className}`}>
      <Dumbbell className="h-16 w-16 text-indigo-300 mb-2" />
      <p className="text-sm font-medium text-indigo-600">{exercise.equipment}</p>
      <p className="text-xs text-indigo-400">{exercise.category || 'Exercise'}</p>
    </div>
  );

  // Loading placeholder
  if (loading) {
    return (
      <div className={`bg-gray-100 animate-pulse flex items-center justify-center ${className}`}>
        <Dumbbell className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  // Error o sin imagen
  if (error || !imageSrc) {
    return <ExercisePlaceholder />;
  }

  return (
    <img 
      src={imageSrc}
      alt={exercise.name}
      className={className}
      loading="lazy"
    />
  );
}