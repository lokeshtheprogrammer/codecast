import { useEffect, useRef, useState } from 'react';
import { Video } from '@/lib/types';
import { Button } from '../ui/button';
import { Icons } from '@/components/icons';

interface VideoPlayerProps {
  video: Video;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export function VideoPlayer({
  video,
  autoPlay = false,
  controls = true,
  className = '',
  onEnded,
  onTimeUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format time in seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          setError('Error playing video. Please try again.');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(videoRef.current.currentTime);
      }
    }
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration || 0);
    };

    const handleError = () => {
      setIsLoading(false);
      setError('Error loading video. Please check the URL and try again.');
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [video.videoUrl, onEnded]);

  // Set initial volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, []);

  if (error) {
    return (
      <div className={`bg-black aspect-video flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <Icons.alertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg font-medium">Error Loading Video</p>
          <p className="text-gray-300 mt-2">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4 text-white border-white hover:bg-white/10"
            onClick={() => window.location.reload()}
          >
            Reload Video
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        autoPlay={autoPlay}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlayPause}
        playsInline
        preload="metadata"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-700 rounded-full mb-3 cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <div 
            className="h-full bg-blue-600 rounded-full relative"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Icons.pause className="w-5 h-5" /> : <Icons.play className="w-5 h-5" />}
            </Button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <Icons.volumeX className="w-5 h-5" />
                ) : volume < 0.5 ? (
                  <Icons.volume1 className="w-5 h-5" />
                ) : (
                  <Icons.volume2 className="w-5 h-5" />
                )}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-white"
              />
            </div>

            {/* Time Display */}
            <div className="text-sm text-white font-mono">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </div>
          </div>

          {/* Fullscreen Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Icons.minimize2 className="w-5 h-5" />
            ) : (
              <Icons.maximize2 className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
