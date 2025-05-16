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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import PostCommentDrawer from "./PostCommentDrawer";
import API_URL from "../../config";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [fetching, setFetching] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  const [isVerified, setIsVerified] = useState(null);
  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      checkUserVerification(email);
    }
  }, []);
  const checkUserVerification = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`, // make sure token is available
        },
      });

      const user = response.data;
      console.log(user);
      if (user.data.status === "Approved") {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    } catch (err) {
      console.error("Error checking user verification status:", err);
      setIsVerified(false);
    }
  };
  // Fetch all posts + like count + like status
  const fetchPosts = async () => {
    setFetching(true);
    try {
      const postResponse = await axios.get(`${API_URL}/api/users/posts/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const postsData = postResponse.data.data;
      console.log("Khanjan", postsData);
      const enrichedPosts = await Promise.all(
        postsData.map(async (post) => {
          let likeCount = 0;
          let isLiked = false;
          console.log("1", post.post_id);
          try {
            const [likeCountRes, likedRes] = await Promise.all([
              axios.get(
                `${API_URL}/api/users/postlike/likes-count/${post.post_id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              ),
              axios.get(
                `${API_URL}/api/users/postlike/liked/${userId}/${post.post_id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              ),
            ]);

            likeCount = likeCountRes.data.totalLikes;
            console.log(likeCount);
            isLiked = likedRes.data.liked || false;
          } catch (err) {
            console.error(
              `Error fetching like data for post ${post.post_id}`,
              err
            );
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
      const response = await axios.get(`${API_URL}/api/users/profile/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Build a map of user_id -> user object (with photo)
      const userMap = response.data.data.reduce((acc, user) => {
        acc[user.user_id] = {
          name: user.name, // optional
          photo: user.photo, // or user.profile_photo or user.image depending on your DB
        };
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
        ? `${API_URL}/api/users/postlike/unlike`
        : `${API_URL}/api/users/postlike/like`;

      const response = await axios.post(
        url,
        { post_id: postId, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Like/Unlike Response:", response.data);
    } catch (error) {
      console.error(
        "Like/Unlike Error:",
        error.response?.data || error.message
      );

      // Revert optimistic update on failure
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
  {/* IF VERIFIED: Show Feed */}
  {isVerified === true && (
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
                      <NavLink to={`/profile/${post.user_id}`}>
                        <div className="font-semibold text-blue-900">
                          {user.name || "Unknown User"}
                        </div>
                      </NavLink>
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
                    <PostCommentDrawer
                      postId={post.post_id}
                      userId={userId}
                    />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts yet.</p>
      )}

      {/* Add Post Button */}
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
  )}

  {/* IF NOT VERIFIED: Show Message inside same layout */}
  {isVerified === false && (
    <div className="container mx-auto max-w-2xl mt-24">
      <div className="bg-red-400 p-4 rounded-md border border-l-4 border-red-900 text-center">
        <p className="text-white text-sm">
          Your verification is pending. Please wait for admin approval.
        </p>
      </div>
    </div>
  )}
</div>

  );
}

export default Feed;
