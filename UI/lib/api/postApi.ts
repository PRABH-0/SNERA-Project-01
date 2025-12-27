"use client";

import API from "./api";


type LikePayload = {
  user_Id: string;
  post_Id: string | number;
};
type CommentPayload = {
  user_Id: string;
  post_Id: string | number;
  post_Comment: string;
};


const postApi = {
  /* 🔹 Get all projects */
  getAll: (data: any) => {
    return API.post("/Project/GetAllProject", data);
  },

  /* 🔹 Create project / post */
  create: (data: any) => {
    return API.post("/Project/CreatePost", data);
  },


  updateLike: (payload: LikePayload) => {
    return API.post(
      "/Project/LikeProjectPost",
      null,
      {
        params: {
          userId: payload.user_Id,
          projectId: payload.post_Id,
        },
      }
    );
  },

  getLikes: async (postId: string | number, userId: string) => {
    const res = await API.post(
      "/Project/LikeProjectPost",
      null,
      {
        params: {
          userId,
          projectId: postId,
        },
      }
    );

    return {
      data: {
        isLike: res.data?.isLike ?? false,
        postLikes: res.data?.like_Count ?? 0,
      },
    };
  },

  createComment: (payload: CommentPayload) => {
    return API.post(
      "/Project/CommentOnProject",
      null,
      {
        params: {
          userId: payload.user_Id,
          projectId: payload.post_Id,
          comment: payload.post_Comment,
        },
      }
    );
  },
  likeProject: (payload: LikePayload) => {
    return API.post(
      "/Project/LikeProjectPost",
      null, // ❌ no body
      {
        params: {
          userId: payload.user_Id,
          projectId: payload.post_Id,
        },
      }
    );
  },

 getTrendingSkills: () => {
    return API.get("/Project/GetTrendingSkills");
  },
  getComments: (projectId: string) => {
    return API.get("/Project/GetProject", {
      params: {
        projectId,
        role: "admin",
      },
    });
  },
};

export default postApi;
