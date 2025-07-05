import React, { useEffect } from 'react';
import { CheckCircle, Star } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    location: string;
    profileImage: string;
    videoId: string;
    caption: string;
  };
  isActive: boolean;
  isDragging: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  isActive, 
  isDragging 
}) => {
  // ✅ UPDATED: ALL testimonials now have real VTurb videos
  const hasRealVideo = testimonial.videoId === "68677fbfd890d9c12c549f94" || // Michael R.
                       testimonial.videoId === "6867816a78c1d68a675981f1" ||   // Robert S.
                       testimonial.videoId === "68678320c5ab1e6abe6e5b6f";     // John O.

  // ✅ FIXED: Inject VTurb script only when card is active and has real video
  useEffect(() => {
    if (isActive && hasRealVideo) {
      console.log('🎬 Injecting native VTurb for testimonial:', testimonial.videoId);
      
      const injectVideo = () => {
        // ✅ CRITICAL: Wait for main video to be fully loaded first
        if (!window.vslVideoLoaded) {
          console.log('⏳ Waiting for main video to load before injecting testimonial video');
          setTimeout(injectVideo, 2000);
          return;
        }

        // ✅ CRITICAL: Ensure container exists and is properly isolated BEFORE injecting script
        const targetContainer = document.getElementById(`vid-${testimonial.videoId}`);
        if (!targetContainer) {
          console.error('❌ Target container not found for video:', testimonial.videoId);
          return;
        }

        // ✅ Clear any existing content
        targetContainer.innerHTML = '';

        // ✅ NEW: Use the EXACT native VTurb structure you provided
        if (testimonial.videoId === "68678320c5ab1e6abe6e5b6f") {
          // JOHN O. - Native VTurb
          targetContainer.innerHTML = `
            <vturb-smartplayer id="vid-68678320c5ab1e6abe6e5b6f" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer>
          `;
          
          // Inject the exact script you provided
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `
            var s=document.createElement("script"); 
            s.src="https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/68678320c5ab1e6abe6e5b6f/v4/player.js";
            s.async=true;
            document.head.appendChild(s);
          `;
          document.head.appendChild(script);
          console.log('✅ John O. VTurb injected');
          
        } else if (testimonial.videoId === "6867816a78c1d68a675981f1") {
          // ROBERT S. - Native VTurb
          targetContainer.innerHTML = `
            <vturb-smartplayer id="vid-6867816a78c1d68a675981f1" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer>
          `;
          
          // Inject the exact script you provided
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `
            var s=document.createElement("script"); 
            s.src="https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/6867816a78c1d68a675981f1/v4/player.js";
            s.async=true;
            document.head.appendChild(s);
          `;
          document.head.appendChild(script);
          console.log('✅ Robert S. VTurb injected');
          
        } else if (testimonial.videoId === "68677fbfd890d9c12c549f94") {
          // MICHAEL R. - Native VTurb
          targetContainer.innerHTML = `
            <vturb-smartplayer id="vid-68677fbfd890d9c12c549f94" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer>
          `;
          
          // Inject the exact script you provided
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `
            var s=document.createElement("script"); 
            s.src="https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/68677fbfd890d9c12c549f94/v4/player.js";
            s.async=true;
            document.head.appendChild(s);
          `;
          document.head.appendChild(script);
          console.log('✅ Michael R. VTurb injected');
        }
      };
      
      // Try to inject immediately
      injectVideo();
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
  }, [isActive, hasRealVideo, testimonial.videoId]);

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
              <CheckCircle className="w-3 h-3" />
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

      {/* ✅ UPDATED: Native VTurb video container - EXACTLY like doctors */}
      {isActive && hasRealVideo && (
        <div className="mb-4">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900 relative">
            {/* ✅ PURE VTurb Container - Exactly as you provided */}
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
                zIndex: 20,
                isolation: 'isolate'
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
          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
        ))}
        <span className="ml-1 text-gray-600 text-sm font-medium">5.0</span>
      </div>
    </div>
  );
};

export default TestimonialCard;