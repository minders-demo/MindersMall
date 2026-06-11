import React, { useState } from 'react';
import { ArrowRight, Instagram, Linkedin, Youtube } from 'lucide-react';
import { logBrazeEvent, setBrazeUserAttributes } from '../lib/braze';
import { useAppContext } from '../context/AppContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { addDemoEvent } = useAppContext();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate newsletter subscription event for Braze
    const eventProps = { source: 'footer_newsletter' };
    logBrazeEvent('newsletter_subscribed', eventProps);
    try {
        addDemoEvent('newsletter_subscribed', eventProps);
    } catch(err) {}
    
    setBrazeUserAttributes({ email_subscribe: 'subscribed' });
    
    setEmail('');
    alert('Thank you for subscribing!'); // In a real app we would use a toast
  };

  return (
    <footer className="w-full bg-[#1a1a1a] text-white flex flex-col md:flex-row relative overflow-hidden min-h-[600px]">
      
      {/* LEFT SECTION: Newsletter & Shape */}
      {/* To simulate the starburst shape, we use an absolute SVG and position the content over it */}
      <div className="relative w-full md:w-[45%] flex flex-col justify-center p-12 md:p-20 z-10">
        
        {/* SVG Starburst Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] -z-10 pointer-events-none opacity-100 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full text-[#6c74d8] fill-current transform scale-150 origin-left" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,0 L 200,0 L 200,200 L 0,200 Z" />
            <path fill="#1a1a1a" d="M100,100 L200,20 L150,100 L240,120 L120,130 L160,220 L90,140 L50,230 L70,120 L-20,160 L60,95 L-10,40 L75,70 Z" />
            {/* The inverse starburst: we paint the background purple, and use dark triangles to simulate the burst, or better yet, just a clip-path on a purple div */}
          </svg>
        </div>
        {/* We'll use a simpler approach for the starburst shape: A purple div with a complex clip-path */}
        <div 
          className="absolute inset-0 bg-[#6c74d8] -z-20 pointer-events-none"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 96% 18%, 100% 20%, 75% 35%, 85% 45%, 65% 55%, 70% 65%, 55% 70%, 50% 85%, 40% 75%, 25% 95%, 25% 80%, 10% 90%, 15% 75%, 0% 70%, 5% 55%, 0% 35%, 15% 25%, 0% 0%)'
          }}
        ></div>
        <div className="absolute inset-0 bg-[#6c74d8] -z-30 pointer-events-none w-full h-[150%] scale-150 transform -translate-x-20"></div>


        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white leading-tight">
            Subscribe to our newsletter
          </h2>
          <p className="text-white/90 mb-12 text-sm md:text-base pr-4">
            Receive our latest updates. By subscribing, you agree to the terms and
            conditions of our Privacy Policy.
          </p>

          <form onSubmit={handleSubscribe} className="flex items-center gap-3 w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email*"
              required
              className="flex-1 bg-transparent border border-white/50 rounded-full px-6 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="w-14 h-14 rounded-full border border-white/50 flex items-center justify-center hover:bg-white hover:text-[#6c74d8] transition-colors flex-shrink-0"
              aria-label="Subscribe"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform rotate-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
          
          <div className="mt-8">
             <span className="bg-white/90 text-black text-[10px] font-bold px-2 py-1 tracking-widest uppercase">Minders Shape</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Content */}
      <div className="relative w-full md:w-[55%] bg-[#1a1a1a] flex flex-col p-12 md:p-20 z-10 md:-ml-8">
        
        {/* Top Header: CTA + Socials */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-20 gap-8">
          <button className="bg-white text-black font-medium hover:bg-gray-100 transition-colors px-8 py-4 rounded-full">
            Let's talk
          </button>

          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/minders.latam/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
              <Instagram size={24} />
            </a>
            <a href="https://www.linkedin.com/company/mindersio/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="https://www.youtube.com/@minders.latam" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
              <Youtube size={24} />
            </a>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          
          {/* Buenos Aires */}
          <div>
            <h3 className="text-3xl font-bold mb-4">Buenos Aires</h3>
            <div className="text-gray-300 text-sm leading-relaxed">
              <p>Argentina.</p>
              <p>Av. Sta. Fe 2755 Piso 12,</p>
              <p className="underline decoration-gray-500 underline-offset-4">C1425.</p>
            </div>
          </div>

          {/* Bogotá */}
          <div>
            <h3 className="text-3xl font-bold mb-4">Bogotá</h3>
            <div className="text-gray-300 text-sm leading-relaxed">
              <p>Colombia.</p>
              <p>Av. Cra 19 #100-45, Usaquén,</p>
              <p className="underline decoration-gray-500 underline-offset-4">110121.</p>
            </div>
          </div>

          {/* São Paulo */}
          <div>
            <h3 className="text-3xl font-bold mb-4">São Paulo</h3>
            <div className="text-gray-300 text-sm leading-relaxed">
              <p>Brasil.</p>
              <p>Alameda Rio Claro, 241, Bela Vista,</p>
              <p className="underline decoration-gray-500 underline-offset-4">01332-010.</p>
            </div>
          </div>

          {/* Ciudad de México */}
          <div>
            <h3 className="text-3xl font-bold mb-4">Ciudad de México</h3>
            <div className="text-gray-300 text-sm leading-relaxed">
              <p>México.</p>
              <p>Av. de los Insurgentes Sur 601, Nápoles,</p>
              <p>Benito Juárez, Ciudad de México.</p>
              <p className="underline decoration-gray-500 underline-offset-4">03810.</p>
            </div>
          </div>

          {/* Madrid */}
          <div>
            <h3 className="text-3xl font-bold mb-4">Madrid</h3>
            <div className="text-gray-300 text-sm leading-relaxed">
              <p>Spain.</p>
              <p>Eloy Gonzalo, 27. 5to piso, Chamberí</p>
              <p>28010</p>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};
