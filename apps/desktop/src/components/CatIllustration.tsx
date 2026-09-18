import React from 'react';

export type CatPose = 'idle' | 'recommendation' | 'empty' | 'focus' | 'completed' | 'loading' | 'error' | 'peek' | 'purr';

interface CatIllustrationProps {
  pose?: CatPose;
  className?: string;
  size?: number;
  interactive?: boolean;
  onTap?: () => void;
  showCaption?: boolean;
  captionText?: string;
}

export const CatIllustration: React.FC<CatIllustrationProps> = ({
  pose = 'idle',
  className = '',
  size = 64,
  interactive = true,
  onTap,
  showCaption = false,
  captionText,
}) => {
  const strokeColor = '#F06A3A';

  const renderSvg = () => {
    switch (pose) {
      case 'recommendation':
        // Cat looking warmly with speech scribble "let's do this <3"
        return (
          <svg
            viewBox="0 0 100 80"
            width={size}
            height={(size * 80) / 100}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            {/* Ears */}
            <path d="M28 28 L34 10 L44 22" />
            <path d="M56 22 L66 10 L72 28" />
            
            {/* Head */}
            <path d="M28 28 C22 36 24 50 36 54 C44 56 56 56 64 54 C76 50 78 36 72 28 C66 22 34 22 28 28 Z" />
            
            {/* Eyes - gentle happy curves */}
            <path d="M38 36 Q43 33 46 36" />
            <path d="M54 36 Q57 33 62 36" />
            
            {/* Nose & mouth */}
            <path d="M49 42 L51 42" />
            <path d="M50 42 C48 46 45 47 42 45" />
            <path d="M50 42 C52 46 55 47 58 45" />
            
            {/* Whiskers */}
            <path d="M24 38 L12 36" />
            <path d="M24 43 L10 44" />
            <path d="M76 38 L88 36" />
            <path d="M76 43 L90 44" />

            {/* Little paw resting */}
            <path d="M42 54 C42 62 48 64 52 64 C56 64 58 60 58 54" />
          </svg>
        );

      case 'empty':
        // Cat sleeping curled up on top of a closed notebook with "z z z"
        return (
          <svg
            viewBox="0 0 160 120"
            width={size}
            height={(size * 120) / 160}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            {/* Closed notebook underneath */}
            <path d="M30 85 L80 102 L130 85 L80 68 Z" stroke="#383832" strokeWidth="1.5" />
            <path d="M30 85 L30 92 L80 109 L130 92 L130 85" stroke="#383832" strokeWidth="1.5" />
            <path d="M80 102 L80 109" stroke="#383832" strokeWidth="1.5" />
            <line x1="72" y1="99" x2="88" y2="105" stroke="#F06A3A" strokeWidth="1.5" strokeOpacity="0.4" />

            {/* Curled cat body */}
            <path d="M56 80 C48 70 54 52 70 50 C92 48 114 58 114 74 C114 86 98 90 82 88 C70 86 58 84 56 80 Z" />
            
            {/* Curled cat head tucked in */}
            <path d="M58 72 C52 68 52 58 60 56 C68 54 74 60 72 68" />
            
            {/* Sleeping eyes */}
            <path d="M60 64 Q64 67 68 64" />
            
            {/* Ears */}
            <path d="M54 58 L50 48 L60 54" />
            <path d="M64 54 L70 46 L73 56" />

            {/* Curled tail hugging back */}
            <path d="M112 78 C122 75 124 64 116 60 C110 58 104 62 102 66" />

            {/* Sleeping Zs */}
            <g stroke={strokeColor} strokeWidth="1.5" opacity="0.85">
              <path d="M120 40 L128 40 L120 48 L128 48" />
              <path d="M132 30 L142 30 L132 40 L142 40" />
              <path d="M144 20 L156 20 L144 32 L156 32" />
            </g>
          </svg>
        );

      case 'focus':
        // Cat in calm meditation/focus resting pose
        return (
          <svg
            viewBox="0 0 100 90"
            width={size}
            height={(size * 90) / 100}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            {/* Ears */}
            <path d="M34 26 L40 10 L50 20" />
            <path d="M62 20 L72 10 L78 26" />
            
            {/* Head */}
            <path d="M34 26 C28 34 30 46 42 50 C52 52 64 52 70 50 C82 46 84 34 78 26 C72 20 40 20 34 26 Z" />
            
            {/* Soft focused closed/half-closed eyes */}
            <path d="M42 36 L48 36" />
            <path d="M64 36 L70 36" />
            
            {/* Nose & mouth */}
            <path d="M55 41 L57 41" />
            <path d="M56 41 C54 44 51 45 48 43" />
            <path d="M56 41 C58 44 61 45 64 43" />
            
            {/* Body sphinx loaf sitting */}
            <path d="M32 50 C24 58 24 74 36 78 C48 80 74 80 84 76 C92 72 90 58 76 52" />
            
            {/* Front paws tucked in */}
            <path d="M44 76 C44 72 50 70 56 70 C62 70 66 72 66 76" />

            {/* Gentle tail wrapped */}
            <path d="M84 74 C96 74 98 62 92 58" />
          </svg>
        );

      case 'completed':
        // Celebratory cat raising one paw with "Great!" doodle
        return (
          <svg
            viewBox="0 0 110 100"
            width={size}
            height={(size * 100) / 110}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            {/* Ears */}
            <path d="M32 30 L36 12 L48 24" />
            <path d="M60 24 L72 12 L76 30" />
            
            {/* Head */}
            <path d="M32 30 C26 38 28 50 40 54 C50 56 60 56 68 54 C80 50 82 38 76 30 C70 24 38 24 32 30 Z" />
            
            {/* Joyful open/happy eyes */}
            <path d="M40 38 Q45 32 50 38" />
            <path d="M58 38 Q63 32 68 38" />
            
            {/* Little open mouth smile */}
            <path d="M54 44 C51 47 48 47 46 45" />
            <path d="M54 44 C57 47 60 47 62 45" />
            <path d="M51 47 Q54 52 57 47" fill="rgba(240, 106, 58, 0.2)" />
            
            {/* Body */}
            <path d="M36 54 C30 64 32 84 44 86 C54 88 72 88 78 84 C86 78 82 62 72 54" />
            
            {/* Raised right paw celebrating */}
            <path d="M72 54 C80 48 88 40 92 34 C94 30 90 28 86 32 C82 36 78 44 74 52" />
            
            {/* Left paw on ground */}
            <path d="M44 86 L44 74" />

            {/* Happy wagging tail */}
            <path d="M78 82 C92 84 100 74 98 64 C96 58 92 60 92 64" />

            {/* Little joy sparks */}
            <line x1="96" y1="24" x2="102" y2="18" stroke="#F06A3A" strokeWidth="1.5" />
            <line x1="100" y1="32" x2="108" y2="32" stroke="#F06A3A" strokeWidth="1.5" />
          </svg>
        );

      case 'loading':
        // Cat sitting patiently watching
        return (
          <svg
            viewBox="0 0 90 90"
            width={size}
            height={size}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            {/* Ears */}
            <path d="M28 26 L32 10 L44 20" />
            <path d="M56 20 L68 10 L72 26" />
            
            {/* Head tilted slightly */}
            <path d="M28 26 C22 34 24 46 36 50 C46 52 58 52 64 50 C76 46 78 34 72 26 C66 20 34 20 28 26 Z" />
            
            {/* Large curious round eyes */}
            <circle cx="42" cy="36" r="3" fill="#F06A3A" />
            <circle cx="58" cy="36" r="3" fill="#F06A3A" />
            
            {/* Nose & mouth */}
            <path d="M49 42 L51 42" />
            <path d="M50 42 C48 45 45 46 42 44" />
            <path d="M50 42 C52 45 55 46 58 44" />
            
            {/* Body */}
            <path d="M32 50 C26 60 28 80 40 82 C50 84 66 84 72 80 C78 74 76 60 68 50" />
            
            {/* Little front paws */}
            <path d="M44 82 L44 70" />
            <path d="M54 82 L54 70" />

            {/* Gentle tail */}
            <path d="M72 80 C84 82 88 72 84 66" />
          </svg>
        );

      case 'error':
        // Cat looking puzzled / tilting head with little question scribble
        return (
          <svg
            viewBox="0 0 100 90"
            width={size}
            height={(size * 90) / 100}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            {/* Ears - one flat */}
            <path d="M28 28 L26 12 L40 22" />
            <path d="M56 22 L72 16 L70 30" />
            
            {/* Head */}
            <path d="M28 28 C20 36 24 48 34 52 C44 54 58 54 66 50 C76 46 78 34 70 30 C64 22 34 22 28 28 Z" />
            
            {/* One eye open, one squinting */}
            <circle cx="40" cy="38" r="3" fill="#F06A3A" />
            <path d="M56 38 L64 38" />
            
            {/* Confused mouth */}
            <path d="M48 44 Q52 42 56 46" />
            
            {/* Body */}
            <path d="M30 52 C24 62 26 80 38 82 C50 84 66 84 72 80 C78 74 74 60 66 50" />
            
            {/* Paws */}
            <path d="M42 82 L42 70" />
            <path d="M52 82 L52 70" />

            {/* Tail */}
            <path d="M72 80 C82 82 86 70 80 64" />

            {/* Little question squiggle */}
            <path d="M84 24 Q88 18 94 22 Q94 28 88 32" stroke="#F06A3A" strokeWidth="1.5" />
            <circle cx="88" cy="36" r="1" fill="#F06A3A" />
          </svg>
        );

      case 'peek':
        // Cat peeking from the bottom or side
        return (
          <svg
            viewBox="0 0 90 60"
            width={size}
            height={(size * 60) / 90}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            {/* Ears */}
            <path d="M22 34 L28 12 L40 26" />
            <path d="M54 26 L66 12 L72 34" />
            
            {/* Top of head */}
            <path d="M18 42 C16 32 20 28 28 28 C36 28 58 28 66 28 C74 28 78 32 76 42" />
            
            {/* Big peering eyes */}
            <circle cx="36" cy="38" r="4" fill="#F06A3A" />
            <circle cx="58" cy="38" r="4" fill="#F06A3A" />
            <circle cx="37" cy="37" r="1.5" fill="#0D0D0C" />
            <circle cx="59" cy="37" r="1.5" fill="#0D0D0C" />
            
            {/* Paws on the edge */}
            <path d="M26 44 C26 40 30 38 34 38 C38 38 40 40 40 44" />
            <path d="M54 44 C54 40 58 38 62 38 C66 38 68 40 68 44" />
          </svg>
        );

      case 'purr':
        // Cat curled by button with subtle vibration sparks
        return (
          <svg
            viewBox="0 0 100 80"
            width={size}
            height={(size * 80) / 100}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            <path d="M30 34 L36 18 L46 28" />
            <path d="M56 28 L66 18 L72 34" />
            <path d="M30 34 C24 42 26 56 38 60 C48 62 62 62 70 58 C80 54 80 40 72 34 C64 28 36 28 30 34 Z" />
            <path d="M40 42 Q45 38 50 42" />
            <path d="M58 42 Q63 38 68 42" />
            <path d="M54 48 L54 52" />
            <path d="M26 60 C20 68 24 76 38 78 C52 80 72 80 78 76 C84 72 84 62 76 56" />
            <path d="M78 74 C90 76 96 66 90 60" />
            {/* Purr rays */}
            <path d="M16 46 L10 44" strokeWidth="1.5" />
            <path d="M18 54 L12 56" strokeWidth="1.5" />
            <path d="M84 46 L90 44" strokeWidth="1.5" />
            <path d="M82 54 L88 56" strokeWidth="1.5" />
          </svg>
        );

      case 'idle':
      default:
        // Screen 01 & general sitting doodle cat
        return (
          <svg
            viewBox="0 0 100 90"
            width={size}
            height={(size * 90) / 100}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            {/* Left ear */}
            <path d="M28 28 L32 10 L44 22" />
            {/* Right ear */}
            <path d="M56 22 L68 10 L72 28" />
            
            {/* Head contour */}
            <path d="M28 28 C20 36 24 50 36 54 C46 56 58 56 66 52 C76 48 78 34 72 28 C66 22 34 22 28 28 Z" />
            
            {/* Eyes */}
            <path d="M38 36 Q43 32 48 36" />
            <path d="M56 36 Q61 32 66 36" />
            
            {/* Nose & mouth */}
            <path d="M51 42 L53 42" />
            <path d="M52 42 C50 45 47 46 44 44" />
            <path d="M52 42 C54 45 57 46 60 44" />
            
            {/* Whiskers */}
            <path d="M24 38 L12 36" />
            <path d="M24 44 L10 45" />
            <path d="M74 38 L86 36" />
            <path d="M74 44 L88 45" />
            
            {/* Sitting Body */}
            <path d="M32 54 C24 64 26 80 38 84 C52 86 70 86 78 80 C86 74 82 60 70 52" />
            
            {/* Front paws */}
            <path d="M44 84 L44 70" />
            <path d="M56 84 L56 70" />

            {/* Curling tail around feet */}
            <path d="M78 80 C92 82 96 70 90 64 C86 60 82 64 82 68" />
          </svg>
        );
    }
  };

  return (
    <div
      onClick={interactive ? onTap : undefined}
      className={`inline-flex flex-col items-center select-none transition-transform duration-150 ${
        interactive ? 'cursor-pointer active:scale-95' : ''
      } ${className}`}
      title={interactive ? 'Tap cat for assistance' : undefined}
    >
      {renderSvg()}
      {showCaption && captionText && (
        <span className="font-hand text-sm text-[#F06A3A] mt-1 tracking-wide leading-tight">
          {captionText}
        </span>
      )}
    </div>
  );
};
