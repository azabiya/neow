// src/pages/landing/LandingAssistant.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import heroTexture from '/src/assets/hero-texture.png';
import { supabase } from '../../supabaseClient'; // Import supabase client

// --- ICONOS (Sin cambios) ---

const MoneyIcon = () => (
    <svg className="text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 16C7 16 8.5 18 12 18C15.5 18 17 16 17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const FlexibilityIcon = () => (
    <svg className="text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const GrowthIcon = () => (
     <svg className="text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const RequirementIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 15L11 17L15 13" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const InstagramIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
        <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2"/>
        <path d="M16 11.37a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/>
        <path d="M17.5 6.5h.01" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const FacebookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const TikTokIcon = () => (
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
        <path d="M16 4H12V12A4 4 0 1016 16V4Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4V16A4 4 0 118 12H12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


// --- COMPONENTE ACORDEÓN (FAQ) ---
const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-[#E0DDDD] rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
            >
                <span className="font-semibold text-black">{question}</span>
                <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-gray-600">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};


// --- COMPONENTE PRINCIPAL ---
const LandingAssistant: React.FC = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testimonials, setTestimonials] = useState([]);
    const carouselRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

     useEffect(() => {
         setTestimonials([
            { quote: '"Ser asistente en YANA MAKI me ha permitido usar mis conocimientos para ganar un dinero extra sin descuidar mis estudios en la ESPOL. ¡Es genial!"', name: 'Carlos Zambrano', role: 'Asistente de Ingeniería' },
            { quote: '"La plataforma es súper fácil de usar y siempre hay nuevas oportunidades. Me encanta la flexibilidad que ofrece para nosotros los estudiantes en Ecuador."', name: 'Mónica Velez', role: 'Asistente de Arquitectura' },
            { quote: '"He mejorado mis propias habilidades académicas ayudando a otros. Además, los pagos son puntuales y seguros, directo a mi cuenta del Pichincha."', name: 'Sofía López', role: 'Asistente de Comunicaciones' },
         ]);
    }, []);

    const steps = [
        { title: 'Regístrate y Completa tu Perfil', description: 'Únete a nuestra comunidad de asistentes en Ecuador y configura tus áreas de especialización y tarifas.' },
        { title: 'Recibe y Acepta Tareas', description: 'Explora las solicitudes de tareas disponibles que coincidan con tus habilidades y acéptalas.' },
        { title: 'Completa y Gana', description: 'Realiza un trabajo de alta calidad, entrégalo a tiempo y recibe tu pago de forma segura.' }
    ];

    const requirements = [
        { text: "Ser estudiante universitario activo en Ecuador." },
        { text: "Excelencia académica comprobada." },
        { text: "Responsabilidad y compromiso." },
        { text: "Buenas habilidades de comunicación." },
        { text: "Acceso a internet y herramientas digitales." },
        { text: "Cuenta bancaria en Ecuador para recibir pagos." },
    ];

    const faqItems = [
        { q: "¿Cómo y cuándo recibiré mis pagos?", a: "Los pagos se procesan semanalmente a través de transferencia bancaria a la cuenta que registres en tu perfil. Recibirás el pago una vez que el estudiante apruebe la tarea que completaste." },
        { q: "¿Puedo rechazar una solicitud de tarea?", a: "Sí, tienes total libertad de aceptar o rechazar las solicitudes de tareas que recibas. Te recomendamos aceptar solo aquellas que se ajusten a tus conocimientos y disponibilidad." },
        { q: "¿Qué tipo de soporte ofrece YANA MAKI a los asistentes?", a: "Contamos con un equipo de soporte local en Ecuador disponible por WhatsApp para ayudarte con cualquier duda sobre la plataforma, los pagos o la comunicación con los estudiantes." },
        { q: "¿Cómo configuro mis precios por las tareas?", a: "Dentro de tu perfil, podrás establecer tus tarifas basadas en criterios como número de páginas, complejidad o porcentaje de IA permitido. Esto te da control total sobre tus ganancias." },
        { q: "¿Hay un mínimo de tareas que debo completar?", a: "No hay ningún mínimo. Tienes total flexibilidad para decidir cuántas tareas quieres realizar. YANA MAKI se adapta a tu horario de estudiante, no al revés." }
    ];

    const itemsPerPage = 3;

    const startAutoPlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % (testimonials.length || 1));
        }, 5000);
    }, [testimonials.length]);

    const stopAutoPlay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handlePrev = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + testimonials.length) % testimonials.length);
        startAutoPlay();
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % testimonials.length);
        startAutoPlay();
    };
    
    useEffect(() => {
        if (testimonials.length > 0) {
            startAutoPlay();
        }
        return () => stopAutoPlay();
    }, [testimonials, startAutoPlay]);

    return (
        <div className="min-h-screen bg-white font-inter text-black overflow-x-hidden">
            {/* Hero Section */}
            <section
                className="relative min-h-screen flex flex-col items-center bg-cover bg-center"
                style={{ backgroundImage: `url(${heroTexture})` }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <header className="w-full max-w-screen-2xl mx-auto py-5 absolute top-0 z-10 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center border-b border-white/20 pb-4">
                        <div className="flex items-center gap-4 md:gap-8">
                            <img src="/src/assets/logo.svg" alt="YANA MAKI" className="h-10 cursor-pointer" onClick={() => navigate('/')} />
                            <nav className="hidden md:flex items-center">
                                <a href="/" className="text-white font-medium hover:text-gray-200 transition-colors">Estudiante</a>
                            </nav>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <button onClick={() => navigate('/login')} className="px-4 md:px-6 py-2 text-sm font-semibold bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">Iniciar sesión</button>
                            <button onClick={() => navigate('/register')} className="px-4 md:px-6 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-yellow-600 transition-colors">Regístrate</button>
                        </div>
                    </div>
                </header>
                <div className="relative z-[5] flex-grow flex flex-col justify-center items-center text-center w-full px-4 sm:px-6 lg:px-8">
                    <h2 className="font-bebas text-7xl sm:text-8xl md:text-9xl lg:text-[128px] leading-none">
                        <span className="text-white">GANA DINERO</span><br/>
                        <span className="text-black">HACIENDO TAREAS</span>
                    </h2>
                    <p className="mt-4 max-w-3xl text-white text-sm md:text-base">Aprovecha tus conocimientos académicos y genera ingresos extra en tu tiempo libre ayudando a otros estudiantes en Ecuador.</p>
                    <div className="mt-20 w-full max-w-[800px] relative">
                        <input type="email" placeholder="Ingresa tu correo para empezar" className="w-full pl-6 pr-16 py-4 bg-white/20 text-white placeholder-white/80 border border-white/80 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm shadow-lg" />
                        <button onClick={() => navigate('/register')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors focus:outline-none"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
                    </div>
                </div>
            </section>
             {/* Qué es YANA MAKI? Section */}
            <section className="py-20 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-black">¿Qué es <span className="text-primary">YANA MAKI?</span></h2>
                    <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed">YANA MAKI es la plataforma hecha por y para estudiantes en Ecuador. Te conectamos con asistentes académicos verificados de las mejores universidades del país para ayudarte con tus tareas, proyectos y trabajos. ¡Delegar nunca fue tan fácil y seguro!</p>
                    <div className="mt-10"><button onClick={() => navigate('/register')} className="px-8 py-3 text-base font-semibold bg-primary text-white rounded-lg hover:bg-yellow-600 transition-colors">Regístrate</button></div>
                </div>
            </section>           
            {/* Beneficios Section */}
            <section className="py-20 lg:py-24 bg-white">
                 <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12 lg:mb-16"><h2 className="text-3xl md:text-4xl font-bold text-black">Beneficios de ser un Asistente <span className="text-primary">YANA MAKI</span></h2></div>
                     <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 md:p-12">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center">
                             <div className="flex flex-col items-center">
                                 <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-4"><MoneyIcon /></div>
                                 <h3 className="text-xl font-bebas tracking-wide font-semibold text-black">GANA DINERO EXTRA</h3>
                                 <p className="mt-2 text-sm text-gray-500">Recibe pagos seguros por cada tarea que completes en tu cuenta bancaria de Ecuador.</p>
                             </div>
                              <div className="flex flex-col items-center">
                                 <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-4"><FlexibilityIcon /></div>
                                 <h3 className="text-xl font-bebas tracking-wide font-semibold text-black">HORARIO FLEXIBLE</h3>
                                 <p className="mt-2 text-sm text-gray-500">Trabaja cuándo y dónde quieras, adaptado a tu vida estudiantil.</p>
                             </div>
                              <div className="flex flex-col items-center">
                                 <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-4"><GrowthIcon /></div>
                                 <h3 className="text-xl font-bebas tracking-wide font-semibold text-black">DESARROLLA TUS HABILIDADES</h3>
                                 <p className="mt-2 text-sm text-gray-500">Refuerza tus conocimientos y gana experiencia en tu área de estudio.</p>
                             </div>
                         </div>
                         <div className="mt-12 text-center"><button onClick={() => navigate('/register')} className="px-8 py-3 text-base font-semibold bg-primary text-white rounded-lg hover:bg-yellow-600 transition-colors">Únete ahora</button></div>
                     </div>
                 </div>
            </section>
            
            {/* Cómo funciona Section */}
            <section className="py-20 lg:py-24 bg-[#F7F7F7]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-black">Cómo funciona</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-base text-gray-600">Es muy simple empezar a ganar dinero con tu conocimiento.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                        <div className="relative">
                            <div className="absolute top-8 left-8 bottom-8 w-0.5 bg-yellow-200 hidden md:block"></div>
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-start relative" style={{ paddingBottom: index === steps.length - 1 ? 0 : '3rem' }}>
                                    <div className="flex-shrink-0 w-16 h-16 bg-white border-2 border-primary rounded-full flex items-center justify-center text-primary font-bold text-2xl z-10">{index + 1}</div>
                                    <div className="ml-6 pt-1">
                                        <h3 className="text-xl font-bold text-black">{step.title}</h3>
                                        <p className="mt-2 text-gray-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center md:justify-end">
                            <button onClick={() => navigate('/register')} className="px-8 py-3 text-base font-semibold bg-primary text-white rounded-lg hover:bg-yellow-600 transition-colors">Empezar ahora</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-yellow-100 py-12">
                <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4 sm:px-6 lg:px-0">
                    <div><p className="text-5xl lg:text-6xl font-extrabold text-black font-days">+150</p><p className="mt-2 text-base text-gray-800">Estudiantes</p></div>
                    <div><p className="text-5xl lg:text-6xl font-extrabold text-black font-days">$27</p><p className="mt-2 text-base text-gray-800">Ingreso Promedio por tarea</p></div>
                    <div><p className="text-5xl lg:text-6xl font-extrabold text-black font-days">+80%</p><p className="mt-2 text-base text-gray-800">De nuestros ingresos son para asistentes</p></div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-black">Qué dicen nuestros asistentes:</h2>
                        {testimonials.length > itemsPerPage && (
                            <div className="flex gap-4">
                                <button onClick={handlePrev} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                                <button onClick={handleNext} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                            </div>
                        )}
                    </div>
                     <div className="overflow-hidden" ref={carouselRef}>
                        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${(currentIndex * 100) / (testimonials.length > 0 ? itemsPerPage : 1)}%)` }}>
                            {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
                                <div key={index} className="flex flex-col flex-shrink-0 w-full md:w-1/3 px-4">
                                    <p className="text-gray-700 italic flex-grow">"{testimonial.quote}"</p>
                                    <div className="flex items-center mt-6">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl font-bold text-primary">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-black">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : <p className="text-center w-full">Aún no hay testimonios. ¡Anímate a ser el primero!</p>}
                        </div>
                    </div>
                </div>
            </section>

            {/* Requisitos Section */}
            <section className="py-20 lg:py-24 bg-[#F7F7F7]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-black">Qué necesitas para <span className="text-primary">unirte</span></h2>
                    <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed">Buscamos a los mejores estudiantes de Ecuador para garantizar la calidad de nuestro servicio. Estos son los requisitos para formar parte de nuestra comunidad de asistentes.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
                        {requirements.map((req, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <RequirementIcon />
                                </div>
                                <p className="font-semibold text-gray-800">{req.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* FAQ Section */}
            <section className="py-20 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">Preguntas frecuentes</h2>
                    <div className="space-y-4">
                        {faqItems.map((item, i) => <FaqItem key={i} question={item.q} answer={item.a} />)}
                    </div>
                </div>
            </section>
            
            {/* Final CTA Section */}
            <section className="py-20 lg:py-24">
                 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="bg-white border border-[#E0DDDD] rounded-2xl shadow-xl p-8 md:p-12 text-center">
                          <h2 className="text-3xl font-bold text-primary">¿Listo para empezar a ganar?</h2>
                          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                             Únete a nuestra comunidad de asistentes académicos en Ecuador y convierte tu conocimiento en ingresos. El registro es rápido y sencillo.
                          </p>
                          <div className="mt-8">
                              <button onClick={() => navigate('/register')} className="px-8 py-3 text-base font-semibold bg-primary text-white rounded-lg hover:bg-yellow-600 transition-colors">
                                  Regístrate como asistente
                              </button>
                           </div>
                       </div>
                   </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-10 pb-8 border-t border-gray-200">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <img src="/src/assets/logo.svg" alt="YANA MAKI" className="h-10" />
                        </div>
                        <div className="flex gap-4 md:gap-6 text-black">
                            <a href="#" className="hover:text-primary"><InstagramIcon /></a>
                            <a href="#" className="hover:text-primary"><FacebookIcon /></a>
                            <a href="#" className="hover:text-primary"><TikTokIcon /></a>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <p>© 2025 YANA MAKI. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingAssistant;