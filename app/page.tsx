'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Truck, MapPin, Calendar, Star, ArrowRight, Shield, Clock, Heart, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('a, button, [role="button"], .magnetic'));
    };
    const animate = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.35;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.35;
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
      if (cursorDotRef.current) cursorDotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`;
      rafId.current = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousemove', handleElementHover, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    rafId.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleElementHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={`fixed pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 ease-out ${isHovering ? 'w-16 h-16 border-2 border-[var(--color-accent)]' : 'w-8 h-8 border border-white/50'} rounded-full ${isClicking ? 'scale-75' : 'scale-100'}`} style={{ left: 0, top: 0 }} />
      <div ref={cursorDotRef} className={`fixed pointer-events-none z-[9999] w-2 h-2 bg-[var(--color-accent)] rounded-full transition-transform duration-150 ${isClicking ? 'scale-150' : 'scale-100'} ${isHovering ? 'opacity-0' : 'opacity-100'}`} style={{ left: 0, top: 0 }} />
    </>
  );
}

function MagneticButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPosition({ x: (clientX - left - width / 2) * 0.3, y: (clientY - top - height / 2) * 0.3 });
  };
  return (
    <button ref={ref} className={`magnetic-wrap ${className}`} onMouseMove={handleMouseMove} onMouseLeave={() => setPosition({ x: 0, y: 0 })} onClick={onClick} style={{ transform: `translate(${position.x}px, ${position.y}px)`, transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      {children}
    </button>
  );
}

function TiltCard({ children, className, intensity = 15 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setTransform({ rotateX: ((clientY - top) / height - 0.5) * -intensity, rotateY: ((clientX - left) / width - 0.5) * intensity });
  };
  return (
    <div ref={ref} className={`perspective-1000 ${className}`} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setTransform({ rotateX: 0, rotateY: 0 }); setIsHovered(false); }}>
      <div className="relative preserve-3d transition-transform duration-100 ease-out" style={{ transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${isHovered ? 1.02 : 1})` }}>
        <div className="tilt-card-shadow" style={{ opacity: isHovered ? 0.4 : 0 }} />
        <div className="tilt-card-content">{children}</div>
      </div>
    </div>
  );
}

function CharReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const chars = container.querySelectorAll('.char');
    gsap.set(chars, { y: '100%', rotateX: -90, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: container, start: 'top 85%', once: true,
      onEnter: () => { gsap.to(chars, { y: '0%', rotateX: 0, opacity: 1, duration: 0.8, stagger: 0.03, delay: delay / 1000, ease: 'expo.out' }); }
    });
    return () => trigger.kill();
  }, [delay]);
  return (
    <span ref={containerRef} className={`inline-block overflow-hidden ${className}`}>
      {text.split('').map((char, i) => (<span key={i} className="char inline-block" style={{ transformOrigin: 'center bottom' }}>{char === ' ' ? '\u00A0' : char}</span>))}
    </span>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated.current) return;
    const obj = { value: 0 };
    const trigger = ScrollTrigger.create({
      trigger: element, start: 'top 80%', once: true,
      onEnter: () => {
        hasAnimated.current = true;
        gsap.to(obj, { value: target, duration: 2.5, ease: 'power2.out', onUpdate: () => { element.textContent = Math.floor(obj.value) + suffix; } });
      }
    });
    return () => trigger.kill();
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

