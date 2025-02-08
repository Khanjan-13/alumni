import React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Share2, ImageIcon, Send, Pencil } from "lucide-react";
import { NavLink } from "react-router-dom";
function Feed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        role: "Software Engineer at Tech Corp",
      },
      content:
        "Excited to share that I've just completed a major project milestone! 🎉 #Achievement #Programming",
      image: "/bvm.jpg",
      likes: 42,
      comments: [
        {
          author: "Alex Chen",
          content: "Congratulations! That's amazing work! 👏",
        },
        {
          author: "Maria Garcia",
          content: "Well deserved success! Keep it up!",
        },
      ],
      timestamp: "2h ago",
      isLiked: false,
    },
    {
      id: 2,
      author: {
        name: "David Wilson",
        avatar: "/placeholder.svg",
        role: "Alumni Class of 2020",
      },
      content:
        "Great alumni meetup yesterday! It was wonderful catching up with everyone from the batch. Looking forward to the next one! 🎓",
      likes: 28,
      comments: [
        {
          author: "James Lee",
          content: "It was great seeing you there!",
        },
      ],
      timestamp: "5h ago",
      isLiked: false,
    },
  ]);

  const [newPost, setNewPost] = useState("");

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handlePost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: posts.length + 1,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg",
        role: "Alumni",
      },
      content: newPost,
      likes: 0,
      comments: [],
      timestamp: "Just now",
      isLiked: false,
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl mt-24">
        {/* Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="text-blue-600">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-900">{post.author.name}</div>
                    <div className="text-sm text-gray-500">
                      {post.author.role}
                    </div>
                    <div className="text-xs text-gray-500">
                      {post.timestamp}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{post.content}</p>
                {post.image && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <img
                      src={post.image}
                      alt="Post image"
                      className="object-cover w-full h-auto"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col">
                <div className="flex items-center gap-4 w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={post.isLiked ? "text-blue-600" : ""}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        post.isLiked ? "fill-current" : ""
                      }`}
                    />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {post.comments.length}
                  </Button>
                  {/* <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button> */}
                </div>

                {post.comments.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="w-full space-y-4">
                      {post.comments.map((comment, index) => (
                        <div key={index} className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{comment.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 rounded-lg bg-gray-50 p-2">
                            <div className="font-semibold text-sm">
                              {comment.author}
                            </div>
                            <div className="text-sm text-gray-600">
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}

          <div className="fixed bottom-6 right-6">
            <NavLink to="/feed-post" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-4 py-2 rounded-full">
              <Pencil className="h-5 w-5" />
              Add Post
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
