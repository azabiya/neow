// src/pages/landing/LandingStudent.tsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import heroTexture from '/src/assets/hero-texture.png';
import { supabase } from '../../supabaseClient';

// --- ICONOS (Sin cambios) ---
const QualityIcon = () => (
    <svg className="text-[#00B8DB]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const TimeIcon = () => (
    <svg className="text-[#00B8DB]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const SecurityIcon = () => (
     <svg className="text-[#00B8DB]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9992 17.962 22.5891 16.9631 21.8519 16.2259C21.1147 15.4887 20.1158 15.0786 19.078 15.078" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.9649 3.44265 17.8248 4.02484 18.4685 4.80031C19.1122 5.57579 19.5 6.50556 19.5 7.478C19.5 8.45044 19.1122 9.38021 18.4685 10.1557C17.8248 10.9312 16.9649 11.5134 16 11.826" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
const LandingStudent: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ completedTasks: 0, availableAssistants: 0, satisfactionRate: 0 });
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const { count: completedTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).in('status', ['Tarea Calificada', 'Asistente Remunerado']);
            const { count: availableAssistants } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'assistant').eq('is_active', true);
            const { data: ratingsData } = await supabase.from('ratings').select('rating');
            
            let satisfactionRate = 98;
            if (ratingsData && ratingsData.length > 0) {
                const totalRating = ratingsData.reduce((acc, r) => acc + r.rating, 0);
                satisfactionRate = Math.round((totalRating / (ratingsData.length * 5)) * 100);
            }

            setStats({
                completedTasks: completedTasks || 150,
                availableAssistants: availableAssistants || 25,
                satisfactionRate: satisfactionRate
            });
        };
        fetchStats();

        setTestimonials([
            { quote: '"Me gustó que se puede organizar trabajos grupales y hacer que cada integrante envié su parte. ¡Full recomendado para trabajos grupales!"', name: 'Anthony Intriago', role: 'Estudiante de la ULEAM' },
            { quote: '"Los resultados siempre son buenos y si no te convencen te ayudan para que te hagan otro trabajo"', name: 'Julia Espinoza', role: 'Estudiante de la PUCE' },
            { quote: '"La plataforma es súper fácil de usar. Pude encargar un ensayo y el resultado fue 10/10."', name: 'Doanny Loor', role: 'Estudiante, PUCE' },
            { quote: '"Lo he probado ya 3 veces y hasta ahora todo ha estado muy bien. Es muy útil para cuándo estás a full y no tienes tiempo"', name: 'Roger Alava', role: 'Estudiante, UNEMI' },
        ]);
    }, []);
    
    const getItemsPerPage = useCallback(() => window.innerWidth >= 768 ? 3 : 1, []);
    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

    useEffect(() => {
        const handleResize = () => setItemsPerPage(getItemsPerPage());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [getItemsPerPage]);
    
    const loopedTestimonials = useMemo(() => {
        if (testimonials.length === 0 || testimonials.length <= itemsPerPage) return testimonials;
        const firstItem = testimonials[0];
        const lastItem = testimonials[testimonials.length - 1];
        return [lastItem, ...testimonials, firstItem];
    }, [testimonials, itemsPerPage]);

    const handleNext = useCallback(() => {
        setCurrentIndex(prev => prev + 1);
        if (!transitionEnabled) setTransitionEnabled(true);
    }, [transitionEnabled]);

    const handlePrev = () => {
        setCurrentIndex(prev => prev - 1);
        if (!transitionEnabled) setTransitionEnabled(true);
    };
    
    const handleTransitionEnd = () => {
        if (currentIndex <= 0) {
            setTransitionEnabled(false);
            setCurrentIndex(testimonials.length);
        } else if (currentIndex >= testimonials.length + 1) {
            setTransitionEnabled(false);
            setCurrentIndex(1);
        }
    };

    const startAutoPlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            handleNext();
        }, 5000);
    }, [handleNext]);

    useEffect(() => {
        if (testimonials.length > itemsPerPage) {
            startAutoPlay();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [testimonials.length, itemsPerPage, startAutoPlay]);
    
    const steps = [
        { title: 'Solicitas', description: 'Describe tu tarea, sube los archivos necesarios y elige al asistente perfecto para ti.' },
        { title: 'Creamos', description: 'Tu asistente se pondrá a trabajar, manteniéndote al día con avances si es necesario.' },
        { title: 'Recibes', description: 'Recibe tu tarea completada en el tiempo acordado, lista para revisar y aprobar.' }
    ];
    
    const faqItems = [
        { q: "¿Qué pasa si no recibo mi tarea a tiempo?", a: "Nuestra prioridad es la puntualidad. Si tu asistente no cumple con la tarea a tiempo se te devolverá el 100% de tu dinero. Te recomendamos fijar una fecha de entrega anterior a tu fecha de presentación, para que puedas reasignar la tarea." },
        { q: "¿Puedo solicitar revisiones en mi tarea?", a: "¡Claro que sí! Tienes derecho a solicitar revisiones si el trabajo entregado no cumple con los requisitos iniciales. Queremos que quedes 100% satisfecho con el resultado." },
        { q: "¿Son seguros mis datos y pagos?", a: "Totalmente. Tu pago solo se libera al asistente cuando tú apruebas la tarea final. si no es así se te devuelve tu dinero." },
        { q: "¿Qué materias y tipos de tareas cubren?", a: "Cubrimos una amplia gama de carreras universitarias en Ecuador, desde ingenierías y derecho hasta comunicación y carrera médicas Puedes encargar ensayos, proyectos, presentaciones, ¡y mucho más!" }
    ];

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
                            <img src="/src/assets/logo.svg" alt="IntiHelp" className="h-10 cursor-pointer" onClick={() => navigate('/')} />
                            <nav className="hidden md:flex items-center">
                                <a href="/assistants" className="text-white font-medium hover:text-gray-200 transition-colors">Asistente</a>
                            </nav>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <button onClick={() => navigate('/login')} className="px-4 md:px-6 py-2 text-sm font-semibold bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">Ingresa</button>
                            <button onClick={() => navigate('/register')} className="px-4 md:px-6 py-2 text-sm font-semibold bg-[#00B8DB] text-white rounded-lg hover:bg-blue-600 transition-colors">Regístrate</button>
                        </div>
                    </div>
                </header>
                <div className="relative z-[5] flex-grow flex flex-col justify-center items-center text-center w-full px-4 sm:px-6 lg:px-8">
                    <h2 className="font-bebas text-7xl sm:text-8xl md:text-9xl lg:text-[128px] leading-none">
                        <span className="text-white">ENCARGA TAREAS</span><br/>
                        <span className="text-black">100% HUMANAS</span>
                    </h2>
                    <p className="mt-4 max-w-3xl text-white text-sm md:text-base">La plataforma #1 para estudiantes universitarios en Ecuador. Conecta con los mejores asistentes y ahorra tu tiempo.</p>
                    <div className="mt-20 w-full max-w-[800px] relative">
                        <input type="text" placeholder="¿Qué tarea quieres realizar?" className="w-full pl-6 pr-16 py-4 bg-white/20 text-white placeholder-white/80 border border-white/80 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm shadow-lg" />
                        <button onClick={() => navigate('/register')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors focus:outline-none"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
                    </div>
                </div>
            </section>
            
            {/* Qué es IntiHelp? Section */}
            <section className="py-20 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-black">¿Qué es <span className="text-[#00B8DB]">IntiHelp?</span></h2>
                    <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed">IntiHelp es una plataforma hecha por y para estudiantes en Ecuador. Te conectamos con asistentes académicos verificados de las mejores universidades del país para ayudarte con tus tareas, proyectos y trabajos. ¡Encargar tareas nunca fue tan fácil y seguro!</p>
                    <div className="mt-10"><button onClick={() => navigate('/register')} className="px-8 py-3 text-base font-semibold bg-[#00B8DB] text-white rounded-lg hover:bg-blue-600 transition-colors">Regístrate</button></div>
                </div>
            </section>

            {/* Por qué usar IntiHelp? Section */}
            <section className="py-20 lg:py-24 bg-white">
                 <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 lg:mb-16"><h2 className="text-3xl md:text-4xl font-bold text-black">¿Por qué usar <span className="text-[#00B8DB]">IntiHelp?</span></h2></div>
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><QualityIcon /></div>
                                <h3 className="text-xl font-bebas tracking-wide font-semibold text-black">TAREAS DE CALIDAD</h3>
                                <p className="mt-2 text-sm text-gray-500">Asistentes verificados y calificados por otros estudiantes garantizan un trabajo impecable.</p>
                            </div>
                             <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><TimeIcon /></div>
                                <h3 className="text-xl font-bebas tracking-wide font-semibold text-black">ENTREGAS A TIEMPO</h3>
                                <p className="mt-2 text-sm text-gray-500">Establece tu fecha de entrega y recibe tu tarea sin demoras. ¡Adiós al estrés de última hora!</p>
                            </div>
                             <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><SecurityIcon /></div>
                                <h3 className="text-xl font-bebas tracking-wide font-semibold text-black">PAGOS SEGUROS</h3>
                                <p className="mt-2 text-sm text-gray-500">Tu pago se libera al asistente solo cuando apruebas la entrega final de la tarea sino ¡Te dolvemos tu dinero!.</p>
                            </div>
                        </div>
                        <div className="mt-12 text-center"><button onClick={() => navigate('/register')} className="px-8 py-3 text-base font-semibold bg-[#00B8DB] text-white rounded-lg hover:bg-blue-600 transition-colors">Regístrate</button></div>
                    </div>
                 </div>
            </section>

            {/* Cómo funciona Section */}
            <section className="py-20 lg:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-black">Cómo funciona</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-base text-gray-600">En solo 3 simples pasos, tendrás tu tarea lista.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-16">
                        <div className="relative">
                            <div className="absolute top-8 left-8 bottom-8 w-0.5 bg-blue-200 hidden md:block"></div>
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-start relative" style={{ paddingBottom: index === steps.length - 1 ? 0 : '3rem' }}>
                                    <div className="flex-shrink-0 w-16 h-16 bg-white border-2 border-[#00B8DB] rounded-full flex items-center justify-center text-[#00B8DB] font-bold text-2xl z-10">{index + 1}</div>
                                    <div className="ml-6 pt-1">
                                        <h3 className="text-xl font-bold text-black">{step.title}</h3>
                                        <p className="mt-2 text-gray-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center md:justify-end"><button onClick={() => navigate('/register')} className="px-8 py-3 text-base font-semibold bg-[#00B8DB] text-white rounded-lg hover:bg-blue-600 transition-colors">Crear tarea</button></div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-blue-100 py-12">
                <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4 sm:px-6 lg:px-0">
                    <div><p className="text-5xl lg:text-6xl font-extrabold text-black font-days">+{stats.completedTasks}</p><p className="mt-2 text-base text-gray-800">Tareas realizadas</p></div>
                    <div><p className="text-5xl lg:text-6xl font-extrabold text-black font-days">{stats.availableAssistants}</p><p className="mt-2 text-base text-gray-800">Asistentes disponibles</p></div>
                    <div><p className="text-5xl lg:text-6xl font-extrabold text-black font-days">{stats.satisfactionRate}%</p><p className="mt-2 text-base text-gray-800">De satisfacción</p></div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-20 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-black">Qué dicen nuestros clientes:</h2>
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
                     <div className="overflow-hidden">
                        <div
                           className="flex"
                           style={{
                               transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                               transition: transitionEnabled ? `transform ${'0.5s'} ease-in-out` : 'none'
                           }}
                           onTransitionEnd={handleTransitionEnd}
                        >
                            {loopedTestimonials.map((testimonial, index) => (
                                <div key={index} className="flex flex-col flex-shrink-0 w-full md:w-1/3 px-4" style={{minWidth: `${100/itemsPerPage}%`}}>
                                    <p className="text-gray-700 italic flex-grow h-24">"{testimonial.quote}"</p>
                                    <div className="flex items-center mt-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-[#00B8DB]">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-black">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                         <h2 className="text-3xl font-bold text-[#00B8DB]">¿Listo para mejorar tus calificaciones?</h2>
                         <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                           Únete a cientos de estudiantes en Ecuador que ya están optimizando su tiempo y alcanzando el éxito académico con IntiHelp. El registro es gratis y toma menos de un minuto.
                         </p>
                         <div className="mt-8">
                            <button onClick={() => navigate('/register')} className="px-8 py-3 text-base font-semibold bg-[#00B8DB] text-white rounded-lg hover:bg-blue-600 transition-colors">
                                Regístrate
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
                            <img src="/src/assets/logo.svg" alt="IntiHelp" className="h-10" />
                        </div>
                        <div className="flex gap-4 md:gap-6 text-black">
                            <a href="#" className="hover:text-[#00B8DB]"><InstagramIcon /></a>
                            <a href="#" className="hover:text-[#00B8DB]"><FacebookIcon /></a>
                            <a href="#" className="hover:text-[#00B8DB]"><TikTokIcon /></a>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <p>© 2025 IntiHelp. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingStudent;
