
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { getAdminAnalytics, users, videos, comments } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AdminDashboard: React.FC = () => {
  const analytics = getAdminAnalytics();
  const [activeTab, setActiveTab] = useState("overview");

  const COLORS = ["#9b87f5", "#D6BCFA", "#8B5CF6", "#7E69AB", "#E5DEFF"];

  const handleSuspendUser = (userId: string) => {
    toast.success("User suspended successfully");
  };

  const handleDeleteVideo = (videoId: string) => {
    toast.success("Video deleted successfully");
  };

  const handleDeleteComment = (commentId: string) => {
    toast.success("Comment deleted successfully");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.newUsersToday} today
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalVideos}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.newVideosToday} today
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Most Viewed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.mostViewedCategory.category}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.mostViewedCategory.views.toLocaleString()} views
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Flagged Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.flaggedComments}</div>
                <p className="text-xs text-muted-foreground">Needs review</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Uploads</CardTitle>
                <CardDescription>Video uploads for the past week</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dailyUploads}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#9b87f5" name="Uploads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Tags</CardTitle>
                <CardDescription>Most used tags across all videos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.topTags}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="tag"
                      >
                        {analytics.topTags.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={user.role === "admin" ? "default" : user.role === "creator" ? "secondary" : "outline"}>
                        {user.role}
                      </Badge>
                      {user.role !== "admin" && (
                        <Button variant="destructive" size="sm" onClick={() => handleSuspendUser(user.id)}>
                          {user.suspended ? "Unsuspend" : "Suspend"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
              <CardDescription>Manage uploaded videos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="h-16 w-28 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{video.creator.username}</span>
                          <span>•</span>
                          <span>{video.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Manage user comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment) => {
                  const video = videos.find((v) => v.id === comment.videoId);
                  return (
                    <div key={comment.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Anonymous User</span>{" "}
                          on{" "}
                          <span className="font-medium">{video?.title}</span>
                        </p>
                        <p className="mt-1">{comment.content}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {comment.flagged && (
                          <Badge variant="destructive">Flagged</Badge>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
