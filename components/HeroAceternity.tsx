'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mouse spotlight effect component
function MouseSpotlight({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.setProperty('--x', `${x}px`);
      spotlight.style.setProperty('--y', `${y}px`);
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 hover:opacity-100"
        style={{
          background: 'radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(201, 162, 39, 0.15), transparent 40%)',
        }}
      />
      {children}
    </div>
  );
}

// 3D tilt card component
function Tilt3D({ children, className, intensity = 10 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setTransform({
      rotateX: y * -intensity,
      rotateY: x * intensity,
    });
  };

  return (
    <div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setTransform({ rotateX: 0, rotateY: 0 }); setIsHovered(false); }}
    >
      <div
        className="relative preserve-3d transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        }}
      >
        <div
          className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-[var(--color-accent)]/20 to-transparent blur-xl transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.6 : 0 }}
        />
        {children}
      </div>
    </div>
  );
}

// Text reveal animation component
function TextReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll('.word');
    gsap.set(words, { y: '100%', opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(words, {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          delay: delay / 1000,
          ease: 'expo.out',
        });
      },
    });

    return () => trigger.kill();
  }, [delay]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <span className="word inline-block">{word}</span>
        </span>
      ))}
    </div>
  );
}

// Character reveal animation component
function CharReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll('.char');
    gsap.set(chars, { y: '100%', rotateX: -90, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          y: '0%',
          rotateX: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.02,
          delay: delay / 1000,
          ease: 'expo.out',
        });
      },
    });

    return () => trigger.kill();
  }, [delay]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <span key={i} className="char inline-block" style={{ transformOrigin: 'center bottom' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

// Magnetic button component
function MagneticButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    setPosition({ x: distanceX * 0.3, y: distanceY * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={ref}
      className={`relative inline-flex items-center justify-center transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {children}
    </button>
  );
}

// Floating particles component
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.min(30, Math.floor(window.innerWidth / 50));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5 - 0.2,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${particle.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10"
      style={{ opacity: 0.6 }}
    />
  );
}

// Scroll progress bar component
function ScrollProgressBar() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === document.body) t.kill();
      });
    };
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-[var(--color-accent)] origin-left" style={{ transform: 'scaleX(0)' }} ref={progressRef} />
  );
}

// Premium 3D rotating element
function Premium3DElement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      rotateY: 360,
      duration: 20,
      repeat: -1,
      ease: 'none',
    });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        gsap.to(element, {
          rotateX: (self.progress - 0.5) * 20,
          duration: 0.3,
          ease: 'power2.out',
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={containerRef} className="relative w-48 h-48 md:w-64 md:h-64" style={{ perspective: '1000px' }}>
      <div ref={elementRef} className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-3xl border border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-xl"
          style={{ transform: 'translateZ(40px)' }}
        >
          <svg className="w-16 h-16 md:w-24 md:h-24 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M5 17a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" />
            <path d="M12 7v10" />
            <path d="m9 10 3-3 3 3" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-3xl border border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-xl"
          style={{ transform: 'rotateY(180deg) translateZ(40px)' }}
        >
          <svg className="w-16 h-16 md:w-24 md:h-24 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div
          className="absolute left-[calc(50%-40px)] flex items-center justify-center rounded-3xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]"
          style={{ transform: 'rotateY(-90deg) translateZ(40px)', width: '80px', inset: '0' }}
        >
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div
          className="absolute left-[calc(50%-40px)] flex items-center justify-center rounded-3xl bg-gradient-to-l from-[var(--color-accent)] to-[var(--color-accent-light)]"
          style={{ transform: 'rotateY(90deg) translateZ(40px)', width: '80px', inset: '0' }}
        >
          <svg className="w-8 h-8 text-[var(--color-dark)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-[var(--color-accent)]/20 blur-3xl animate-pulse" />
    </div>
  );
}

// Main Hero component
export default function HeroAceternity() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    // Parallax effect for hero background
    if (heroRef.current && imageRef.current) {
      gsap.to(imageRef.current, {
        y: 100,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    // Fade out content on scroll
    if (heroContentRef.current) {
      gsap.to(heroContentRef.current, {
        y: -50,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <ScrollProgressBar />
      
      <MouseSpotlight>
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-dark)]"
        >
          {/* Background image with parallax */}
          <div ref={imageRef} className="absolute inset-0 -top-20 -bottom-20">
            <img
              src="/images/outlook-farm/jumping.png"
              alt="Horse jumping"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-dark)] via-[var(--color-dark)]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent" />
          </div>

          {/* Floating particles */}
          <FloatingParticles />

          {/* 3D Element on the right */}
          <div
            className={`absolute right-8 lg:right-24 top-1/2 -translate-y-1/2 z-20 hidden lg:block transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'
            }`}
          >
            <Tilt3D intensity={15}>
              <Premium3DElement />
            </Tilt3D>
          </div>

          {/* Hero content */}
          <div
            ref={heroContentRef}
            className="relative z-20 max-w-[1600px] mx-auto px-6 lg:px-12 pt-32 w-full"
          >
            <div className="max-w-3xl">
              {/* Location tag */}
              <div
                className={`transition-all duration-1000 delay-200 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Tilt3D intensity={8}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 glass text-white/80 text-xs font-medium tracking-[0.2em] uppercase">
                    <MapPin className="w-3 h-3" />
                    Norwich, Vermont
                  </span>
                </Tilt3D>
              </div>

              {/* Main headline with character reveal */}
              <h1
                className={`font-display font-semibold text-white leading-[0.85] mt-8 mb-8 transition-all duration-1000 delay-300 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', letterSpacing: '-0.03em' }}
              >
                <span className="block">
                  <CharReveal text="Horse Show" delay={400} />
                </span>
                <span className="block text-[var(--color-accent)]">
                  <CharReveal text="Transport" delay={600} />
                </span>
              </h1>

              {/* Subtitle with text reveal */}
              <div
                className={`text-xl md:text-2xl text-white/60 max-w-xl mb-12 leading-relaxed font-body transition-all duration-1000 delay-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <TextReveal
                  text="Professional transportation to shows across the Northeast. Safe, reliable, and on time since 1998."
                  delay={800}
                />
              </div>

              {/* CTA buttons with magnetic effect */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-1000 delay-900 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <MagneticButton className="group px-10 py-5 bg-[var(--color-accent)] text-[var(--color-dark)] font-bold text-sm tracking-wide uppercase hover:bg-[var(--color-accent-light)] transition-all duration-500 btn-sharp">
                  <span className="flex items-center gap-3">
                    Book Transport
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                  </span>
                </MagneticButton>

                <MagneticButton className="px-10 py-5 border border-white/30 text-white font-semibold text-sm tracking-wide uppercase hover:bg-white/10 transition-all duration-500 btn-sharp">
                  View Schedule
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-white/40 transition-all duration-1000 delay-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-xs tracking-[0.3em] uppercase font-medium">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </section>
      </MouseSpotlight>
    </>
  );
}
