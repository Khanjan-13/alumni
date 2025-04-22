import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, MessageCircle, Pencil } from "lucide-react";
import { NavLink } from "react-router-dom";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [fetching, setFetching] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  // Fetch all posts + like count + like status
  const fetchPosts = async () => {
    setFetching(true);
    try {
      const postResponse = await axios.get(
        "https://alumni-backend-drab.vercel.app/api/users/posts/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const postsData = postResponse.data.data;

      // Enrich posts with like count & like status
      const enrichedPosts = await Promise.all(
        postsData.map(async (post) => {
          let likeCount = 0;
          let isLiked = false;

          try {
            const likeRes = await axios.get(
              `https://alumni-backend-drab.vercel.app/api/users/postlike/likes-count/${post.post_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            likeCount = likeRes.data.count || 0;
          } catch (err) {
            console.error("Failed to fetch like count", err);
          }

          try {
            const likedRes = await axios.get(
              `https://alumni-backend-drab.vercel.app/api/users/postlike/liked/${userId}/${post.post_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            isLiked = likedRes.data.liked || false;
          } catch (err) {
            console.error("Failed to fetch like status", err);
          }

          return { ...post, likes: likeCount, isLiked };
        })
      );

      setPosts(enrichedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setFetching(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://alumni-backend-drab.vercel.app/api/users/profile/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userMap = response.data.data.reduce((acc, user) => {
        acc[user.user_id] = user;
        return acc;
      }, {});
      setUsers(userMap);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const handleLike = async (postId, isLiked) => {
    try {
      // Optimistically update UI
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId
            ? {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !isLiked,
              }
            : post
        )
      );

      const url = isLiked
        ? "https://alumni-backend-drab.vercel.app/api/users/postlike/unlike"
        : "https://alumni-backend-drab.vercel.app/api/users/postlike/like";
      console.log(postId, userId);
      const res = await axios.post(
        url,
        { post_id: postId, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Log the response
      console.log("Like/Unlike Response:", res.data);
    } catch (err) {
      console.error(
        "Error while liking/unliking:",
        err.response?.data || err.message
      );

      // Revert optimistic UI update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId
            ? {
                ...post,
                likes: isLiked ? post.likes + 1 : post.likes - 1,
                isLiked: isLiked,
              }
            : post
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl mt-24">
        {fetching ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => {
              const user = users[post.user_id] || {};
              return (
                <Card key={post.post_id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={user.photo || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.name
                            ? user.name
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-blue-900">
                          {user.name || "Unknown User"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(post.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{post.content}</p>
                    {post.media_url && (
                      <img
                        src={post.media_url}
                        alt="Post"
                        className="max-w-full h-auto rounded-lg"
                      />
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <div className="flex items-center gap-4 w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.post_id, post.isLiked)}
                        className={post.isLiked ? "text-blue-600" : ""}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            post.isLiked ? "fill-current text-blue-600" : ""
                          }`}
                        />
                        {post.likes || 0}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />0
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No posts yet.</p>
        )}

        <div className="fixed bottom-6 right-6">
          <NavLink
            to="/feed-post"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-4 py-2 rounded-full"
          >
            <Pencil className="h-5 w-5" />
            Add Post
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Feed;
