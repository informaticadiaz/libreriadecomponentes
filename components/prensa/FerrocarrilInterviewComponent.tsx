import React from 'react';
import { Train, Users, DollarSign, Wrench, MapPin, Quote } from 'lucide-react';

// Tipos TypeScript para el contenido
interface Question {
  id: number;
  icon: React.ReactNode;
  title: string;
  content: string[];
}

interface InterviewData {
  title: string;
  subtitle: string;
  questions: Question[];
  finalReflection: {
    title: string;
    content: string;
  };
}

const FerrocarrilInterviewComponent: React.FC = () => {
  const interviewData: InterviewData = {
    title: "Entrevista Radial sobre Privatización Ferroviaria",
    subtitle: "La experiencia argentina de los 90",
    questions: [
      {
        id: 1,
        icon: <MapPin className="w-6 h-6" />,
        title: "¿Cuáles son las áreas que se pueden ver afectadas por la Privatización?",
        content: [
          "Mirá, la privatización del ferrocarril no es solo un tema de trenes. Cuando privatizamos los ferrocarriles en los 90, se afectó todo el país.",
          "**El territorio se fragmentó.** Perdimos 32 mil kilómetros de vías - eso es como perder dos tercios de toda la red ferroviaria. Pueblos enteros quedaron aislados, sin forma de conectarse con el resto del país.",
          "**Se destruyó nuestra industria.** Los talleres ferroviarios que fabricaban locomotoras y vagones cerraron para siempre. Perdimos el conocimiento de décadas, y ahora dependemos de importar todo del exterior.",
          "**Comunidades enteras desaparecieron.** Hay pueblos como Patricios que literalmente se convirtieron en pueblos fantasma. La gente tuvo que emigrar a las grandes ciudades porque ya no había trabajo.",
          "**Perdimos soberanía en el transporte.** Antes movíamos las cosas en tren, que es más barato. Ahora todo va por camión, que cuesta 72% más. Esos costos los pagamos todos cuando compramos cualquier cosa.",
          "Es decir, no fue solo privatizar una empresa. Fue cambiar la forma en que funciona todo el país."
        ]
      },
      {
        id: 2,
        icon: <Users className="w-6 h-6" />,
        title: "¿Se anticipan cambios en las condiciones laborales o en la estabilidad laboral?",
        content: [
          "Los trabajadores ferroviarios fueron los que más sufrieron. Y su experiencia nos tiene que servir de ejemplo.",
          "**Se perdieron 77 mil empleos de un día para el otro.** Imaginate: de 95 mil trabajadores quedaron solo 17 mil. Eso es echar a 8 de cada 10 trabajadores.",
          "**Los que quedaron trabajaron peor y cobraron menos.** Los maquinistas empezaron a trabajar jornadas más largas por menos plata. El propio Ministerio de Trabajo tuvo que salir a advertir que estaban haciendo trabajar demasiadas horas a la gente, pero las empresas no dieron bola.",
          "**Los planes de reconversión fracasaron.** El gobierno prometió que los ex-ferroviarios iban a poder poner pequeños negocios. Pero casi todos quebraron porque dependían del ferrocarril que ya no existía. La mayoría terminó desocupada.",
          "**Se perdieron oficios únicos.** Maquinista, técnico en señales, especialista en material rodante - estos trabajos requieren años de capacitación. Una vez que se perdieron, no se pueden recuperar fácil.",
          "La privatización no solo destruye empleos, destruye formas de vida y comunidades enteras."
        ]
      },
      {
        id: 3,
        icon: <Train className="w-6 h-6" />,
        title: "¿Qué opinión tienes sobre la Privatización de los Trenes Argentinos?",
        content: [
          "Fue un desastre total. Y lo digo con todas las letras porque los hechos lo demuestran.",
          "**Fue lo peor de los dos mundos.** Seguimos poniendo la misma plata del Estado que antes, pero el servicio era mucho peor. O sea, gastamos lo mismo y recibimos menos.",
          "**Menem amenazó a los trabajadores con \"ramal que para, ramal que cierra\".** Eso resume todo: se priorizó la rentabilidad por sobre la integración del país. No importaba si un pueblo quedaba aislado, lo que importaba era que diera plata.",
          "**Destruimos patrimonio de más de 100 años.** Argentina tenía uno de los sistemas ferroviarios más grandes del mundo. Tirar 32 mil kilómetros de vías es como tirar abajo el Obelisco o quemar la Biblioteca Nacional.",
          "**Terminó en tragedia.** La tragedia de Once - 51 muertos y 703 heridos - no fue casualidad. Fue la consecuencia de años de abandono por parte de empresas que solo pensaban en ganar plata. Solo en 2012 hubo más de 1200 accidentes ferroviarios.",
          "**Tuvimos que estatizar todo de vuelta.** Entre 2012 y 2015 el Estado tuvo que hacerse cargo otra vez porque el sistema colapsó. Eso demuestra que hay cosas que no pueden ser negocio."
        ]
      },
      {
        id: 4,
        icon: <Wrench className="w-6 h-6" />,
        title: "¿Cómo podría la Privatización afectar la infraestructura ferroviaria y las inversiones en mantenimiento?",
        content: [
          "Las empresas privadas no mantienen la infraestructura porque no les conviene económicamente.",
          "**Dejaron todo deteriorarse.** De toda la red ferroviaria, solo 500 kilómetros quedaron en buen estado. El resto, 25 mil kilómetros, estaba en mal estado o directamente intransitable.",
          "**Los trenes andaban lentísimo.** Por el mal estado de las vías, los trenes de carga andaban a 12 o 15 kilómetros por hora. A esa velocidad, era más rápido ir caminando.",
          "**No invirtieron un peso.** Aunque se habían comprometido a invertir, las empresas cada vez ponían menos plata. Preferían llevarse las ganancias que arreglar las vías o comprar material rodante nuevo.",
          "**Solo mantuvieron lo que les daba plata.** Arreglaron únicamente los tramos que iban a los puertos, donde podían hacer buenos negocios. El resto del país que se arregle como pueda.",
          "**El Estado tuvo que pagar todo después.** Cuando estatizamos de vuelta, tuvimos que invertir millones para reparar el desastre que dejaron las privadas. En 10 años apenas pudimos arreglar mil kilómetros de vías.",
          "Es simple: a una empresa privada no le conviene mantener algo que va a usar durante décadas, le conviene exprimir al máximo lo que está."
        ]
      },
      {
        id: 5,
        icon: <DollarSign className="w-6 h-6" />,
        title: "¿Cómo la Privatización podría afectar las Tarifas y accesibilidad del servicio?",
        content: [
          "Con la privatización, la gente pagó más para viajar peor.",
          "**Los pasajes se triplicaron.** El Banco Mundial había calculado que después de 10 años la gente iba a pagar tres veces más por el mismo viaje. Y así fue.",
          "**Eliminaron los trenes del interior.** Cerraron casi todos los servicios de larga distancia. Solo quedó el tren a Mar del Plata. Si vivías en Tucumán y querías ir a Córdoba en tren, te quedaste sin esa opción.",
          "**El ferrocarril dejó de ser para todos.** Antes cualquier familia trabajadora podía viajar en tren. Después de la privatización se volvió un lujo que no todos se podían permitir.",
          "**Peor servicio por más plata.** Los trenes llegaban tarde, iban llenos como latas de sardinas, y había menos frecuencias. Pero costaban más.",
          "**Las provincias tuvieron que armar sus propios trenes.** Buenos Aires creó Ferrobaires, Chaco hizo lo suyo, pero sin plata terminaron cerrando también.",
          "**Los costos se trasladaron a todo.** Como el transporte se encareció 72%, ese costo se suma al precio de la comida, la ropa, todo lo que compramos.",
          "En definitiva: privatizar convierte un servicio público en un negocio privado, y los perdidores somos siempre los mismos - la gente común."
        ]
      }
    ],
    finalReflection: {
      title: "Reflexión Final",
      content: "El ferrocarril no es solo un medio de transporte - es lo que une al país. Cuando lo convertís en negocio, estás diciendo que hay argentinos de primera y de segunda, que hay pueblos que merecen estar conectados y otros que no. La experiencia de los 90 nos enseñó que hay cosas que no pueden ser negocio. Y el ferrocarril es una de esas cosas."
    }
  };

  const formatContent = (text: string) => {
    // Procesar texto en negrita
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-red-700">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg p-8 mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <Train className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">{interviewData.title}</h1>
            <p className="text-red-100 text-lg">{interviewData.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="mb-8 grid md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">68%</div>
          <div className="text-sm text-gray-700">Reducción de la red ferroviaria</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">77,800</div>
          <div className="text-sm text-gray-700">Empleos ferroviarios perdidos</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">72%</div>
          <div className="text-sm text-gray-700">Incremento en costos logísticos</div>
        </div>
      </div>

      {/* Questions and Answers - Continuous Flow */}
      <div className="space-y-8">
        {interviewData.questions.map((question, questionIndex) => (
          <article key={question.id} className="bg-white rounded-lg shadow-md p-8">
            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  {question.icon}
                </div>
                <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  Pregunta {question.id}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {question.title}
              </h2>
            </div>

            {/* Answer Content */}
            <div className="space-y-4">
              {question.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed text-lg">
                  {formatContent(paragraph)}
                </p>
              ))}
            </div>

            {/* Separator for readability */}
            {questionIndex < interviewData.questions.length - 1 && (
              <div className="mt-8 pt-4 border-t border-gray-100"></div>
            )}
          </article>
        ))}
      </div>

      {/* Final Reflection */}
      <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-8 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
          <Quote className="w-8 h-8 text-gray-300 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-4">{interviewData.finalReflection.title}</h2>
            <p className="text-gray-100 text-lg leading-relaxed">
              {interviewData.finalReflection.content}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Resumen de Temas Tratados</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {interviewData.questions.map((question) => (
            <div key={question.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-red-100 text-red-600 rounded">
                {question.icon}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {question.title.length > 60 
                  ? question.title.substring(0, 60) + '...'
                  : question.title
                }
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Basado en la experiencia histórica de las privatizaciones ferroviarias argentinas de los años 1990</p>
      </div>
    </div>
  );
};

export default FerrocarrilInterviewComponent;