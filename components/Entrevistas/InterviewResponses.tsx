'use client';

import React from 'react';

interface Question {
  id: number;
  question: string;
  answer: string;
}

const InterviewResponses: React.FC = () => {
  const questions: Question[] = [
    {
      id: 1,
      question: "¿Qué opina sobre la postura de Patricia Bullrich de defender a policías acusados de asesinatos?",
      answer: "Me parece muy grave lo que está haciendo Bullrich. Un policía mató a un nene de 7 años y ella salió inmediatamente a defenderlo. Eso está mal. Cuando pasa algo así, lo primero que tiene que hacer una ministra es investigar qué pasó, no defender al policía sin saber nada. Su trabajo es cuidar a todos los ciudadanos, no solo a los policías. Si siempre los defiende sin importar lo que hagan, les está dando carta blanca para hacer cualquier cosa."
    },
    {
      id: 2,
      question: "¿Cree que la defensa de policías asesinos es una forma de proteger la seguridad ciudadana o es una forma de impunidad?",
      answer: "Es pura impunidad, nada más. No tiene nada que ver con seguridad. La seguridad de verdad es cuando vos sabés que la policía te va a cuidar, no que te puede matar por error y nadie va a hacer nada. Si los policías saben que siempre los van a defender, van a seguir disparando sin cuidado. Eso no nos protege a nosotros, nos pone en peligro. Un policía tiene que saber que si hace las cosas mal, va a tener consecuencias."
    },
    {
      id: 3,
      question: "¿Cómo cree que la postura de Bullrich afecta la confianza en las fuerzas de seguridad?",
      answer: "La destroza por completo. Yo soy padre y cuando veo que mataron a un nene y la ministra defiende al que disparó, me da miedo. ¿Qué garantía tengo de que no le pase lo mismo a mi hijo? La gente ya no confía en la policía, ahora tienen miedo. Y tenés razón en tener miedo si sabés que pueden matarte 'por error' y no va a pasar nada. Así no se puede vivir. La policía tiene que darnos tranquilidad, no más miedo del que ya tenemos."
    },
    {
      id: 4,
      question: "¿Qué medidas cree que deberían tomarse para abordar la violencia policial y garantizar la seguridad ciudadana?",
      answer: "Primero, que los policías sepan cuándo pueden y cuándo no pueden disparar. No podés disparar en una parada de colectivo llena de gente inocente. Segundo, que los entrenen mejor para que no cometan estos errores. Tercero, cuando pase algo así, que se investigue en serio, no que salgan a defenderlos de una. Y cuarto, si un policía mata a alguien inocente, que pague como cualquier persona. No puede haber dos justicias: una para los policías y otra para el resto."
    },
    {
      id: 5,
      question: "¿Cree que la postura de Bullrich es representativa de la opinión pública sobre la seguridad y la justicia?",
      answer: "Para nada. La gente común no piensa así. Todos queremos que nos cuiden de los chorros, pero no queremos que nos maten los que nos tienen que cuidar. Es sentido común: si un policía mata a un nene inocente, algo hizo mal. La mayoría de la gente entiende la diferencia entre pelear contra los delincuentes y matar gente inocente. Bullrich habla como si fuéramos tontos, como si no supiéramos que se puede combatir el delito sin matar pibes. Su postura solo gusta a los fanáticos que creen que todo se soluciona a los tiros."
    }
  ];

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Respuesta copiada al portapapeles');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const copyAllResponses = async (): Promise<void> => {
    const allText = questions.map(q => `${q.question}\n\n${q.answer}`).join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(allText);
      alert('Todas las respuestas copiadas al portapapeles');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Respuestas para Entrevista Radial
        </h1>
        <p className="text-gray-600 mb-4">
          Crítica a la postura de Patricia Bullrich sobre la defensa de policías
        </p>
        <button
          onClick={copyAllResponses}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          📋 Copiar todas las respuestas
        </button>
      </header>

      <div className="space-y-8">
        {questions.map((q) => (
          <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-blue-800 leading-relaxed pr-4">
                {q.id}. {q.question}
              </h3>
              <button
                onClick={() => copyToClipboard(q.answer)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200 flex-shrink-0"
                title="Copiar esta respuesta"
              >
                📋
              </button>
            </div>
            
            <div className="bg-white p-4 rounded border-l-4 border-blue-400">
              <p className="text-gray-800 leading-relaxed text-base">
                {q.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-3 text-lg">
          💡 Consejos para la entrevista:
        </h3>
        <ul className="text-yellow-700 space-y-2 text-base">
          <li>• Mantén un tono firme pero respetuoso</li>
          <li>• Usa ejemplos concretos del caso Thiago cuando sea relevante</li>
          <li>• Enfatiza que criticar esta postura no significa estar a favor del delito</li>
          <li>• Destaca que una policía responsable es más efectiva que una impune</li>
        </ul>
      </div>
    </div>
  );
};

export default InterviewResponses;