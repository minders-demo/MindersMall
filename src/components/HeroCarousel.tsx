import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const defaultSlides = [
  {
    title: "Todo tu estilo en un solo lugar",
    subtitle: "Moda, cuidado personal, hogar y movimiento para descubrir lo que va contigo.",
    cta: "Explorar catálogo",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Looks que se mueven contigo",
    subtitle: "Básicos, streetwear y prendas activas para todos tus planes.",
    cta: "Ver novedades",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Self-care, hogar y bienestar",
    subtitle: "Productos para cuidar tu rutina, tu espacio y tu energía.",
    cta: "Descubrir ahora",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Move & chill",
    subtitle: "Activewear y wellness para entrenar, estirar o simplemente desconectar.",
    cta: "Ver Atmos Movement",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80"
  }
];

const premiumSlides = [
  {
    title: "Colección Premium",
    subtitle: "Diseños exclusivos y materiales de alta calidad.",
    cta: "Ver colección Premium",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Elegancia sin esfuerzo",
    subtitle: "Prendas seleccionadas especialmente para ti.",
    cta: "Descubrir tendencias",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80"
  }
];

const beautySlides = [
  {
    title: "Rutina Skincare Perfecta",
    subtitle: "Cuidado de la piel con los mejores ingredientes.",
    cta: "Comprar novedades",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Resalta tu belleza",
    subtitle: "Productos recomendados basados en tus preferencias.",
    cta: "Ver recomendados",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=80"
  }
];

export const HeroCarousel: React.FC = () => {
  const { user } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  let carouselSlides = defaultSlides;
  if (user.segment === 'premium' || user.interest === 'moda') {
    carouselSlides = premiumSlides;
  } else if (user.segment === 'belleza' || user.interest === 'skincare') {
    carouselSlides = beautySlides;
  }

  useEffect(() => {
    setCurrentSlide(0);
  }, [user.id, user.segment]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
      {carouselSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-zinc-200 mb-8 max-w-2xl mx-auto drop-shadow-md font-medium">
                {slide.subtitle}
              </p>
              <button
                onClick={() => navigate('/catalog')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] uppercase tracking-wider text-sm"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all hidden md:block border border-white/10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all hidden md:block border border-white/10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
