
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { getCreatorAnalytics, getVideosByCreatorId } from "@/lib/data";
import { getAuthState } from "@/lib/auth";
import VideoGrid from "./VideoGrid";

const CreatorDashboard: React.FC = () => {
  const { user } = getAuthState();
  const analytics = getCreatorAnalytics(user?.id || "");
  const userVideos = getVideosByCreatorId(user?.id || "");

  // Colors for charts
  const colors = {
    primary: "#9b87f5",
    secondary: "#8B5CF6",
    accent: "#D6BCFA",
    muted: "#F1F0FB",
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 10) + 5}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 15) + 5}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Like/Dislike Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.likeDislikeRatio.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.floor(Math.random() * 5) - 2}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 20) + 5}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>Daily view count over the past week</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.8)",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Views"
                    stroke={colors.primary}
                    strokeWidth={2}
                    dot={{ fill: colors.primary }}
                    activeDot={{ r: 6, fill: colors.secondary }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>
              {analytics.topPerformingVideo ? analytics.topPerformingVideo.title : "No videos yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topPerformingVideo && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Views</span>
                  <span className="font-medium">{analytics.topPerformingVideo.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Likes</span>
                  <span className="font-medium">{analytics.topPerformingVideo.likes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average watch time</span>
                  <span className="font-medium">
                    {Math.floor(analytics.topPerformingVideo.averageWatchDuration! / 60)}m {analytics.topPerformingVideo.averageWatchDuration! % 60}s
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Watch-through rate</span>
                  <span className="font-medium">
                    {Math.round((analytics.topPerformingVideo.averageWatchDuration! / analytics.topPerformingVideo.duration) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <VideoGrid videos={userVideos} title="Your Videos" columns={4} />
    </div>
  );
};

export default CreatorDashboard;
