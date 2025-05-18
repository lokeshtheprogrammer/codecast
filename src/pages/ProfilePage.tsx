import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Video } from '@/lib/types';
import VideoGrid from '@/components/VideoGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  } | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: Fetch user profile and videos from API
        await new Promise(resolve => setTimeout(resolve, 800));
        setUser({
          id: id || '1',
          name: 'User Name',
          email: 'user@example.com',
          bio: 'Content creator and video enthusiast',
        });
        setVideos([]); // Replace with actual API call
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">User not found</h3>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {user.bio && <p className="mt-2">{user.bio}</p>}
          <div className="mt-4 flex gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button>Upload Video</Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">My Videos</h2>
        {videos.length > 0 ? (
          <VideoGrid videos={videos} />
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium">No videos yet</h3>
            <p className="text-muted-foreground mt-2">Upload your first video to get started</p>
            <Button className="mt-4">Upload Video</Button>
          </div>
        )}
      </div>
    </div>
  );
}