function Premium3DElement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const element = elementRef.current;
    if (!container || !element) return;
    gsap.to(element, { rotateY: 360, duration: 20, repeat: -1, ease: 'none' });
    const trigger = ScrollTrigger.create({
      trigger: container, start: 'top bottom', end: 'bottom top', scrub: 1,
      onUpdate: (self) => { gsap.to(element, { rotateX: (self.progress - 0.5) * 20, duration: 0.3, ease: 'power2.out' }); }
    });
    return () => trigger.kill();
  }, []);
  return (
    <div ref={containerRef} className="relative w-48 h-48 md:w-64 md:h-64 perspective-1000">
      <div ref={elementRef} className="w-full h-full preserve-3d relative">
        <div className="absolute inset-0 glass-dark rounded-3xl flex items-center justify-center border border-[var(--color-accent)]/20" style={{ transform: 'translateZ(40px)' }}>
          <Truck className="w-16 h-16 md:w-24 md:h-24 text-[var(--color-accent)]" strokeWidth={1} />
        </div>
        <div className="absolute inset-0 glass-dark rounded-3xl flex items-center justify-center border border-[var(--color-accent)]/20" style={{ transform: 'rotateY(180deg) translateZ(40px)' }}>
          <Shield className="w-16 h-16 md:w-24 md:h-24 text-[var(--color-primary)]" strokeWidth={1} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-3xl flex items-center justify-center" style={{ transform: 'rotateY(-90deg) translateZ(40px)', width: '80px', left: 'calc(50% - 40px)' }}>
          <Star className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-3xl flex items-center justify-center" style={{ transform: 'rotateY(90deg) translateZ(40px)', width: '80px', left: 'calc(50% - 40px)' }}>
          <Heart className="w-8 h-8 text-[var(--color-dark)]" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 bg-[var(--color-accent)]/30 rounded-3xl" style={{ transform: 'rotateX(90deg) translateZ(40px)', height: '80px', top: 'calc(50% - 40px)' }} />
        <div className="absolute inset-0 bg-[var(--color-primary)]/30 rounded-3xl" style={{ transform: 'rotateX(-90deg) translateZ(40px)', height: '80px', top: 'calc(50% - 40px)' }} />
      </div>
      <div className="absolute inset-0 bg-[var(--color-accent)]/20 rounded-full blur-3xl -z-10 scale-150 animate-pulse" />
    </div>
  );
}

