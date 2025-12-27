"use client";

import API from "./api";

type CreateCommentPayload = {
  userId: string;
  projectId: string | number;
  comment: string;
};

const postApi = {
  // 🔹 Get all projects
  getAll: (data: any) => {
    return API.post("/Project/GetAllProject", data);
  },

  // 🔹 Create post
  create: (data: any) => {
    return API.post("/Project/CreatePost", data);
  },

  // 🔹 Like / Unlike project
  updateLike: (userId: string, projectId: string) => {
    return API.post(
      "/Project/LikeProjectPost",
      null,
      {
        params: { userId, projectId },
      }
    );
  },

  // 🔹 Create comment
  createComment: ({ userId, projectId, comment }: CreateCommentPayload) => {
    return API.post(
      "/Project/CommentOnProject",
      null,
      {
        params: { userId, projectId, comment },
      }
    );
  },

  // 🔹 Get project with comments
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
