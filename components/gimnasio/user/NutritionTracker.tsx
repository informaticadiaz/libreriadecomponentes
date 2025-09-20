import React, { useState, useRef } from 'react';
import { Plus, Camera, Search, Droplets, ChevronRight, X } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  imageUrl?: string;
}

interface LoggedFood {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: Date;
}

interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number; // ml
}

interface NutritionTrackerProps {
  dailyTargets: DailyTargets;
  loggedFoods: LoggedFood[];
  onAddFood: (food: LoggedFood) => void;
  onTakePhoto: () => void;
}

const NutritionTracker: React.FC<NutritionTrackerProps> = ({
  dailyTargets,
  loggedFoods,
  onAddFood,
  onTakePhoto
}) => {
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAddFood, setShowAddFood] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [waterIntake, setWaterIntake] = useState(1200); // ml
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample food database
  const foodDatabase: FoodItem[] = [
    {
      id: '1',
      name: 'Pechuga de Pollo',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      serving: '100g'
    },
    {
      id: '2',
      name: 'Arroz Integral',
      calories: 123,
      protein: 2.6,
      carbs: 25,
      fat: 1,
      serving: '100g'
    },
    {
      id: '3',
      name: 'Brócoli',
      calories: 34,
      protein: 2.8,
      carbs: 6.6,
      fat: 0.4,
      serving: '100g'
    },
    {
      id: '4',
      name: 'Palta',
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
      serving: '100g'
    },
    {
      id: '5',
      name: 'Huevos',
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      serving: '2 unidades'
    }
  ];

  const meals = [
    { id: 'breakfast' as const, label: 'Desayuno', icon: '🌅', time: '07:00' },
    { id: 'lunch' as const, label: 'Almuerzo', icon: '☀️', time: '13:00' },
    { id: 'dinner' as const, label: 'Cena', icon: '🌙', time: '20:00' },
    { id: 'snack' as const, label: 'Snack', icon: '🍎', time: 'Variable' }
  ] as const;

  // Calculate current totals
  const currentTotals = loggedFoods.reduce(
    (totals, loggedFood) => {
      const multiplier = loggedFood.quantity;
      return {
        calories: totals.calories + (loggedFood.foodItem.calories * multiplier),
        protein: totals.protein + (loggedFood.foodItem.protein * multiplier),
        carbs: totals.carbs + (loggedFood.foodItem.carbs * multiplier),
        fat: totals.fat + (loggedFood.foodItem.fat * multiplier)
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getMealFoods = (mealType: string) => {
    return loggedFoods.filter(food => food.mealType === mealType);
  };

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFoodToMeal = () => {
    if (!selectedFood) return;

    const newLoggedFood: LoggedFood = {
      id: Date.now().toString(),
      foodItem: selectedFood,
      quantity,
      mealType: selectedMeal,
      loggedAt: new Date()
    };

    onAddFood(newLoggedFood);
    setShowAddFood(false);
    setSelectedFood(null);
    setQuantity(1);
    setSearchQuery('');
  };

  const MacroCircle: React.FC<{ 
    current: number; 
    target: number; 
    label: string; 
    color: string;
    unit: string;
  }> = ({ current, target, label, color, unit }) => {
    const percentage = getProgressPercentage(current, target);
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 68 68">
            <circle
              cx="34"
              cy="34"
              r="30"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-gray-800"
            />
            <circle
              cx="34"
              cy="34"
              r="30"
              stroke={color}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-white">{Math.round(current)}</span>
            <span className="text-xs text-gray-400">{unit}</span>
          </div>
        </div>
        <span className="text-xs text-gray-400 mt-1">{label}</span>
        <span className="text-xs text-gray-500">{Math.round(target)} {unit}</span>
      </div>
    );
  };

  // Add Food Modal
  if (showAddFood) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50">
          <button
            onClick={() => setShowAddFood(false)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
          <h2 className="font-semibold text-white">Agregar a {meals.find(m => m.id === selectedMeal)?.label}</h2>
          <div className="w-9" />
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alimentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>
        </div>

        {/* Food Selection or Quantity */}
        <div className="flex-1 px-4">
          {!selectedFood ? (
            <div className="space-y-3">
              {filteredFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className="w-full bg-gray-900 hover:bg-gray-800 rounded-xl p-4 text-left transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{food.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{food.serving}</p>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span>{food.calories} cal</span>
                        <span>{food.protein}g prot</span>
                        <span>{food.carbs}g carb</span>
                        <span>{food.fat}g grasa</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Food */}
              <div className="bg-gray-900 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">{selectedFood.name}</h3>
                <p className="text-sm text-gray-400 mb-3">Por {selectedFood.serving}</p>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-white">{selectedFood.calories}</p>
                    <p className="text-xs text-gray-400">cal</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{selectedFood.protein}g</p>
                    <p className="text-xs text-gray-400">prot</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{selectedFood.carbs}g</p>
                    <p className="text-xs text-gray-400">carb</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{selectedFood.fat}g</p>
                    <p className="text-xs text-gray-400">grasa</p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="text-center">
                <p className="text-gray-400 mb-4">Cantidad</p>
                <div className="flex items-center justify-center space-x-6">
                  <button
                    onClick={() => setQuantity(Math.max(0.25, quantity - 0.25))}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-white text-xl">−</span>
                  </button>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{quantity}</div>
                    <div className="text-sm text-gray-400">{selectedFood.serving}</div>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 0.25)}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-white text-xl">+</span>
                  </button>
                </div>
              </div>

              {/* Total Nutrition */}
              <div className="bg-gray-900 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-3">Total a agregar</h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-fuchsia-400">{Math.round(selectedFood.calories * quantity)}</p>
                    <p className="text-xs text-gray-400">cal</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-400">{Math.round(selectedFood.protein * quantity)}g</p>
                    <p className="text-xs text-gray-400">prot</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-yellow-400">{Math.round(selectedFood.carbs * quantity)}g</p>
                    <p className="text-xs text-gray-400">carb</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-400">{Math.round(selectedFood.fat * quantity)}g</p>
                    <p className="text-xs text-gray-400">grasa</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50">
          {selectedFood ? (
            <button
              onClick={addFoodToMeal}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
            >
              Agregar Alimento
            </button>
          ) : (
            <button
              onClick={onTakePhoto}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Camera className="h-5 w-5" />
              <span>Tomar Foto de Comida</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      
      {/* Daily Summary */}
      <div className="p-4 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Nutrición</h1>
          <p className="text-gray-400">Hoy • {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}</p>
        </div>

        {/* Calorie Progress */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-purple-700 p-1">
          <div className="rounded-2xl bg-black p-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-white mb-1">
                {Math.round(currentTotals.calories)}
              </div>
              <div className="text-gray-400 text-sm">
                de {dailyTargets.calories} calorías
              </div>
            </div>
            
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all duration-300"
                style={{ width: `${getProgressPercentage(currentTotals.calories, dailyTargets.calories)}%` }}
              />
            </div>
            
            <div className="text-center">
              <span className="text-sm text-gray-300">
                {dailyTargets.calories - currentTotals.calories > 0 
                  ? `${Math.round(dailyTargets.calories - currentTotals.calories)} calorías restantes`
                  : 'Objetivo cumplido!'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-4">
          <MacroCircle
            current={currentTotals.protein}
            target={dailyTargets.protein}
            label="Proteína"
            color="#10B981"
            unit="g"
          />
          <MacroCircle
            current={currentTotals.carbs}
            target={dailyTargets.carbs}
            label="Carbos"
            color="#F59E0B"
            unit="g"
          />
          <MacroCircle
            current={currentTotals.fat}
            target={dailyTargets.fat}
            label="Grasas"
            color="#3B82F6"
            unit="g"
          />
        </div>

        {/* Water Intake */}
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-white">Agua</span>
            </div>
            <span className="text-sm text-gray-400">{waterIntake}ml / {dailyTargets.water}ml</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${getProgressPercentage(waterIntake, dailyTargets.water)}%` }}
              />
            </div>
            <button
              onClick={() => setWaterIntake(waterIntake + 250)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              +250ml
            </button>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="px-4 space-y-4">
        <h2 className="text-xl font-bold text-white">Comidas</h2>
        
        {meals.map((meal) => {
          const mealFoods = getMealFoods(meal.id);
          const mealCalories = mealFoods.reduce((total, food) => 
            total + (food.foodItem.calories * food.quantity), 0
          );
          
          return (
            <div key={meal.id} className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{meal.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{meal.label}</h3>
                    <p className="text-xs text-gray-400">{meal.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{Math.round(mealCalories)} cal</p>
                    <p className="text-xs text-gray-400">{mealFoods.length} alimentos</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMeal(meal.id);
                      setShowAddFood(true);
                    }}
                    className="w-8 h-8 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              
              {mealFoods.length > 0 && (
                <div className="space-y-2 border-t border-gray-800 pt-3">
                  {mealFoods.map((food) => (
                    <div key={food.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">{food.foodItem.name}</p>
                        <p className="text-xs text-gray-400">
                          {food.quantity} × {food.foodItem.serving}
                        </p>
                      </div>
                      <p className="text-sm text-gray-300">
                        {Math.round(food.foodItem.calories * food.quantity)} cal
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Demo Component
const NutritionTrackerDemo = () => {
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([
    {
      id: '1',
      foodItem: {
        id: '5',
        name: 'Huevos',
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fat: 11,
        serving: '2 unidades'
      },
      quantity: 1,
      mealType: 'breakfast',
      loggedAt: new Date()
    }
  ]);

  const dailyTargets: DailyTargets = {
    calories: 2200,
    protein: 165,
    carbs: 250,
    fat: 73,
    water: 2500
  };

  const handleAddFood = (food: LoggedFood) => {
    setLoggedFoods(prev => [...prev, food]);
  };

  const handleTakePhoto = () => {
    console.log('Taking food photo...');
    // Here you would implement camera functionality
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <NutritionTracker
        dailyTargets={dailyTargets}
        loggedFoods={loggedFoods}
        onAddFood={handleAddFood}
        onTakePhoto={handleTakePhoto}
      />
    </div>
  );
};

export default NutritionTrackerDemo;