function ApprovalStamp({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    gsap.set(element, { opacity: 0, scale: 1.5, rotation: -15 });
    const trigger = ScrollTrigger.create({
      trigger: element, start: 'top 80%', once: true,
      onEnter: () => { gsap.to(element, { opacity: 1, scale: 1, rotation: -6, duration: 0.6, ease: 'expo.out' }); }
    });
    return () => trigger.kill();
  }, []);
  return (
    <div ref={ref} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-display font-bold text-sm tracking-wider uppercase" style={{ borderRadius: 0 }}>
      <CheckCircle2 className="w-4 h-4" />{text}
    </div>
  );
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const showsRef = useRef<HTMLDivElement>(null);
  const transportRef = useRef<HTMLDivElement>(null);
  const coverageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const horseShows = [
    { name: 'Vermont Summer Festival', location: 'Manchester, VT', dates: 'July - August', description: 'Premier hunter/jumper series with championship finals and top competitors from across the country.', image: '/images/outlook-farm/jumping.png', featured: true },
    { name: 'Lake Placid Horse Show', location: 'Lake Placid, NY', dates: 'June - July', description: 'Historic Adirondack show grounds featuring USEF-rated hunter and jumper divisions.', image: '/images/outlook-farm/dressage.png', featured: false },
    { name: 'HITS Saugerties', location: 'Saugerties, NY', dates: 'May - September', description: 'World-class show circuit with prestigious championship events and substantial prize money.', image: '/images/outlook-farm/view-of-barn.png', featured: false }
  ];

  const transportFeatures = [
    { icon: Shield, title: 'Fully Insured', desc: 'Comprehensive coverage for peace of mind on every journey' },
    { icon: Clock, title: 'On-Time Guarantee', desc: 'We know show schedules and plan routes accordingly' },
    { icon: Heart, title: '25+ Years Experience', desc: 'Decades of trusted horse transport expertise' },
    { icon: MapPin, title: 'Northeast Specialists', desc: 'Regular routes to every major show in the region' }
  ];

  const stats = [
    { value: 25, suffix: '+', label: 'Years Experience' },
    { value: 1000, suffix: '+', label: 'Horses Transported' },
    { value: 50, suffix: '+', label: 'Shows Serviced' },
    { value: 100, suffix: '%', label: 'Safety Record' },
  ];

  useEffect(() => {
    setIsLoaded(true);
    if (progressRef.current) {
      gsap.to(progressRef.current, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
    }
    if (heroRef.current && heroImageRef.current) {
      gsap.to(heroImageRef.current.querySelector('.parallax-bg'), { y: 200, scale: 1.1, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to(heroImageRef.current.querySelector('.parallax-mid'), { y: 100, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      if (heroContentRef.current) {
        gsap.to(heroContentRef.current, { y: -50, opacity: 0, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '50% top', scrub: 1 } });
      }
    }
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll('.stat-item');
      gsap.from(statItems, { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: statsRef.current, start: 'top 80%', once: true } });
    }
    if (showsRef.current) {
      const header = showsRef.current.querySelector('.shows-header');
      const cards = showsRef.current.querySelectorAll('.show-card');
      gsap.from(header, { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: showsRef.current, start: 'top 70%', once: true } });
      gsap.from(cards, { y: 100, opacity: 0, rotateX: 15, duration: 1, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: showsRef.current, start: 'top 60%', once: true } });
    }
    if (transportRef.current) {
      const leftContent = transportRef.current.querySelector('.transport-left');
      const rightImage = transportRef.current.querySelector('.transport-right');
      const features = transportRef.current.querySelectorAll('.feature-item');
      gsap.from(leftContent, { x: -100, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: transportRef.current, start: 'top 70%', once: true } });
      gsap.from(rightImage, { x: 100, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: transportRef.current, start: 'top 70%', once: true } });
      gsap.from(features, { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: transportRef.current, start: 'top 50%', once: true } });
    }
    if (coverageRef.current) {
      const image = coverageRef.current.querySelector('.coverage-image');
      const tags = coverageRef.current.querySelectorAll('.state-tag');
      gsap.from(image, { scale: 0.9, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: coverageRef.current, start: 'top 70%', once: true } });
      gsap.from(tags, { y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)', scrollTrigger: { trigger: coverageRef.current, start: 'top 50%', once: true } });
    }
    if (ctaRef.current) {
      gsap.from(ctaRef.current.querySelector('.cta-content'), { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: ctaRef.current, start: 'top 70%', once: true } });
    }
    return () => { ScrollTrigger.getAll().forEach(trigger => trigger.kill()); };
  }, []);

  return (
    <main ref={containerRef} className="bg-[var(--color-light)] text-[var(--color-dark)] noise">
      <CustomCursor />
      <div ref={progressRef} className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-accent)] origin-left z-50" style={{ transform: 'scaleX(0)' }} />
      <nav className={`fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 py-6 mix-blend-difference transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-white magnetic">Outlook Farm</Link>
          <div className="hidden md:flex items-center gap-12">
            {['Shows', 'Transport', 'About'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-500 relative group magnetic">
                {item}<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-accent)] transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>
          <MagneticButton className="hidden md:block px-6 py-3 bg-[var(--color-accent)] text-[var(--color-dark)] font-semibold text-sm tracking-wide hover:bg-[var(--color-accent-light)] transition-colors duration-500 btn-sharp">Get a Quote</MagneticButton>
        </div>
      </nav>

      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-dark)]">
        <div ref={heroImageRef} className="absolute inset-0 z-0">
          <div className="parallax-bg absolute inset-0">
            <img src="/images/outlook-farm/jumping.png" alt="Horse jumping" className="w-full h-full object-cover opacity-60 scale-110" />
          </div>
          <div className="parallax-mid absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-dark)] via-[var(--color-dark)]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent" />
          </div>
        </div>
        <div className={`absolute right-8 lg:right-24 top-1/2 -translate-y-1/2 z-10 hidden lg:block transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'}`}>
          <Premium3DElement />
        </div>
        <div ref={heroContentRef} className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 pt-32">
          <div className="max-w-3xl">
            <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center gap-2 px-4 py-2 glass text-white/80 text-xs font-medium tracking-[0.2em] uppercase"><MapPin className="w-3 h-3" />Norwich, Vermont</span>
            </div>
            <h1 className={`font-display font-semibold text-white leading-[0.85] mt-8 mb-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ fontSize: 'clamp(4rem, 11vw, 10rem)', letterSpacing: '-0.03em' }}>
              <CharReveal text="Horse Show" delay={400} />
              <span className="block text-[var(--color-accent)]"><CharReveal text="Transport" delay={600} /></span>
            </h1>
            <p className={`text-xl md:text-2xl text-white/60 max-w-xl mb-12 leading-relaxed font-body transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Professional transportation to shows across the Northeast. Safe, reliable, and on time since 1998.
            </p>
            <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <MagneticButton className="group inline-flex items-center gap-3 px-10 py-5 bg-[var(--color-accent)] text-[var(--color-dark)] font-bold text-sm tracking-wide uppercase hover:bg-[var(--color-accent-light)] transition-all duration-500 btn-sharp">
                Book Transport<ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </MagneticButton>
              <button className="inline-flex items-center gap-3 px-10 py-5 border border-white/30 text-white font-semibold text-sm tracking-wide uppercase hover:bg-white/10 transition-all duration-500 btn-sharp magnetic">View Schedule</button>
            </div>
          </div>
        </div>
        <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-3 text-white/40">
            <span className="text-xs tracking-[0.3em] uppercase font-medium">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-20 px-6 lg:px-12 bg-[var(--color-dark)] border-y border-white/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item text-center md:text-left md:border-l md:border-white/10 md:pl-8 first:pl-0 first:border-l-0">
                <div className="font-display font-semibold text-[var(--color-accent)] mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/50 font-medium tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shows" ref={showsRef} className="py-32 lg:py-40 px-6 lg:px-12 bg-[var(--color-light)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="shows-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
            <div>
              <span className="inline-block px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold tracking-[0.2em] uppercase mb-6">Show Circuit</span>
              <h2 className="font-display font-semibold leading-[0.95]">Shows We<br /><span className="text-[var(--color-primary)]">Service</span></h2>
            </div>
            <p className="text-[var(--color-muted)] text-lg max-w-md leading-relaxed">Regular transportation to the Northeast&apos;s premier horse shows. We know the routes, the schedules, and what it takes to get there.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {horseShows.map((show) => (
              <div key={show.name} className="show-card">
                <TiltCard className="h-full" intensity={8}>
                  <div className={`h-full bg-[var(--color-light-elevated)] overflow-hidden shadow-3d ${show.featured ? 'ring-2 ring-[var(--color-accent)]' : ''}`} style={{ borderRadius: 0 }}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={show.image} alt={show.name} className="w-full h-full object-cover image-hover-premium" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/80 via-transparent to-transparent" />
                      {show.featured && <div className="absolute top-6 left-6"><ApprovalStamp text="Featured" /></div>}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 text-white/70 text-sm mb-2 font-medium"><Calendar className="w-4 h-4" />{show.dates}</div>
                        <h3 className="font-display text-2xl font-semibold text-white">{show.name}</h3>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-[var(--color-muted)] text-sm mb-4 font-medium"><MapPin className="w-4 h-4 text-[var(--color-primary)]" />{show.location}</div>
                      <p className="text-[var(--color-muted)] leading-relaxed mb-6">{show.description}</p>
                      <button className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm tracking-wide uppercase group/btn relative magnetic">
                        Book Transport<ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-primary)] transition-all duration-500 group-hover/btn:w-full" />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="transport" ref={transportRef} className="py-32 lg:py-40 px-6 lg:px-12 bg-[var(--color-dark)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '48px 48px' }} />
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 pointer-events-none select-none">
          <span className="font-display font-semibold text-[20rem] text-white/[0.02] whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>TRANSPORT</span>
        </div>
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="transport-left">
              <span className="inline-block px-4 py-2 bg-[var(--color-primary)]/20 text-[var(--color-accent)] text-xs font-semibold tracking-[0.2em] uppercase mb-8">Why Choose Us</span>
              <h2 className="font-display font-semibold leading-[0.95] mb-8">Safe, Reliable<span className="block text-[var(--color-accent)]">Transportation</span></h2>
              <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-12 max-w-lg">We operate a modern horse trailer designed for comfort and safety. Whether it is one horse or a full load, we get them to the show ready to compete.</p>
              <div className="grid grid-cols-2 gap-4">
                {transportFeatures.map((feature) => (
                  <div key={feature.title} className="feature-item p-6 glass-dark hover:border-[var(--color-accent)]/30 transition-colors duration-500 group" style={{ borderRadius: 0 }}>
                    <feature.icon className="w-8 h-8 text-[var(--color-accent)] mb-4 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                    <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="transport-right relative">
              <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: 0 }}>
                <img src="/images/outlook-farm/view-of-barn.png" alt="Outlook Farm" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 p-8 glass-dark min-w-[200px]" style={{ borderRadius: 0 }}>
                <div className="font-display font-semibold text-[var(--color-accent)] mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>25+</div>
                <div className="text-white/50 text-sm tracking-wide uppercase">Years of Service</div>
              </div>
              <div className="absolute -top-4 -right-4 p-4 bg-[var(--color-accent)]" style={{ borderRadius: 0 }}>
                <Shield className="w-8 h-8 text-[var(--color-dark)]" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={coverageRef} className="py-32 lg:py-40 px-6 lg:px-12 bg-[var(--color-light)]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold tracking-[0.2em] uppercase mb-6">Coverage Area</span>
            <h2 className="font-display font-semibold mb-6">Where We <span className="text-[var(--color-primary)]">Travel</span></h2>
            <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto leading-relaxed">Based in Norwich, Vermont, we regularly transport horses to shows throughout the Northeast and beyond.</p>
          </div>
          <div className="coverage-image relative overflow-hidden" style={{ borderRadius: 0 }}>
            <div className="aspect-[21/9]">
              <img src="/images/outlook-farm/barn.png" alt="Outlook Farm barn" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/90 via-[var(--color-dark)]/30 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex flex-wrap gap-3">
                {['Vermont', 'New York', 'New Hampshire', 'Massachusetts', 'Connecticut', 'Maine'].map((state) => (
                  <span key={state} className="state-tag px-5 py-2.5 glass text-white font-medium text-sm tracking-wide" style={{ borderRadius: 0 }}>{state}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Trusted by Competitors Across the Northeast</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
            {['Vermont Summer Festival', 'Lake Placid Horse Show', 'HITS Saugerties', 'Upperville', 'Old Salem Farm'].map((show) => (
              <div key={show} className="flex items-center gap-2"><Trophy className="w-5 h-5 text-[var(--color-accent)]" /><span className="font-medium text-[var(--color-muted)]">{show}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="py-32 lg:py-40 px-6 lg:px-12 bg-[var(--color-primary)] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[128px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="cta-content">
            <h2 className="font-display font-semibold mb-6">Ready for your<br />next show?</h2>
            <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">Contact us to book transportation for your horse. We will get you there on time and ready to compete.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <MagneticButton className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--color-accent)] text-[var(--color-dark)] font-bold text-lg tracking-wide hover:bg-[var(--color-accent-light)] transition-all duration-500 btn-sharp">Get a Quote<ArrowRight className="w-5 h-5" /></MagneticButton>
              <button className="inline-flex items-center gap-3 px-10 py-5 border-2 border-white/30 text-white font-semibold text-lg tracking-wide hover:bg-white/10 transition-all duration-500 btn-sharp magnetic">Call (802) 555-0123</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 lg:px-12 bg-[var(--color-dark)] text-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <h3 className="font-display text-3xl font-semibold mb-6">Outlook Farm</h3>
              <p className="text-white/50 max-w-sm mb-6 leading-relaxed">Professional horse show transportation serving the Northeast since 1998. Safe, reliable, and on time. Every horse, every show, every time.</p>
              <div className="flex items-center gap-2 text-white/50"><MapPin className="w-4 h-4" />Norwich, Vermont</div>
            </div>
            <div className="md:col-span-3 md:col-start-7">
              <h4 className="font-display font-semibold mb-4 text-white/80">Services</h4>
              <ul className="space-y-3 text-white/50">
                <li><Link href="#" className="hover:text-white transition-colors duration-300">Horse Transport</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors duration-300">Show Packages</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors duration-300">Full Support</Link></li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <h4 className="font-display font-semibold mb-4 text-white/80">Contact</h4>
              <ul className="space-y-3 text-white/50">
                <li>(802) 555-0123</li>
                <li>info@outlookfarm.com</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">© 2024 Outlook Farm. All rights reserved.</p>
            <div className="flex items-center gap-6 text-white/30 text-sm">
              <Link href="#" className="hover:text-white transition-colors duration-300">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors duration-300">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
