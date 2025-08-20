import React, { useState } from 'react';
import { CheckCircle, X, BookOpen, Star, Heart, Smile } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  selectedAnswer?: string | number;
  isIncorrect?: boolean;
}

interface EvaluationData {
  institution: string;
  title: string;
  questions: Question[];
}

const SocialSciencesEvaluation: React.FC = () => {
  const [answers, setAnswers] = useState<{[key: number]: string | number}>({});
  const [showCelebration, setShowCelebration] = useState<number | null>(null);

  const evaluationData: EvaluationData = {
    institution: "",
    title: "EVALUACIÓN CIENCIAS SOCIALES N° 2",
    questions: [
      {
        id: 1,
        text: "¿En qué consiste el ecodesarrollo?",
        options: [
          "Consiste en la utilización de los recursos naturales siempre y cuando no se agoten o dañen",
          "Consiste en que los recursos se pueden agotar o deteriorar",
          "Consiste en la utilización de los recursos naturales sin tener en cuenta su agotamiento o deterioro"
        ]
      },
      {
        id: 2,
        text: "¿De qué manera se relaciona la tecnología con los recursos naturales?",
        options: [
          "Se relaciona brindando máquinas y productos",
          "Se relaciona por los conocimientos y habilidades",
          "Se relaciona permitiendo obtener y transformar los recursos naturales"
        ]
      },
      {
        id: 3,
        text: "¿Qué promueve el desarrollo sostenible?",
        options: [
          "Fue incorporado por la ONU para un crecimiento económico",
          "Plantea que se pueden utilizar los recursos naturales si se respetan los tiempos de su regeneración",
          "Incorpora los aspectos sociales, políticos y culturales proponiendo la igualdad de oportunidades"
        ]
      },
      {
        id: 4,
        text: "¿Cuáles son las características de la Pampa alta?",
        options: [
          "Se ubica al sur con un terreno seco y elevado",
          "Es la zona con mayor población, con elevaciones suaves y arroyos",
          "Se localiza al noroeste, es la zona de mayor elevación de la llanura y la menos poblada"
        ]
      },
      {
        id: 5,
        text: "¿En qué consisten los recursos naturales no renovables?",
        options: []
      }
    ]
  };

  const handleAnswerChange = (questionId: number, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Definir respuestas correctas
    const correctAnswers: {[key: number]: string} = {
      1: 'a',
      2: 'c', 
      3: 'c',
      4: 'c'
    };

    // Mostrar celebración si es correcto
    if (correctAnswers[questionId] === answer) {
      setShowCelebration(questionId);
      setTimeout(() => setShowCelebration(null), 2000);
    }
  };

  const getAnswerIcon = (questionId: number, optionIndex: string) => {
    const selectedAnswer = answers[questionId];
    const isSelected = selectedAnswer === optionIndex;
    
    // Definir respuestas correctas
    const correctAnswers: {[key: number]: string} = {
      1: 'a',
      2: 'c', 
      3: 'c',
      4: 'c'
    };
    
    const isCorrect = correctAnswers[questionId] === optionIndex;
    
    if (isSelected && isCorrect) {
      return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 fill-current animate-bounce" />;
    } else if (isSelected && !isCorrect) {
      return <X className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 animate-pulse" />;
    }
    return null;
  };

  const getQuestionIcon = (questionId: number) => {
    const icons = [BookOpen, Star, Heart, Smile];
    const Icon = icons[(questionId - 1) % icons.length];
    return <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />;
  };

  const completedQuestions = Object.keys(answers).length;
  const progress = (completedQuestions / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header con diseño infantil */}
        <div className="bg-purple-50/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-purple-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-300 to-purple-300 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md">
                <span className="text-purple-50 font-bold text-xl sm:text-2xl">ICV</span>
              </div>
            </div>
            
            {/* Barra de progreso divertida */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="text-sm text-purple-600 font-medium text-center sm:text-left">
                {completedQuestions}/5 preguntas
              </div>
              <div className="w-40 sm:w-32 h-3 bg-purple-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-300 to-purple-400 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-2xl">
                {completedQuestions === 5 ? '🎉' : '🌟'}
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 sm:mb-10 px-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-700 mb-2 leading-tight">
            {evaluationData.title}
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-pink-300 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Questions */}
        <div className="space-y-6 sm:space-y-8">
          {evaluationData.questions.map((question) => (
            <div 
              key={question.id} 
              className="bg-blue-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 border border-blue-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              
              {/* Celebración para respuesta correcta */}
              {showCelebration === question.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/90 to-green-100/90 rounded-2xl sm:rounded-3xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl mb-2 animate-bounce">🎉</div>
                    <div className="text-emerald-700 font-bold text-lg sm:text-xl">¡Excelente!</div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-0">
                  {getQuestionIcon(question.id)}
                </div>
                <h3 className="font-bold text-purple-800 text-lg sm:text-xl lg:text-xl leading-relaxed">
                  {question.id}. {question.text}
                </h3>
              </div>
              
              {question.id === 5 ? (
                // Question 5 - Text input con diseño amigable
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={answers[5] as string || ''}
                      onChange={(e) => handleAnswerChange(5, e.target.value)}
                      className="w-full p-4 sm:p-6 bg-gradient-to-br from-purple-100/60 to-pink-100/60 border-2 border-purple-200 rounded-xl sm:rounded-2xl focus:border-purple-400 outline-none resize-none text-base sm:text-lg text-purple-800 placeholder-purple-400 transition-all duration-300"
                      rows={3}
                      placeholder="✍️ Escribe tu respuesta aquí... ¡Puedes hacerlo! 🌟"
                    />
                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-purple-300">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>
              ) : (
                // Multiple choice questions con diseño infantil
                <div className="space-y-3 sm:space-y-4">
                  {question.options.map((option, index) => {
                    const optionLetter = String.fromCharCode(97 + index); // a, b, c
                    const isSelected = answers[question.id] === optionLetter;
                    
                    return (
                      <div 
                        key={optionLetter}
                        className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                          isSelected 
                            ? 'scale-105' 
                            : 'hover:scale-102'
                        }`}
                        onClick={() => handleAnswerChange(question.id, optionLetter)}
                      >
                        <div className={`flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                          isSelected 
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 shadow-lg' 
                            : 'bg-gradient-to-r from-blue-50 to-purple-50 border-purple-150 hover:border-purple-200 hover:shadow-md'
                        }`}>
                          
                          <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-3">
                            <div className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-300 ${
                              isSelected 
                                ? 'bg-purple-300 text-white' 
                                : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                            }`}>
                              {optionLetter}
                            </div>
                            {getAnswerIcon(question.id, optionLetter)}
                          </div>
                          
                          <span className="text-purple-800 flex-1 text-base sm:text-lg leading-relaxed font-medium text-center sm:text-left px-2 sm:px-0">
                            {option}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer motivacional */}
        <div className="mt-8 sm:mt-12 bg-pink-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-pink-200">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
              {completedQuestions === 5 ? '🎊' : completedQuestions >= 3 ? '🌟' : '💪'}
            </div>
            <div className="text-purple-700 font-bold text-lg sm:text-xl lg:text-2xl mb-2 px-2">
              {completedQuestions === 5 
                ? '¡Felicitaciones! Completaste toda la evaluación' 
                : completedQuestions >= 3 
                ? '¡Vas muy bien! Sigue así' 
                : '¡Tú puedes! Continúa respondiendo'
              }
            </div>
            <div className="text-purple-500 text-base sm:text-lg px-2">
              {completedQuestions === 5 
                ? 'Todas tus respuestas han sido guardadas 🎉' 
                : `Te faltan ${5 - completedQuestions} pregunta${5 - completedQuestions === 1 ? '' : 's'} ✨`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSciencesEvaluation;