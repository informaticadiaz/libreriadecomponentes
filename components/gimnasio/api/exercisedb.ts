// lib/exercisedb.ts
export interface Exercise {
  bodyPart: string;
  equipment: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  description?: string;
  difficulty?: string;
  category?: string;
  imageUrl?: string;
}

class ExerciseDBService {
  private baseURL = 'https://exercisedb.p.rapidapi.com';
  private headers = {
    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  };

  // Generar URL de imagen
  private getExerciseImageUrl(exerciseId: string, resolution: number = 720): string {
    return `${this.baseURL}/image?exerciseId=${exerciseId}&resolution=${resolution}`;
  }

  // Agregar URLs de imagen a ejercicios
  private addImageUrls(exercises: Exercise[]): Exercise[] {
    return exercises.map(exercise => ({
      ...exercise,
      imageUrl: this.getExerciseImageUrl(exercise.id, 720)
    }));
  }

  async getAllExercises(limit: number = 20): Promise<Exercise[]> {
    try {
      const response = await fetch(`${this.baseURL}/exercises?limit=${limit}`, {
        headers: this.headers
      });
      if (!response.ok) throw new Error('Failed to fetch exercises');
      const data = await response.json() as Exercise[];
      return this.addImageUrls(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
  }

  async getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
    try {
      const response = await fetch(`${this.baseURL}/exercises/bodyPart/${bodyPart}`, {
        headers: this.headers
      });
      if (!response.ok) throw new Error('Failed to fetch exercises by body part');
      const data = await response.json() as Exercise[];
      return this.addImageUrls(data);
    } catch (error) {
      console.error('Error fetching exercises by body part:', error);
      return [];
    }
  }

  async getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
    try {
      const response = await fetch(`${this.baseURL}/exercises/equipment/${equipment}`, {
        headers: this.headers
      });
      if (!response.ok) throw new Error('Failed to fetch exercises by equipment');
      const data = await response.json() as Exercise[];
      return this.addImageUrls(data);
    } catch (error) {
      console.error('Error fetching exercises by equipment:', error);
      return [];
    }
  }

  async getExercisesByTarget(target: string): Promise<Exercise[]> {
    try {
      const response = await fetch(`${this.baseURL}/exercises/target/${target}`, {
        headers: this.headers
      });
      if (!response.ok) throw new Error('Failed to fetch exercises by target');
      const data = await response.json() as Exercise[];
      return this.addImageUrls(data);
    } catch (error) {
      console.error('Error fetching exercises by target:', error);
      return [];
    }
  }

  async getBodyPartsList(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/exercises/bodyPartList`, {
        headers: this.headers
      });
      if (!response.ok) throw new Error('Failed to fetch body parts list');
      return await response.json();
    } catch (error) {
      console.error('Error fetching body parts:', error);
      return [];
    }
  }

  async getEquipmentList(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/exercises/equipmentList`, {
        headers: this.headers
      });
      if (!response.ok) throw new Error('Failed to fetch equipment list');
      return await response.json();
    } catch (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }
  }

  async getTargetList(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/exercises/targetList`, {
        headers: this.headers
      });
      if (!response.ok) throw new Error('Failed to fetch target list');
      return await response.json();
    } catch (error) {
      console.error('Error fetching targets:', error);
      return [];
    }
  }
}

export const exerciseDB = new ExerciseDBService();
