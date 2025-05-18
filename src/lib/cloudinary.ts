import { Cloudinary } from '@cloudinary/url-gen';
import { UploadWidget } from '@cloudinary/upload-widget-react';

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

// Configuration for the upload widget
export const uploadWidgetConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  sources: ['local', 'url'],
  resourceType: 'video',
  folder: 'codecast/videos',
  maxFileSize: 150000000, // 150MB
  clientAllowedFormats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  maxVideoFileSize: 150000000, // 150MB
  multiple: false,
  showAdvancedOptions: true,
  styles: {
    palette: {
      window: '#1E293B',
      sourceBg: '#0F172A',
      windowBorder: '#334155',
      tabIcon: '#60A5FA',
      inactiveTabIcon: '#64748B',
      menuIcons: '#CBD5E1',
      link: '#60A5FA',
      action: '#4F46E5',
      inProgress: '#00BFFF',
      complete: '#10B981',
      error: '#EF4444',
      textDark: '#1E293B',
      textLight: '#F8FAFC'
    },
    fonts: {
      default: {
        active: true
      }
    }
  }
};

// Generate video URL with transformations
export const getVideoUrl = (publicId: string) => {
  return cld.video(publicId).toURL();
};

// Generate thumbnail URL
export const getThumbnailUrl = (publicId: string) => {
  return cld.video(publicId)
    .setDeliveryType('upload')
    .format('jpg')
    .resize('crop', 1280, 720)
    .toURL();
};
