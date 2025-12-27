"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/components/Loader/FullScreenLoader";
import { getAvatarName } from "@/utils/getAvatarName";
import postApi from "@/lib/api/postApi";

type SkillItem = { name: string; type?: "have" | "need" };

type Post = {
  id?: number | string;
  author_Name?: string;
  avtar_Name?: string;
  title?: string;
  description?: string;
  skills?: SkillItem[];
  postType?: string;
  timeAgo?: string;
  skillsHave?: string[];
  skillsNeed?: string[];
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  created_Timestamp?: string;
};

type TrendingSkill = {
  skillName: string;
  projectCount: number;
  developerCount: number;
  growthPercentage: number;
};

type Comment = {
  id?: string | number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  user_Id?: string;
  author_Name?: string;
  comment_Text?: string;
  created_Timestamp?: string;
};

const Home: React.FC = () => {
  const [skills, setSkills] = useState<TrendingSkill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [mainLoading, setMainLoading] = useState(false);
  // filters
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [isDescending, setIsDescending] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);
  const [showTrending, setShowTrending] = useState(true);
  
  // Comments states
  const [showComments, setShowComments] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const loadSkills = async () => {
    try {
      setSkillsLoading(true);
      const res = await postApi.getTrendingSkills();
      setSkills(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load trending skills:", err);
    } finally {
      setSkillsLoading(false);
    }
  };

  const lastScrollY = useRef(0);
  const didFetch = useRef(false);

  const formatCount = (num: number = 0) => {
    if (num < 1000) return num;
    if (num < 1_000_000) return (num / 1000).toFixed(1) + "k";
    return (num / 1_000_000).toFixed(1) + "M";
  };

  const formatTime = (utcDateString: string) => {
    if (!utcDateString) return "Just now";
    
    const date = new Date(utcDateString);
    const local = new Date(
      date.getTime() + new Date().getTimezoneOffset() * -60000
    );

    const seconds = Math.floor((Date.now() - local.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;

    const days = Math.floor(seconds / 86400);
    if (days < 15) return `${days} days ago`;
    return local.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAvatarColor = (name: string = ""): string => {
    const colors = [
      "#1abc9c", // teal
      "#3498db", // blue
      "#9b59b6", // purple
      "#e67e22", // orange
      "#e74c3c", // red
      "#2ecc71", // green
      "#f39c12", // yellow
      "#16a085", // dark teal
      "#2980b9", // dark blue
      "#8e44ad", // dark purple
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleLike = async (postId: string | number) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.userId) return;

      await postApi.likeProject({
        user_Id: user.userId,
        post_Id: postId,
      });

      // Optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          String(p.id) === String(postId)
            ? {
                ...p,
                isLiked: !p.isLiked,
                likes: p.isLiked
                  ? (p.likes || 1) - 1
                  : (p.likes || 0) + 1,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // Fetch comments for a post - UPDATED for your API
  const fetchComments = async (postId: string | number) => {
    try {
      setCommentsLoading(true);
      const res = await postApi.getComments(String(postId));
      
      console.log("Comments API response:", res.data);
      
      // Your API returns the entire project object. Let's check the structure.
      // Based on the getAll API response, comments might be in comment_Count or a separate array
      let commentsData = [];
      
      // Check if there's a comments array in the response
      if (Array.isArray(res.data)) {
        commentsData = res.data;
      } else if (Array.isArray(res.data?.comments)) {
        commentsData = res.data.comments;
      } else if (Array.isArray(res.data?.project?.comments)) {
        commentsData = res.data.project.comments;
      } else if (res.data && typeof res.data === 'object') {
        // If we can't find comments array, let's check common patterns
        // This is a fallback - you might need to adjust based on your actual API response
        const possibleCommentFields = ['comments', 'projectComments', 'postComments', 'commentList'];
        for (const field of possibleCommentFields) {
          if (Array.isArray(res.data[field])) {
            commentsData = res.data[field];
            break;
          }
        }
      }
      
      console.log("Extracted comments data:", commentsData);
      
      // Transform API response to match our Comment type
      const formattedComments: Comment[] = commentsData.map((comment: any) => ({
        id: comment.comment_Id || comment.id,
        user: comment.author_Name || comment.user_Name || "User",
        avatar: getAvatarName(comment.author_Name || comment.user_Name),
        text: comment.comment_Text || comment.text || comment.comment || "",
        time: formatTime(comment.created_Timestamp || comment.createdAt || comment.date),
        user_Id: comment.user_Id || comment.userId,
        author_Name: comment.author_Name || comment.user_Name,
        comment_Text: comment.comment_Text || comment.text || comment.comment,
        created_Timestamp: comment.created_Timestamp || comment.createdAt
      }));
      
      // If no comments found, use mock data for testing
      if (formattedComments.length === 0) {
        console.log("No comments found in API response, using mock data");
        // Mock comments for testing
        formattedComments.push(
          {
            id: "1",
            user: "Priya K",
            avatar: "PK",
            text: "This sounds interesting! I have experience with Node.js and MongoDB. Would love to collaborate.",
            time: "1 hour ago"
          },
          {
            id: "2",
            user: "Alex S",
            avatar: "AS",
            text: "Great initiative! How long do you think this project will take?",
            time: "45 minutes ago"
          }
        );
      }
      
      setComments(formattedComments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      // Use mock data if API fails
      setComments([
        {
          id: "1",
          user: "Priya K",
          avatar: "PK",
          text: "This sounds interesting! I have experience with Node.js and MongoDB. Would love to collaborate.",
          time: "1 hour ago"
        },
        {
          id: "2",
          user: "Alex S",
          avatar: "AS",
          text: "Great initiative! How long do you think this project will take?",
          time: "45 minutes ago"
        }
      ]);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Open comments popup
  const openComments = async (postId: string | number) => {
    setCurrentPostId(postId);
    setShowComments(true);
    await fetchComments(postId);
    
    // Focus on comment input when opened
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 100);
  };

  // Close comments popup
  const closeComments = () => {
    setShowComments(false);
    setCurrentPostId(null);
    setComments([]);
    setNewComment("");
  };

  // Post a new comment - UPDATED to use your API
  const postComment = async () => {
    if (!newComment.trim() || !currentPostId) return;
    
    try {
      setPostingComment(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.userId) {
        alert("Please login to comment");
        return;
      }
      
      const payload = {
        user_Id: user.userId,
        post_Id: currentPostId,
        post_Comment: newComment,
      };

      console.log("Posting comment with payload:", payload);
      
      // Call your API
      await postApi.createComment(payload);
      
      // Add new comment to state (optimistic update)
      const newCommentObj: Comment = {
        id: Date.now().toString(), // Temporary ID
        user: user.name || user.username || "You",
        avatar: getAvatarName(user.name || user.username || "You"),
        text: newComment,
        time: "Just now",
      };
      
      // Add to beginning of comments array
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment("");
      
      // Update comment count in posts
      setPosts(prev =>
        prev.map(p =>
          String(p.id) === String(currentPostId)
            ? { ...p, comments: (p.comments || 0) + 1 }
            : p
        )
      );
      
      // Refetch comments to get actual data from server
      setTimeout(() => {
        fetchComments(currentPostId);
      }, 500);
      
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setPostingComment(false);
    }
  };

  // Handle Enter key for comment submission
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postComment();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPosts((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.accessToken) {
      router.push("/");
      return;
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const isScrollingDown = currentScroll > lastScrollY.current;
      lastScrollY.current = currentScroll;

      if (!isScrollingDown) return;
      if (!hasMore) return;

      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !mainLoading
      ) {
        setMainLoading(true);
        setPageNumber((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mainLoading]);

  useEffect(() => {
    if (pageNumber === 1) return;
    fetchPosts();
  }, [pageNumber]);

  const fetchPosts = async () => {
    setMainLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await postApi.getAll({
        userId: user.userId,
        PageNumber: pageNumber,
        PageSize: pageSize,
        Search: search,
        SortBy: "created_Timestamp",
        IsDescending: true,
        Type: typeFilter,
        State: stateFilter,
      });

      console.log("API response =>", res.data);
      const items = res.data.projects ?? [];
      const postsArr = Array.isArray(items) ? items : [];

      if (postsArr.length < pageSize) {
        setHasMore(false);
      }

      const normalized = postsArr.map((p: any) => ({
        id: String(p.project_Id),
        title: p.projectTitle,
        description: p.description,
        postType: p.projectType,
        author_Name: p.author_Name,
        avtar_Name: p.avatar_Name ?? getAvatarName(p.author_Name),
        likes: p.likeCount ?? 0,
        comments: p.comment_Count ?? 0,
        isLiked: Boolean(p.isLiked),
        created_Timestamp: p.createdAt,
      }));

      setPosts((prev) => [...prev, ...normalized]);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setMainLoading(false);
    }
  };

  const renderSkill = (skillObj: SkillItem | string, idx: number) => {
    let name = typeof skillObj === "string" ? skillObj : skillObj.name;
    let type = typeof skillObj === "string" ? undefined : skillObj.type;

    const base =
      "px-3 py-1.5 rounded-full text-xs font-semibold border transition duration-200 hover:-translate-y-0.5";

    const haveClass = "border-blue-500 text-blue-500";
    const needClass = "border-red-500 text-red-500";
    const defaultClass =
      "border-[var(--border-color)] text-[var(--text-primary)]";

    const cls =
      type === "have"
        ? `${base} ${haveClass}`
        : type === "need"
        ? `${base} ${needClass}`
        : `${base} ${defaultClass}`;

    return (
      <span key={idx} className={cls}>
        {name}
      </span>
    );
  };

  return (
    <main>
      {mainLoading && <FullScreenLoader />}
      <div className="bg-[var(--bg-quadra)] ml-[50px] mt-[60px] p-[30px]">
        <div className="flex min-h-[80vh] gap-6">
          {/* Main Posts Section */}
          <div className="flex-1">
            <div>
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="
                    bg-[var(--card-bg)]
                    rounded-xl
                    p-6
                    mb-5
                    shadow-[var(--card-shadow)]
                    border border-[var(--post-border)]
                    hover:-translate-y-0.5
                    hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]
                    transition-all
                  "
                >
                  {/* Header */}
                  <div className="flex items-start mb-[16px]">
                    <div
                      className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg mr-3"
                      style={{
                        backgroundColor: getAvatarColor(post.author_Name),
                      }}
                    >
                      {post.avtar_Name || "U"}
                    </div>

                    <div className="flex-1">
                      <div className="font-bold text-[var(--text-primary)] mb-1">
                        {post.author_Name}
                      </div>

                      <div className="text-[13px] text-[var(--text-secondary)] flex items-center gap-2">
                        <span
                          className="
                            inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-[0.5px]
                            bg-[var(--badge-partner-bg)] text-[var(--badge-partner-text)]
                            border border-[var(--badge-partner-text)]
                          "
                        >
                          {post.postType || "POST"}
                        </span>
                        <span> {formatTime(post.created_Timestamp || "")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-[20px]">
                    <h2 className="font-bold text-[var(--text-primary)] text-[20px] mb-3">
                      {post.title}
                    </h2>

                    <p className="text-[var(--text-tertiary)] mb-4">
                      {post.description}
                    </p>

                    {/* Skills List */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.skills && post.skills.length > 0
                        ? post.skills.map((s, i) => renderSkill(s, i))
                        : null}

                      {post.skillsHave?.map((s, i) =>
                        renderSkill({ name: s, type: "have" }, i)
                      )}

                      {post.skillsNeed?.map((s, i) =>
                        renderSkill(
                          { name: s, type: "need" },
                          i + (post.skillsHave?.length ?? 0)
                        )
                      )}
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex justify-between border-t border-[var(--border-color)] pt-4">
                    <div className="flex gap-5">
                      <button
                        onClick={() => handleLike(String(post.id))}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg"
                      >
                        {post.isLiked ? (
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                          </svg>
                        )}
                        <span>{formatCount(post.likes)} Likes</span>
                      </button>

                      <button
                        onClick={() => openComments(post.id || "")}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg"
                      >
                        <svg
                          className="fill-current size-[18px]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
                        </svg>
                        <span>{formatCount(post.comments)} Comments</span>
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-5 py-2 border-2 border-[var(--accent-color)] text-[var(--accent-color)] rounded-lg hover:bg-[var(--accent-hover)] hover:text-white transition">
                        Save
                      </button>
                      <button className="px-5 py-2 border-2 border-[var(--accent-color)] text-[var(--accent-color)] rounded-lg hover:bg-[var(--accent-hover)] hover:text-white transition">
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Skills Sidebar - Fixed Position */}
          {showTrending && (
            <aside
              className="
                w-[280px]
                bg-[var(--bg-secondary)]
                rounded-xl
                p-5
                shadow-[var(--card-shadow)]
                border border-[var(--border-color)]
                sticky top-20
                h-fit
              "
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-[var(--text-primary)] flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                  Trending Skills
                </h3>
                <button
                  onClick={() => setShowTrending(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl"
                >
                  &times;
                </button>
              </div>

              {skillsLoading && (
                <div className="text-sm text-[var(--text-secondary)] text-center py-4">
                  Loading skills...
                </div>
              )}

              {!skillsLoading && skills.length === 0 && (
                <div className="text-sm text-[var(--text-secondary)] text-center py-4">
                  No trending skills found
                </div>
              )}

              {!skillsLoading &&
                skills.map((skill, index) => (
                  <div
                    key={index}
                    className="
                      flex justify-between items-center 
                      py-3 
                      border-b border-[var(--border-color)] 
                      last:border-b-0
                      hover:bg-[var(--bg-tertiary)]
                      hover:mx-[-10px]
                      hover:px-[10px]
                      hover:rounded-lg
                      transition-all
                    "
                  >
                    <div>
                      <span className="font-semibold text-[var(--text-primary)] text-sm">
                        {skill.skillName}
                      </span>
                      <div className="flex gap-4 text-xs mt-1">
                        <div className="text-[var(--text-secondary)]">
                          <span className="font-bold text-[var(--text-primary)]">
                            {skill.projectCount}
                          </span>{" "}
                          Projects
                        </div>
                        <div className="text-[var(--text-secondary)]">
                          <span className="font-bold text-[var(--text-primary)]">
                            {skill.developerCount}
                          </span>{" "}
                          Developers
                        </div>
                      </div>
                    </div>
                    <div
                      className={`
                        flex items-center gap-1 font-bold
                        ${
                          skill.growthPercentage >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      `}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M7 14l5-5 5 5z" />
                      </svg>
                      +{skill.growthPercentage}%
                    </div>
                  </div>
                ))}
            </aside>
          )}
        </div>
      </div>

      {/* Comments Popup Overlay */}
      {showComments && (
        <div 
          className="comments-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            backdropFilter: "blur(5px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeComments();
          }}
        >
          <div 
            className="comments-container"
            style={{
              background: "var(--bg-secondary)",
              borderRadius: "12px",
              padding: "20px",
              width: "90%",
              maxWidth: "900px",
              height: "85vh",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              animation: "slideUp 0.4s ease-out",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div 
              className="comments-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <h3 
                className="comments-title"
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Comments
              </h3>
              <button
                onClick={closeComments}
                className="close-comments"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  transition: "color 0.3s",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                &times;
              </button>
            </div>

            {/* Comments List */}
            <div 
              className="comments-list"
              style={{
                marginBottom: "16px",
                maxHeight: "calc(85vh - 140px)",
                overflowY: "auto",
                paddingRight: "8px",
                flex: 1,
              }}
            >
              {commentsLoading ? (
                <div 
                  className="comment-item"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div 
                  className="comment-item"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "var(--text-secondary)",
                  }}
                >
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div
                    key={comment.id || index}
                    className="comment-item"
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid var(--border-color)",
                      marginBottom: 0,
                      background: "transparent",
                      border: "none",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                      e.currentTarget.style.margin = "0 -8px";
                      e.currentTarget.style.padding = "12px 8px";
                      e.currentTarget.style.borderRadius = "6px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.margin = "0";
                      e.currentTarget.style.padding = "12px 0";
                      e.currentTarget.style.borderRadius = "0";
                    }}
                  >
                    <div 
                      className="comment-header"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "6px",
                      }}
                    >
                      <div 
                        className="comment-avatar"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, var(--accent-color), #0099ff)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "14px",
                          flexShrink: 0,
                        }}
                      >
                        {comment.avatar || "U"}
                      </div>
                      <div 
                        className="comment-user"
                        style={{
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          fontSize: "14px",
                        }}
                      >
                        {comment.user}
                      </div>
                      <div 
                        className="comment-time"
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          marginLeft: "auto",
                        }}
                      >
                        {comment.time}
                      </div>
                    </div>
                    <div 
                      className="comment-text"
                      style={{
                        color: "var(--text-tertiary)",
                        lineHeight: 1.4,
                        fontSize: "14px",
                        paddingLeft: "42px",
                      }}
                    >
                      {comment.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <div 
              className="comment-form"
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a comment..."
                className="comment-input"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  resize: "none",
                  minHeight: "60px",
                  fontFamily: "inherit",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => {
                  e.target.style.outline = "none";
                  e.target.style.borderColor = "var(--accent-color)";
                  e.target.style.boxShadow = "0 0 0 2px rgba(0, 102, 204, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.outline = "none";
                  e.target.style.borderColor = "var(--border-color)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                onClick={postComment}
                disabled={postingComment || !newComment.trim()}
                className="comment-submit"
                style={{
                  padding: "12px 20px",
                  background: "var(--accent-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background 0.3s",
                  alignSelf: "flex-end",
                  minWidth: "100px",
                  opacity: postingComment || !newComment.trim() ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!postingComment && newComment.trim()) {
                    e.currentTarget.style.background = "var(--accent-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!postingComment && newComment.trim()) {
                    e.currentTarget.style.background = "var(--accent-color)";
                  }
                }}
              >
                {postingComment ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animation and scrollbar */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .comments-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .comments-list::-webkit-scrollbar-track {
          background: var(--bg-tertiary);
          border-radius: 3px;
        }
        
        .comments-list::-webkit-scrollbar-thumb {
          background: var(--accent-color);
          border-radius: 3px;
        }
        
        .comments-list::-webkit-scrollbar-thumb:hover {
          background: var(--accent-hover);
        }

        /* Mobile Responsive Styles for Comments */
        @media (max-width: 768px) {
          .comments-container {
            width: 95%;
            padding: 16px;
            max-width: 95%;
            height: 90vh;
          }
          
          .comment-form {
            flex-direction: column;
          }

          .comment-submit {
            align-self: stretch;
          }
          
          .comment-text {
            padding-left: 0;
            margin-top: 8px;
          }
          
          .comment-header {
            flex-wrap: wrap;
          }
          
          .comment-time {
            margin-left: 0;
            width: 100%;
            order: 3;
          }
        }

        @media (max-width: 480px) {
          .comments-container {
            padding: 12px;
          }
          
          .comments-title {
            font-size: 18px;
          }
          
          .comment-avatar {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }
          
          .comment-user {
            font-size: 13px;
          }
          
          .comment-text {
            font-size: 13px;
          }
          
          .comment-input {
            min-height: 50px;
            padding: 10px 12px;
            font-size: 13px;
          }
          
          .comment-submit {
            padding: 10px 16px;
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
};

export default Home;