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
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Pencil } from "lucide-react";
import { NavLink } from "react-router-dom";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [fetching, setFetching] = useState(true);
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  // Fetch Posts
  const fetchPosts = async () => {
    setFetching(true);
    try {
      const response = await axios.get(
        "https://alumni-backend-drab.vercel.app/api/users/posts/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setFetching(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://alumni-backend-drab.vercel.app/api/users/profile/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const usersMap = response.data.data.reduce((acc, user) => {
        acc[user.user_id] = user;
        return acc;
      }, {});
      setUsers(usersMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  // Handle Like API Call
  const handleLike = async (postId) => {
    const userId = localStorage.getItem("user_id"); // Get user_id from localStorage
  
    if (!userId) {
      console.error("User ID not found. Please log in again.");
      return;
    }
  
    // Optimistic UI update
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post_id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : (post.likes || 0) + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  
    try {
      await axios.post(
        "https://alumni-backend-drab.vercel.app/api/users/postlike/like",
        { post_id: postId, user_id: userId }, // ✅ Include user_id in the request body
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error liking post:", error.response?.data || error.message);
      // Revert state if request fails
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId
            ? {
                ...post,
                likes: post.isLiked ? post.likes + 1 : post.likes - 1,
                isLiked: !post.isLiked,
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
              const user = users[post.user_id] || {}; // Get user info based on post's user_id
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
                                .map((word) => word[0])
                                .slice(0, 2)
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
                      <div className="relative w-full overflow-hidden rounded-lg">
                        <img
                          src={post.media_url}
                          alt="Post"
                          className="max-w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <div className="flex items-center gap-4 w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.post_id)}
                        className={post.isLiked ? "text-blue-600" : ""}
                        aria-label="Like post"
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 transition-all duration-200 ${
                            post.isLiked ? "fill-current text-blue-600" : ""
                          }`}
                        />
                        {post.likes || 0}
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Comment">
                        <MessageCircle className="h-4 w-4 mr-2" /> 0
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

        {/* Floating Add Post Button */}
        <div className="fixed bottom-6 right-6">
          <NavLink
            to="/feed-post"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-4 py-2 rounded-full transition duration-200"
            aria-label="Add Post"
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
