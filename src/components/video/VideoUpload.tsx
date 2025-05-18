import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';

// Debug logging
const debug = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log('[VideoUpload]', ...args);
  }
};

// Declare the Cloudinary widget type
declare global {
  interface Window {
    cloudinary: any;
  }
}

// Function to load the Cloudinary widget script
const loadCloudinaryScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.cloudinary) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
};

interface VideoUploadProps {
  onUploadSuccess: (video: Partial<Video>) => void;
  onUploadError?: (error: any) => void;
}

export function VideoUpload({ onUploadSuccess, onUploadError }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Handle upload success
  const handleUploadSuccess = useCallback((error: any, result: any) => {
    if (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload video',
        variant: 'destructive',
      });
      if (onUploadError) {
        onUploadError(error);
      }
      setIsUploading(false);
      return;
    }

    if (result.event === 'success') {
      console.log('Upload successful:', result.info);
      const videoInfo = {
        title: result.info.original_filename,
        url: result.info.secure_url,
        thumbnailUrl: result.info.thumbnail_url || '',
        duration: result.info.duration || 0,
      };
      onUploadSuccess(videoInfo);
      toast({
        title: 'Upload Successful',
        description: 'Your video has been uploaded successfully!',
      });
    } else if (result.event === 'close') {
      console.log('Upload widget closed by user');
    }
    
    setIsUploading(false);
  }, [onUploadSuccess, onUploadError, toast]);

  // Handle upload errors
  const handleUploadError = useCallback((error: any) => {
    console.error('Upload error:', error);
    toast({
      title: 'Upload Failed',
      description: error.message || 'Failed to upload video',
      variant: 'destructive',
    });
    if (onUploadError) {
      onUploadError(error);
    }
    setIsUploading(false);
  }, [onUploadError, toast]);

  // Load Cloudinary script on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadScriptAsync = async () => {
      try {
        debug('Loading Cloudinary script...');
        await loadCloudinaryScript();
        debug('Cloudinary script loaded successfully');
        if (isMounted) {
          setIsScriptLoaded(true);
          debug('Script loaded state updated');
        }
      } catch (error) {
        console.error('[VideoUpload] Failed to load Cloudinary script:', error);
        if (isMounted) {
          const errorMsg = 'Failed to load uploader. Please check your internet connection and refresh the page.';
          console.error('[VideoUpload]', errorMsg);
          toast({
            title: 'Uploader Error',
            description: errorMsg,
            variant: 'destructive',
          });
        }
      }
    };

    // Only load script if window is available (client-side)
    if (typeof window !== 'undefined') {
      if (window.cloudinary) {
        console.log('Cloudinary already loaded');
        setIsScriptLoaded(true);
      } else {
        console.log('Cloudinary not loaded, loading now...');
        loadScriptAsync();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [toast]);

  // Open the Cloudinary upload widget
  const openWidget = useCallback(() => {
    debug('Open widget called, isScriptLoaded:', isScriptLoaded);
    
    if (!isScriptLoaded) {
      const errorMsg = 'Cloudinary script not loaded yet. Please wait and try again.';
      debug(errorMsg);
      toast({
        title: 'Uploader Not Ready',
        description: errorMsg,
        variant: 'default',
      });
      return;
    }

    try {
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'codecast_uploads';
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'del0trhdj';
      
      debug('Environment variables:', {
        VITE_CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ? 'set' : 'not set',
        VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ? 'set' : 'not set'
      });
      
      debug('Opening Cloudinary widget with:', { cloudName, uploadPreset });
      
      if (!cloudName || !uploadPreset) {
        throw new Error('Missing required Cloudinary configuration');
      }
      
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ['local'],
          multiple: false,
          resourceType: 'video',
          maxFileSize: 5000000, // 5GB
          clientAllowedFormats: ['mp4', 'mov'],
          maxVideoFileSize: 5000000, // 5GB
          showAdvancedOptions: false,
          defaultSource: 'local',
          folder: 'codecast/videos',
          styles: {
            palette: {
              window: '#FFFFFF',
              sourceBg: '#F4F4F5',
              windowBorder: '#90a0b3',
              tabIcon: '#0078FF',
              inactiveTabIcon: '#555a5f',
              menuIcons: '#555a5f',
              link: '#0078FF',
              action: '#FF620C',
              inProgress: '#0078FF',
              complete: '#20B832',
              error: '#E63737',
              textDark: '#000000',
              textLight: '#FCFFFD'
            },
            fonts: {
              default: null,
              '"IBM Plex Sans", sans-serif': {
                url: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans',
                active: true
              }
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            handleUploadError(error);
            return;
          }
          handleUploadSuccess(error, result);
        }
      );

      setIsUploading(true);
      setUploadProgress(0);
      debug('Widget created, opening...');
      widget.open();
    } catch (error) {
      console.error('[VideoUpload] Error creating upload widget:', error);
      toast({
        title: 'Upload Error',
        description: error instanceof Error ? error.message : 'Failed to initialize uploader. Please try again.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  }, [isScriptLoaded, handleUploadSuccess, handleUploadError, toast]);

  debug('Render state:', { isScriptLoaded, isUploading, uploadProgress });
  
  return (
    <div className="space-y-4">
      <Button
        onClick={openWidget}
        disabled={isUploading || !isScriptLoaded}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : !isScriptLoaded ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Initializing Uploader...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </>
        )}
      </Button>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Supported formats: MP4, MOV (max 5GB)
      </p>
    </div>
  );
}
