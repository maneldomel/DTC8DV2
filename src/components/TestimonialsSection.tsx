import React, { useState, useEffect, useRef } from 'react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  profileImage: string;
  videoId: string;
  caption: string;
}

export const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastMoveX, setLastMoveX] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // ✅ UPDATED: ALL testimonials now have real VTurb video IDs and profile images
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Michael R.",
      location: "Texas",
      profileImage: "https://i.imgur.com/IYyJR1B.png",
      videoId: "68677fbfd890d9c12c549f94", // REAL VTurb video ID
      caption: "BlueDrops completely changed my life. I felt the difference in just 2 weeks!"
    },
    {
      id: 2,
      name: "Robert S.",
      location: "California",
      profileImage: "https://i.imgur.com/d1raEIm.png",
      videoId: "6867816a78c1d68a675981f1", // REAL VTurb video ID
      caption: "After 50, I thought there was no hope. BlueDrops proved me wrong!"
    },
    {
      id: 3,
      name: "John O.",
      location: "Florida",
      profileImage: "https://i.imgur.com/UJ0L2tZ.png",
      videoId: "68678320c5ab1e6abe6e5b6f", // REAL VTurb video ID
      caption: "My wife noticed the difference before I even told her about BlueDrops!"
    }
  ];

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Better animation for mobile
  const animateDragOffset = (targetOffset: number, duration: number = 150) => {
    const startOffset = dragOffset;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 2);
      const currentOffset = startOffset + (targetOffset - startOffset) * easeOut;
      setDragOffset(currentOffset);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDragOffset(targetOffset);
        if (targetOffset === 0) {
          setIsTransitioning(false);
        }
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  // Better velocity calculation
  const calculateVelocity = (clientX: number) => {
    const now = performance.now();
    if (lastMoveTime > 0) {
      const timeDiff = now - lastMoveTime;
      const distanceDiff = clientX - lastMoveX;
      if (timeDiff > 0) {
        setVelocity(distanceDiff / timeDiff);
      }
    }
    setLastMoveTime(now);
    setLastMoveX(clientX);
  };

  // Improved drag handlers for mobile
  const handleDragStart = (clientX: number) => {
    if (isTransitioning) return;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
    setVelocity(0);
    setLastMoveTime(performance.now());
    setLastMoveX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || isTransitioning) return;
    
    const diff = clientX - startX;
    const maxDrag = 120;
    
    let clampedDiff = Math.max(-maxDrag * 1.2, Math.min(maxDrag * 1.2, diff));
    
    setDragOffset(clampedDiff);
    calculateVelocity(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging || isTransitioning) return;
    
    setIsDragging(false);
    setIsTransitioning(true);
    
    const threshold = 40;
    const velocityThreshold = 0.3;
    
    let shouldChange = false;
    let direction = 0;
    
    if (Math.abs(dragOffset) > threshold || Math.abs(velocity) > velocityThreshold) {
      if (dragOffset > 0 || velocity > velocityThreshold) {
        direction = -1;
        shouldChange = true;
      } else if (dragOffset < 0 || velocity < -velocityThreshold) {
        direction = 1;
        shouldChange = true;
      }
    }
    
    if (shouldChange) {
      if (direction > 0) {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      } else {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
    }
    
    animateDragOffset(0, 100);
    
    setVelocity(0);
    setLastMoveTime(0);
    setLastMoveX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && Math.abs(dragOffset) > 10) {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX);
    } else if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleDragEnd();
  };

  // Better global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX, dragOffset, velocity]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const goToTestimonial = (index: number) => {
    if (isTransitioning || isDragging || index === currentTestimonial) return;
    setIsTransitioning(true);
    setCurrentTestimonial(index);
    setTimeout(() => setIsTransitioning(false), 200);
  };

  // Better card styling for mobile
  const getCardStyle = (index: number) => {
    const position = index - currentTestimonial;
    const dragInfluence = dragOffset * 0.2;
    
    let translateX = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 1;
    
    if (position === 0) {
      translateX = dragOffset;
      scale = 1 - Math.abs(dragOffset) * 0.0002;
      opacity = 1 - Math.abs(dragOffset) * 0.001;
      zIndex = 10;
    } else if (position === 1 || (position === -2 && testimonials.length === 3)) {
      translateX = 220 + dragInfluence;
      scale = 0.95;
      opacity = 0.8;
      zIndex = 5;
    } else if (position === -1 || (position === 2 && testimonials.length === 3)) {
      translateX = -220 + dragInfluence;
      scale = 0.95;
      opacity = 0.8;
      zIndex = 5;
    } else {
      translateX = position > 0 ? 300 : -300;
      scale = 0.9;
      opacity = 0.6;
      zIndex = 1;
    }
    
    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      opacity: Math.max(0.3, opacity),
      zIndex,
      transition: isDragging ? 'none' : 'all 0.25s ease-out',
    };
  };

  if (!isVisible) {
    return (
      <section 
        ref={sectionRef}
        className="mt-16 sm:mt-20 w-full max-w-5xl mx-auto px-4 h-96"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Carregando depoimentos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 sm:mt-20 w-full max-w-5xl mx-auto px-4 animate-fadeInUp animation-delay-1200">
      {/* Section Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-900 mb-2">
          <span className="block">No Filters.</span>
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent block">
            Just Real Results.
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-blue-700 font-semibold">
          What Real Men Are Saying About BlueDrops
        </p>
      </div>

      {/* Drag Instructions */}
      <div className="text-center mb-4">
        <p className="text-sm text-blue-600 font-medium">
          👆 Drag to navigate between testimonials
        </p>
      </div>

      {/* Slideshow Container - Better mobile support */}
      <div 
        className="relative h-[500px] mb-3"
        style={{ 
          perspective: '800px',
          touchAction: 'manipulation'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Testimonial Cards */}
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="absolute inset-0 flex items-center justify-center select-none"
            style={getCardStyle(index)}
          >
            <TestimonialCard 
              testimonial={testimonial} 
              isActive={index === currentTestimonial}
              isDragging={isDragging}
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => goToTestimonial(index)}
              disabled={isTransitioning || isDragging}
              className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 disabled:cursor-not-allowed ${
                index === currentTestimonial
                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// ✅ COMPLETELY REIMPLEMENTED: TestimonialCard with NATIVE VTurb structure
const TestimonialCard: React.FC<{ 
  testimonial: any; 
  isActive: boolean; 
  isDragging: boolean;
}> = ({ 
  testimonial, 
  isActive, 
  isDragging 
}) => {
  // ✅ FIXED: Inject VTurb script only when card is active
  useEffect(() => {
    if (isActive) {
      console.log('🎬 Injecting NATIVE VTurb for testimonial:', testimonial.videoId, testimonial.name);
      
      const injectNativeVTurb = () => {
        // ✅ CRITICAL: Wait for main video to be fully loaded first
        if (!window.vslVideoLoaded) {
          console.log('⏳ Waiting for main video to load before injecting testimonial video');
          setTimeout(injectNativeVTurb, 2000);
          return;
        }

        // ✅ Get the target container
        const targetContainer = document.getElementById(`vid-${testimonial.videoId}`);
        if (!targetContainer) {
          console.error('❌ Target container not found for video:', testimonial.videoId);
          return;
        }

        // ✅ Clear any existing content
        targetContainer.innerHTML = '';

        // ✅ NATIVE VTURB IMPLEMENTATION - EXACTLY as you provided
        if (testimonial.videoId === "68678320c5ab1e6abe6e5b6f") {
          // JOHN O. - Native VTurb
          console.log('🎬 Injecting JOHN O. native VTurb');
          targetContainer.innerHTML = `<vturb-smartplayer id="vid-68678320c5ab1e6abe6e5b6f" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer>`;
          
          // ✅ EXACT script as you provided
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `var s=document.createElement("script"); s.src="https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/68678320c5ab1e6abe6e5b6f/v4/player.js", s.async=!0,document.head.appendChild(s);`;
          document.head.appendChild(script);
          console.log('✅ John O. VTurb script injected');
          
        } else if (testimonial.videoId === "6867816a78c1d68a675981f1") {
          // ROBERT S. - Native VTurb
          console.log('🎬 Injecting ROBERT S. native VTurb');
          targetContainer.innerHTML = `<vturb-smartplayer id="vid-6867816a78c1d68a675981f1" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer>`;
          
          // ✅ EXACT script as you provided
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `var s=document.createElement("script"); s.src="https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/6867816a78c1d68a675981f1/v4/player.js", s.async=!0,document.head.appendChild(s);`;
          document.head.appendChild(script);
          console.log('✅ Robert S. VTurb script injected');
          
        } else if (testimonial.videoId === "68677fbfd890d9c12c549f94") {
          // MICHAEL R. - Native VTurb
          console.log('🎬 Injecting MICHAEL R. native VTurb');
          targetContainer.innerHTML = `<vturb-smartplayer id="vid-68677fbfd890d9c12c549f94" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer>`;
          
          // ✅ EXACT script as you provided
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `var s=document.createElement("script"); s.src="https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/68677fbfd890d9c12c549f94/v4/player.js", s.async=!0,document.head.appendChild(s);`;
          document.head.appendChild(script);
          console.log('✅ Michael R. VTurb script injected');
        }
      };
      
      // Try to inject immediately
      injectNativeVTurb();
    }

    // Cleanup when card becomes inactive
    return () => {
      if (!isActive) {
        // Clean up scripts when switching testimonials
        const scripts = document.querySelectorAll(`script[src*="${testimonial.videoId}"]`);
        scripts.forEach(script => {
          try {
            script.remove();
          } catch (error) {
            console.error('Error removing testimonial script:', error);
          }
        });
      }
    };
  }, [isActive, testimonial.videoId, testimonial.name]);

  return (
    <div className={`bg-white backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-200 hover:bg-white/95 transition-all duration-300 max-w-md w-full mx-4 ${
      isDragging ? 'shadow-2xl' : 'shadow-lg'
    } ${isActive ? 'ring-2 ring-blue-300' : ''}`}>
      
      {/* Customer Info - Photo + Name Side by Side */}
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={testimonial.profileImage}
          alt={testimonial.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-blue-300 flex-shrink-0 shadow-lg"
          draggable={false}
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 leading-tight mb-1">
            {testimonial.name}
          </h3>
          <p className="text-sm sm:text-base text-blue-700 font-medium leading-tight mb-2">
            {testimonial.location}
          </p>
          <div className="inline-flex">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-bold">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonial Quote */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 mb-4 border border-blue-100">
        <p className="text-sm sm:text-base text-blue-800 leading-relaxed italic">
          "{testimonial.caption}"
        </p>
      </div>

      {/* ✅ NATIVE VTurb video container - ONLY when active */}
      {isActive && (
        <div className="mb-4">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900 relative">
            {/* ✅ PURE VTurb Container - EXACTLY as you provided */}
            <div
              id={`vid-${testimonial.videoId}`}
              style={{
                display: 'block',
                margin: '0 auto',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 20
              }}
            >
              {/* Native VTurb content will be injected here */}
            </div>
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-gray-600 text-sm font-medium">5.0</span>
      </div>
    </div>
  );
};