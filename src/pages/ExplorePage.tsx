import { useEffect, useState } from 'react';
import { Video } from '@/lib/types';
import VideoGrid from '@/components/VideoGrid';
import { Button } from '@/components/ui/button';

export function ExplorePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch videos from API
    const fetchVideos = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVideos([]); // Replace with actual API call
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Explore Videos</h1>
        <Button>Upload Video</Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No videos found</h3>
          <p className="text-muted-foreground mt-2">Upload your first video to get started</p>
        </div>
      )}
    </div>
  );
}
