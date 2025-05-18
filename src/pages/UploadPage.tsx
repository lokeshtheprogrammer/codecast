import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoUpload } from '@/components/video/VideoUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Video, VideoCategory, DifficultyLevel } from '@/lib/types';
import { createVideo } from '@/lib/api/videos';

export function UploadPage() {
  return <UploadPageContent />;
}

function UploadPageContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoData, setVideoData] = useState<Partial<Video>>({
    title: '',
    description: '',
    tags: [],
    category: 'Frontend',
    difficulty: 'Beginner',
  });
  const [tagInput, setTagInput] = useState('');

  const handleVideoUpload = (uploadedVideo: Partial<Video>) => {
    setVideoData(prev => ({
      ...prev,
      ...uploadedVideo,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (newTag && !videoData.tags?.includes(newTag)) {
        setVideoData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setVideoData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoData.title || !videoData.videoUrl || videoData.duration === undefined) {
      toast({
        title: 'Missing required fields',
        description: 'Please provide a title, upload a video, and ensure duration is set.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const newVideo = await createVideo({
        ...videoData,
        // Ensure required fields are present
        title: videoData.title || 'Untitled Video',
        description: videoData.description || '',
        videoUrl: videoData.videoUrl, // Required field
        duration: videoData.duration,  // Required field
        tags: videoData.tags || [],
        category: (videoData.category as VideoCategory) || 'Frontend',
        difficulty: (videoData.difficulty as DifficultyLevel) || 'Beginner',
        views: 0,
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: 'Video uploaded successfully!',
        description: 'Your video is now live.',
      });
      
      // Redirect to the video page
      navigate(`/videos/${newVideo.id}`);
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: 'Error uploading video',
        description: 'There was an error uploading your video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Video</h1>
          <p className="text-muted-foreground">
            Share your knowledge with the developer community
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Video Upload Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Video</h2>
              <p className="text-sm text-muted-foreground">
                Upload a video file or paste a URL from YouTube/Vimeo
              </p>
            </div>
            
            {!videoData.videoUrl ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <VideoUpload 
                  onUploadSuccess={handleVideoUpload}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                    toast({
                      title: 'Upload failed',
                      description: error.message || 'An error occurred while uploading your video.',
                      variant: 'destructive',
                    });
                  }}
                />
              </div>
            ) : (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={videoData.videoUrl}
                  className="w-full h-full object-contain"
                  controls
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black/50"
                  onClick={() => {
                    setVideoData(prev => ({
                      ...prev,
                      videoUrl: undefined,
                      thumbnailUrl: undefined,
                    }));
                  }}
                >
                  Change Video
                </Button>
              </div>
            )}
          </div>

          {/* Video Details Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={videoData.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={videoData.description || ''}
                onChange={handleInputChange}
                placeholder="Tell viewers about your video"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={videoData.category}
                  onValueChange={(value) =>
                    setVideoData(prev => ({
                      ...prev,
                      category: value as VideoCategory,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="System Design">System Design</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={videoData.difficulty}
                  onValueChange={(value) =>
                    setVideoData(prev => ({
                      ...prev,
                      difficulty: value as DifficultyLevel,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-12">
                {videoData.tags?.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      onClick={() => removeTag(tag)}
                    >
                      <span className="sr-only">Remove tag</span>
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                        <path d="M8 0.8L7.2 0 4 3.2 0.8 0 0 0.8 3.2 4 0 7.2 0.8 8 4 4.8 7.2 8 8 7.2 4.8 4 8 0.8z" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="flex-1 min-w-[100px] border-0 p-0 focus:ring-0 text-sm"
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagAdd}
                  onBlur={(e) => {
                    if (tagInput.trim()) {
                      handleTagAdd({ ...e, key: 'Enter' } as any);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter or comma to add a tag
              </p>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !videoData.videoUrl}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Video'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
