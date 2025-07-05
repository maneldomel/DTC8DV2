import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, Download, Smartphone, Users, TrendingUp, Award } from 'lucide-react';

export const AppPresentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  // App screenshots with descriptions
  const appScreenshots = [
    {
      id: 1,
      image: '/fcf77949-c8cc-4a67-80ee-62548c2167e0.jpeg',
      title: 'Welcome Dashboard',
      description: 'Personalized welcome screen with dose tracking and progress monitoring',
      features: ['Daily dose reminders', 'Progress tracking', 'Streak counter']
    },
    {
      id: 2,
      image: '/e9592f0e-070b-41fc-81b3-51e5a6ef6ef2.jpeg',
      title: 'Smart Scheduling',
      description: 'Configure your perfect dose schedule with morning and evening reminders',
      features: ['Custom dose times', 'Smart notifications', 'Flexible scheduling']
    },
    {
      id: 3,
      image: '/ca3a96af-11de-491e-bc77-6dd87c1069b3.jpeg',
      title: 'Health Tracking',
      description: 'Monitor your symptoms and track your journey to better health',
      features: ['Symptom tracking', 'Energy levels', 'Sleep quality monitoring']
    },
    {
      id: 4,
      image: '/35e5239e-f78f-4bca-b29a-05bd37792708.jpeg',
      title: 'Progress Analytics',
      description: 'Detailed insights into your health journey with comprehensive analytics',
      features: ['Treatment compliance', 'Energy trends', 'Achievement tracking']
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isDragging) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % appScreenshots.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, isDragging, appScreenshots.length]);

  // Drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        setCurrentSlide((prev) => (prev - 1 + appScreenshots.length) % appScreenshots.length);
      } else {
        setCurrentSlide((prev) => (prev + 1) % appScreenshots.length);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setTimeout(() => setIsAutoPlaying(true), 2000);
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
    if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Global mouse events
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
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX, dragOffset]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % appScreenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + appScreenshots.length) % appScreenshots.length);
  };

  return (
    <section className="mt-20 sm:mt-24 w-full max-w-7xl mx-auto px-4 py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Smartphone className="w-4 h-4" />
          <span>Introducing the BlueDrops App</span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-900 mb-6 leading-tight">
          <span className="block">Track Your Journey.</span>
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent block">
            Transform Your Life.
          </span>
        </h2>
        
        <p className="text-xl sm:text-2xl text-blue-700 font-semibold mb-4">
          The complete companion app for your BlueDrops treatment
        </p>
        
        <p className="text-lg text-blue-600 max-w-3xl mx-auto leading-relaxed">
          Monitor your progress, track your doses, and watch your transformation unfold with our beautifully designed mobile app.
        </p>
      </div>

      {/* App Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-900 mb-1">50K+</div>
            <div className="text-sm text-blue-600">Active Users</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-900 mb-1">4.9</div>
            <div className="text-sm text-blue-600">App Rating</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-900 mb-1">94%</div>
            <div className="text-sm text-blue-600">Success Rate</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-900 mb-1">#1</div>
            <div className="text-sm text-blue-600">Health App</div>
          </div>
        </div>
      </div>

      {/* Main App Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        
        {/* Phone Mockup with Screenshots */}
        <div className="relative flex justify-center">
          {/* Phone Frame */}
          <div className="relative">
            {/* Phone Shadow */}
            <div className="absolute inset-0 bg-black/20 rounded-[3rem] blur-xl transform translate-y-4 scale-105"></div>
            
            {/* Phone Body */}
            <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
              {/* Screen */}
              <div 
                className="bg-white rounded-[2.5rem] overflow-hidden relative"
                style={{ width: '320px', height: '640px' }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
                
                {/* Screenshot Container */}
                <div className="relative w-full h-full overflow-hidden">
                  {appScreenshots.map((screenshot, index) => {
                    const position = index - currentSlide;
                    let translateX = position * 100;
                    
                    if (isDragging) {
                      translateX += (dragOffset / 320) * 100;
                    }
                    
                    return (
                      <div
                        key={screenshot.id}
                        className="absolute inset-0 transition-transform duration-500 ease-out"
                        style={{
                          transform: `translateX(${translateX}%)`,
                          transition: isDragging ? 'none' : 'transform 0.5s ease-out'
                        }}
                      >
                        <img
                          src={screenshot.image}
                          alt={screenshot.title}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </div>
                    );
                  })}
                </div>
                
                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                  {appScreenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-blue-600 w-6' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-blue-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Current Screen Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-3">
              {appScreenshots[currentSlide].title}
            </h3>
            <p className="text-blue-700 text-lg mb-4 leading-relaxed">
              {appScreenshots[currentSlide].description}
            </p>
            
            {/* Features List */}
            <div className="space-y-2">
              {appScreenshots[currentSlide].features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg mb-2">Smart Reminders</h4>
              <p className="text-blue-100 text-sm">Never miss a dose with intelligent notifications</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg mb-2">Progress Tracking</h4>
              <p className="text-green-100 text-sm">Watch your health improve day by day</p>
            </div>
          </div>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-2xl">
            <h4 className="text-xl font-bold mb-2">Download the BlueDrops App</h4>
            <p className="text-blue-100 mb-4">Available for iOS and Android</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
                <span className="font-semibold">App Store</span>
              </button>
              
              <button className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
                <span className="font-semibold">Google Play</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-3">Easy to Use</h3>
          <p className="text-blue-600">Intuitive interface designed for daily use</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-3">Real Results</h3>
          <p className="text-blue-600">Track measurable improvements in your health</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-3">Award Winning</h3>
          <p className="text-blue-600">Recognized as the best health tracking app</p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-200">
        <h3 className="text-3xl font-bold text-blue-900 mb-4">
          Ready to Transform Your Life?
        </h3>
        <p className="text-xl text-blue-700 mb-6">
          Get BlueDrops and the companion app to start your journey today
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            Order BlueDrops Now
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-px h-8 bg-blue-300 hidden sm:block"></div>
            <span className="text-blue-600 font-medium">App included free</span>
          </div>
        </div>
      </div>
    </section>
  );
};