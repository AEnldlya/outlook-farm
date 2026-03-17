'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Trophy, 
  Truck, 
  MapPin, 
  Calendar, 
  Star, 
  ArrowRight, 
  ChevronDown,
  Shield,
  Clock,
  Heart
} from 'lucide-react';

// Magnetic button component
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.2;
    const y = (clientY - top - height / 2) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.button>
  );
}

// Counter animation
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
          
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  
  return <span ref={ref}>{count}{suffix}</span>;
}

// 3D Card with tilt effect
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    setRotateX((y - 0.5) * -10);
    setRotateY((x - 0.5) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d'
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const scaleX = useSpring(scrollYProgress, springConfig);

  const horseShows = [
    {
      name: 'Vermont Summer Festival',
      location: 'Manchester, VT',
      dates: 'July - August',
      description: 'Premier hunter/jumper series with championship finals and top competitors from across the country.',
      image: '/images/outlook-farm/jumping.png',
      featured: true
    },
    {
      name: 'Lake Placid Horse Show',
      location: 'Lake Placid, NY',
      dates: 'June - July',
      description: 'Historic Adirondack show grounds featuring USEF-rated hunter and jumper divisions.',
      image: '/images/outlook-farm/dressage.png',
      featured: false
    },
    {
      name: 'HITS Saugerties',
      location: 'Saugerties, NY',
      dates: 'May - September',
      description: 'World-class show circuit with prestigious championship events and substantial prize money.',
      image: '/images/outlook-farm/view-of-barn.png',
      featured: false
    }
  ];

  const transportFeatures = [
    { icon: Shield, title: 'Fully Insured', desc: 'Comprehensive coverage for peace of mind on every journey' },
    { icon: Clock, title: 'On-Time Guarantee', desc: 'We know show schedules and plan routes accordingly' },
    { icon: Heart, title: '25+ Years Experience', desc: 'Decades of trusted horse transport expertise' },
    { icon: MapPin, title: 'Northeast Specialists', desc: 'Regular routes to every major show in the region' }
  ];

  return (
    <main ref={containerRef} className="bg-[#FDF8F3] text-[#1A1A1A]">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#2D5A3D] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 py-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            Outlook Farm
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#shows" className="text-sm font-medium text-[#6B6B6B] hover:text-[#2D5A3D] transition-colors">
              Shows
            </Link>
            <Link href="#transport" className="text-sm font-medium text-[#6B6B6B] hover:text-[#2D5A3D] transition-colors">
              Transport
            </Link>
            <Link href="#about" className="text-sm font-medium text-[#6B6B6B] hover:text-[#2D5A3D] transition-colors">
              About
            </Link>
          </div>
          
          <MagneticButton className="px-6 py-3 bg-[#2D5A3D] text-white font-semibold text-sm rounded-full hover:shadow-lg transition-shadow">
            Get a Quote
          </MagneticButton>
        </div>
      </motion.nav>

      {/* Hero Section - Full viewport with parallax */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ scale: scaleProgress, y: heroY }}
        >
          <img
            src="/images/outlook-farm/jumping.png"
            alt="Horse jumping"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/80 via-[#1A1A1A]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8F3] via-transparent to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-32"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium tracking-wider uppercase border border-white/20">
                <MapPin className="w-3 h-3" />
                Norwich, Vermont
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mt-8 mb-6"
            >
              Horse Show
              <span className="block text-[#C9A227]">Transport</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-white/70 max-w-lg mb-10 leading-relaxed"
            >
              Professional transportation to shows across the Northeast. 
              Safe, reliable, and on time since 1998.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton className="group inline-flex items-center gap-3 px-8 py-4 bg-[#C9A227] text-[#1A1A1A] font-bold rounded-full hover:shadow-xl transition-all">
                Book Transport
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              
              <button className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                View Schedule
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/50"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-6 lg:px-12 bg-white border-y border-[#E5E5E5]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 25, suffix: '+', label: 'Years Experience' },
              { value: 1000, suffix: '+', label: 'Horses Transported' },
              { value: 50, suffix: '+', label: 'Shows Serviced' },
              { value: 100, suffix: '%', label: 'Safety Record' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-[#2D5A3D] mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-[#6B6B6B] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Horse Shows Section */}
      <section id="shows" className="py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <span className="inline-block px-4 py-2 bg-[#2D5A3D]/10 rounded-full text-[#2D5A3D] text-xs font-semibold tracking-wider uppercase mb-4">
                Show Circuit
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Shows We<br />Service
              </h2>
            </div>
            <p className="text-[#6B6B6B] text-lg max-w-md">
              Regular transportation to the Northeast&apos;s premier horse shows. 
              We know the routes, the schedules, and what it takes to get there.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {horseShows.map((show, index) => (
              <motion.div
                key={show.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <TiltCard className="group h-full">
                  <div className={`h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 ${show.featured ? 'ring-2 ring-[#C9A227]' : ''}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={show.image}
                        alt={show.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {show.featured && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-[#C9A227] text-[#1A1A1A] text-xs font-bold rounded-full">
                          Featured
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                          <Calendar className="w-4 h-4" />
                          {show.dates}
                        </div>
                        <h3 className="font-display text-xl font-bold text-white">{show.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-[#6B6B6B] text-sm mb-3">
                        <MapPin className="w-4 h-4 text-[#2D5A3D]" />
                        {show.location}
                      </div>
                      <p className="text-[#6B6B6B] leading-relaxed">{show.description}</p>
                      
                      <button className="mt-6 inline-flex items-center gap-2 text-[#2D5A3D] font-semibold text-sm group/btn">
                        Book Transport
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transport Features - Dark Section */}
      <section id="transport" className="py-32 px-6 lg:px-12 bg-[#1A1A1A] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-[#2D5A3D]/20 rounded-full text-[#C9A227] text-xs font-semibold tracking-wider uppercase mb-6">
                Why Choose Us
              </span>
              
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Safe, Reliable
                <span className="block text-[#C9A227]">Transportation</span>
              </h2>
              
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                We operate a modern horse trailer designed for comfort and safety. 
                Whether it is one horse or a full load, we get them to the show 
                ready to compete.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {transportFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#C9A227]/30 transition-colors"
                  >
                    <feature.icon className="w-8 h-8 text-[#C9A227] mb-3" />
                    <h3 className="font-display text-lg font-bold mb-1">{feature.title}</h3>
                    <p className="text-white/50 text-sm">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img 
                  src="/images/outlook-farm/view-of-barn.png" 
                  alt="Outlook Farm"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
              </div>
              
              {/* Floating Stats Card */}
              <motion.div 
                className="absolute -bottom-8 -left-8 p-6 bg-[#2D5A3D] rounded-2xl shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-4xl font-display font-bold text-white mb-1">25+</div>
                <div className="text-white/70 text-sm">Years of Service</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-32 px-6 lg:px-12 bg-[#FDF8F3]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-[#2D5A3D]/10 rounded-full text-[#2D5A3D] text-xs font-semibold tracking-wider uppercase mb-4">
              Coverage Area
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Where We Travel
            </h2>
            <p className="text-[#6B6B6B] text-lg max-w-2xl mx-auto">
              Based in Norwich, Vermont, we regularly transport horses to shows 
              throughout the Northeast and beyond.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="aspect-[21/9]">
              <img 
                src="/images/outlook-farm/barn.png" 
                alt="Outlook Farm barn"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/20 to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex flex-wrap gap-3">
                {['Vermont', 'New York', 'New Hampshire', 'Massachusetts', 'Connecticut', 'Maine'].map((state, i) => (
                  <motion.span 
                    key={state} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="px-5 py-2.5 bg-white/10 backdrop-blur-md text-white font-medium rounded-full border border-white/20"
                  >
                    {state}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials / Trust */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Trusted by Competitors Across the Northeast
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
            {['Vermont Summer Festival', 'Lake Placid Horse Show', 'HITS Saugerties', 'Upperville', 'Old Salem Farm'].map((show) => (
              <div key={show} className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#C9A227]" />
                <span className="font-medium text-[#6B6B6B]">{show}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 bg-[#2D5A3D] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[128px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready for your<br />next show?
            </h2>
            <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Contact us to book transportation for your horse. 
              We will get you there on time and ready to compete.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <MagneticButton className="inline-flex items-center gap-3 px-10 py-5 bg-[#C9A227] text-[#1A1A1A] font-bold text-lg rounded-full hover:shadow-2xl transition-all">
                Get a Quote
                <ArrowRight className="w-5 h-5" />
              </MagneticButton>
              
              <button className="inline-flex items-center gap-3 px-10 py-5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                Call (802) 555-0123
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-12 bg-[#1A1A1A] text-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3 className="font-display text-2xl font-bold mb-4">Outlook Farm</h3>
              <p className="text-white/50 max-w-sm mb-6">
                Professional horse show transportation serving the Northeast since 1998. 
                Safe, reliable, and on time.
              </p>
              <div className="flex items-center gap-2 text-white/50">
                <MapPin className="w-4 h-4" />
                Norwich, Vermont
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="#" className="hover:text-white transition-colors">Horse Transport</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Show Packages</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Full Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/50">
                <li>(802) 555-0123</li>
                <li>info@outlookfarm.com</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              © 2024 Outlook Farm. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-white/30 text-sm">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
