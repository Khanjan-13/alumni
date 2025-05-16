// src/components/PostCommentDrawer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import API_URL from "../../config";
import { NavLink } from "react-router-dom";

const PostCommentDrawer = ({ postId, userId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({}); // user_id -> user details
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const fetchComments = async () => {
    if (!postId || !token) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/users/post/comments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Sort comments by created_at descending (latest first)
      const commentsData = Array.isArray(res.data.data) ? res.data.data : [];
      const sortedComments = commentsData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      console.log(sortedComments);
      setComments(sortedComments);
    } catch (err) {
      console.error(
        "Error fetching comments:",
        err.response?.data || err.message
      );
      setComments([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userMap = response.data.data.reduce((acc, user) => {
        acc[user.user_id] = {
          name: user.name,
          photo: user.photo,
        };
        return acc;
      }, {});

      setUsers(userMap);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !postId || !userId || !token) {
      console.warn("Missing required fields.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/users/post/comments`,
        {
          post_id: postId,
          user_id: userId,
          content: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      // Add the new comment to the existing comments list
      setComments((prevComments) => [res.data.data, ...prevComments]);
      setComment(""); // Clear the input after posting the comment
    } catch (err) {
      console.error(
        "Error posting comment:",
        err.response?.data || err.message
      );
    }
  };
  // Fetch comment count on mount
  useEffect(() => {
    const fetchCommentCount = async () => {
      if (!postId || !token) return;
      try {
        const res = await axios.get(
          `${API_URL}/api/users/post/comments/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const commentsData = Array.isArray(res.data.data) ? res.data.data : [];
        const sortedComments = commentsData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setComments(sortedComments);
      } catch (err) {
        console.error("Error prefetching comment count:", err);
        setComments([]);
      }
    };

    fetchCommentCount();
  }, [postId]);

  useEffect(() => {
    if (open) {
      fetchComments();
      fetchUsers();
    }
  }, [open]);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm">
          <MessageCircle className="h-4 w-4 mr-2" />
          {comments.length}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>

        <div className="space-y-4 mb-4 max-h-72 overflow-y-auto pr-2">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center italic">
              No comments yet.
            </p>
          ) : (
            comments.map((cmt, index) => {
              const createdAt = new Date(cmt.created_at);
              const formattedDate =
                createdAt instanceof Date && !isNaN(createdAt)
                  ? createdAt.toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "Invalid date";

              const user = users[cmt.user_id] || { name: "Unknown User" };

              return (
                <div
                  key={cmt.comment_id || `comment-${index}`}
                  className="flex items-start gap-3"
                >
                  {/* Avatar */}
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                      {user.name
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}

                  {/* Comment Body */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <NavLink to={`/profile/${cmt.user_id}`}>
                        <span className="font-semibold text-gray-900">
                          {user.name}
                        </span>
                      </NavLink>
                      <span className="text-gray-500 text-xs">
                        {formattedDate}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{cmt.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            onClick={handleAddComment}
            className="bg-blue-900 hover:bg-blue-700"
          >
            Post Comment
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PostCommentDrawer;
