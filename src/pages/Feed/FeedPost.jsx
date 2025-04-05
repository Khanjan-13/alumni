import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, ImageIcon, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

function FeedPost() {
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  // Fetch user posts
  const fetchUserPosts = async () => {
    setFetching(true);
    try {
      const response = await axios.get(
        `https://alumni-backend-drab.vercel.app/api/users/posts/user/${user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(response.data.data); // Fix: Set only the 'data' array
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle post submission
  const handlePost = async () => {
    if (!newPost.trim() && !image) {
      toast.error("Post content or image is required!");
      return;
    }

    setLoading(true);
    toast.loading("Uploading post...");

    try {
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("content", newPost);
      if (image) formData.append("media", image);

      const response = await axios.post(
        "https://alumni-backend-drab.vercel.app/api/users/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      if (response.status === 201) {
        setNewPost("");
        setImage(null);
        fetchUserPosts(); // Refresh posts after posting
        toast.dismiss();
        toast.success("Post created successfully!");
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error("Error posting:", error);
      toast.dismiss();
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <Toaster
        position="top-center"
        containerStyle={{
          top: "50%",
          transform: "translateY(-50%)", // Moves it to the exact middle
        }}
        toastOptions={{
          style: {
            background: "#1E40AF", // Deep blue background
            color: "#fff", // White text
            fontSize: "16px",
            fontWeight: "bold",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Adds a subtle shadow
          },
          success: {
            iconTheme: {
              primary: "#22C55E", // Green success icon
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444", // Red error icon
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="container mx-auto max-w-2xl mt-24">
          {/* Create Post */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>CU</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px]"
                  />
                  {/* Image Upload */}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                    <Button
                      onClick={handlePost}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        "Posting..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Post
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Posts Section */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">My Posts</h2>
            {fetching ? (
              <p>Loading posts...</p>
            ) : posts.length > 0 ? (
              posts
                .filter((post) => post.user_id === user_id) // No need for post.data
                .map((post) => (
                  <Card key={post.post_id} className="mb-4">
                    <CardHeader className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>CU</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">User {user_id}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleString()}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{post.content}</p>
                      {post.media_url && (
                        <img
                          src={post.media_url}
                          alt="Post Media"
                          className="mt-2 rounded-lg w-full h-auto"
                        />
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <p>No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedPost;
