"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/components/Loader/FullScreenLoader";
import postApi from "@/lib/api/postApi";

type ProjectType =
  | ""
  | "learning"
  | "practice"
  | "portfolio"
  | "open-source"
  | "client"
  | "freelance"
  | "other";

type experienceLevel =
  | ""
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

type TeamSize =
  | ""
  | "1"
  | "2-3"
  | "4-6"
  | "7+";

type TimeCommitment =
  | ""
  | "5-10"
  | "10-20"
  | "20-30"
  | "30+"
  | "flexible";

type ProjectStatus = "" | "planning" | "development" | "testing";

type ProjectVisibility = "" | "public" | "private" | "team";

interface ProjectForm {
  project_Title: string;
  project_Description: string;
  project_Type: ProjectType;
  team_Name: string;
  budget: string;
  project_Timeline: TimeCommitment;
  team_Size: TeamSize;
  experience_Level: experienceLevel;
  start_Date: string;
  end_Date: string;
  project_Status: ProjectStatus;
  project_Visibility: ProjectVisibility;
  link: string[];
  user_Skills: { skill_Name: string; skill_Type: string }[];
}

const CreatePost: React.FC = () => {
  const [form, setForm] = useState<ProjectForm>({
    project_Title: "",
    project_Description: "",
    project_Type: "",
    team_Name: "",
    budget: "",
    project_Timeline: "",
    team_Size: "",
    experience_Level: "",
    start_Date: "",
    end_Date: "",
    project_Status: "",
    project_Visibility: "",
    link: [""],
    user_Skills: []
  });


  const [skillsHave, setSkillsHave] = useState<string[]>([]);
  const [skillsNeed, setSkillsNeed] = useState<string[]>([]);
  const [skillHaveInput, setSkillHaveInput] = useState("");
  const [skillNeedInput, setSkillNeedInput] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [resourceInput, setResourceInput] = useState("");
  const [resources, setResources] = useState<string[]>([]);

  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("");
  const [projectVisibility, setProjectVisibility] =
    useState<ProjectVisibility>("");
  const AddResource = () => {
    const url = resourceInput.trim();
    if (!url) return;
    if (resources.includes(url)) return;
    setResources((prev) => [...prev, url]);
    setResourceInput("");
  };

  const RemoveResource = (url: string) => {
    setResources((prev) => prev.filter((r) => r !== url));
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch { }
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const addSkillHave = () => {
    if (skillHaveInput.trim() !== "") {
      setSkillsHave([...skillsHave, skillHaveInput.trim()]);
      setSkillHaveInput("");
    }
  };

  const addSkillNeed = () => {
    if (skillNeedInput.trim() !== "") {
      setSkillsNeed([...skillsNeed, skillNeedInput.trim()]);
      setSkillNeedInput("");
    }
  };

  const removeSkillHave = (index: number) => {
    setSkillsHave(skillsHave.filter((_, i) => i !== index));
  };

  const removeSkillNeed = (index: number) => {
    setSkillsNeed(skillsNeed.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      user_Id: user?.userId ?? null,
      post: form.project_Title,
      project_Title: form.project_Title,
      project_Description: form.project_Description,
      project_Type: form.project_Type,

      team_Name: form.team_Name,
      budget: String(form.budget || "0"),

      project_Timeline: form.project_Timeline,


      team_Size: Number(form.team_Size.replace(/[^0-9]/g, "")) || 0,
      experience_Level: form.experience_Level,

      start_Date: form.start_Date,
      end_Date: form.end_Date,

      project_Status: projectStatus,
      project_Visibility: projectVisibility,


      link: resources,


      user_Skills: [
        ...skillsHave.map((s) => ({ skill_Name: s, skill_Type: "have" })),
        ...skillsNeed.map((s) => ({ skill_Name: s, skill_Type: "need" }))
      ]
    };

    setLoading(true);
    try {

      await postApi.createProject(payload);
    // console.log("hit create APi");      
      setLoading(false);
      setShowSuccessPopup(true);
    } catch (err: any) {
      setLoading(false);
      console.error("Create post error:", err);
    }

  };
  const showPreview =
    form.project_Title.trim().length > 0 ||
    form.project_Description.trim().length > 0 ||
    skillsHave.length > 0 ||
    skillsNeed.length > 0 ||
    resources.length > 0;

  const getProjectTypeBadgeClasses = () => {
    switch (form.project_Type) {
      case "learning":
        return "bg-green-50 text-green-700 border border-green-500";
      case "practice":
        return "bg-amber-50 text-amber-700 border border-amber-500";
      case "portfolio":
        return "bg-sky-50 text-sky-700 border border-sky-500";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-400";
    }
  };

  const projectTypeLabel = () => {
    switch (form.project_Type) {
      case "learning":
        return "Learning Project";
      case "practice":
        return "Practice Project";
      case "portfolio":
        return "Portfolio Project";
      case "open-source":
        return "Open Source";
      case "client":
        return "Client Project";
      case "freelance":
        return "Freelance Work";
      case "other":
        return "Other";
      default:
        return "Project Type";
    }
  };

  return (<>
    {loading && <FullScreenLoader />}
    <main className="ml-[50px] mt-[56px] p-6 min-h-[calc(100vh-56px)]">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-bold text-[28px] text-[var(--text-primary)] leading-[1.3]">
            Create New Post
          </h1>
          <p className="text-[16px] text-[var(--text-secondary)]">
            Share your project, find collaborators, or showcase your work
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="
        bg-[var(--card-bg)]  shadow-[var(--card-shadow)]
        border border-[var(--post-border)] mb-[30px] rounded-xl p-[30px]
      ">

        {/* --- POST TYPE SECTION --- */}
        <div className="mb-[30px] pb-[20px] border-b border-[var(--border-color)]">
          <h2 className="text-[20px] font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
            <svg className="w-6 h-6 fill-[var(--accent-color)] rounded-sm "><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>
            Post Details
          </h2>
          <div className=" grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[14px] text-[var(--text-primary)]">
                Project Title<span className="text-red-500"> *</span>
              </label>
              <input
                id="project_Title"
                value={form.project_Title}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)] rounded-lg placeholder:text-[var(--text-tertiary)]"
                placeholder="e.g., E-commerce Platform Development"
              />
            </div>
            <div>
              <label className="font-semibold text-[14px] text-[var(--text-primary)]">
                Post type<span className="text-red-500"> *</span>
              </label>

              <select
                id="project_Type"
                value={form.project_Type}
                onChange={handleChange}
                required
                className="
              w-full mt-2 p-3 bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)]
              rounded-lg text-[var(--text-primary)]
            "
              >
                <option value="">Select type</option>
                <option value="learning">Learning Project</option>
                <option value="practice">Practice Project</option>
                <option value="portfolio">Portfolio Project</option>
                <option value="open-source">Open Source</option>
                <option value="client">Client Project</option>
                <option value="freelance">Freelance Work</option>
                <option value="other">Other</option>

              </select>
            </div>
          </div>
          <div className="text-[12px] mt-2.5">Make it descriptive and specific</div>
          <label className="font-semibold mt-4 block text-[14px] text-[var(--text-primary)]">Project
            Description<span className="text-red-500"> *</span>
          </label>
          <textarea
            id="project_Description"
            value={form.project_Description}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)] rounded-lg min-h-[120px] placeholder:text-[var(--text-tertiary)]"
            placeholder="Describe your project goals, scope, and what you aim to achieve..."
          ></textarea>
          <div className="text-[12px] my-2.5">Include the purpose, main features, and learning objectives</div>
          <div className=" grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[14px] text-[var(--text-primary)]">
                Team Name<span className="text-red-500"> *</span>
              </label>
              <input
                id="team_Name"
                value={form.team_Name}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)] rounded-lg placeholder:text-[var(--text-tertiary)]"
                placeholder="e.g., Web Dev Warriors"
              />
            </div>
            <div>
              <label className="font-semibold text-[14px] text-[var(--text-primary)]">
                Experience Level<span className="text-red-500"> *</span>
              </label>

              <select
                id="experience_Level"
                value={form.experience_Level}
                onChange={handleChange}
                required
                className="
              w-full mt-2 p-3 bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)]
              rounded-lg text-[var(--text-primary)]
            "
              >
                <option value="">Select experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
          <div className="text-[12px] mt-2.5">What will your team be called?</div>
        </div>


        {/* --- SKILLS SECTION --- */}
        <div className="mb-[30px] pb-[20px] border-b border-[var(--border-color)]">
          <h2 className="text-[20px] font-semibold mb-4 text-[var(--text-primary)] flex                 items-center      gap-2">
            <svg className="w-6 h-6 fill-[var(--accent-color)]">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Technology Stack & Skills
          </h2>

          {/* Skills Have */}
          <label className="font-semibold text-[14px]">Skills I Have</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {skillsHave.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-[var(--skill-have)] border border-[var(--accent-color)] text-sm font-semibold"
              >
                {skill}
                <button
                  className="ml-2 text-gray-400"
                  onClick={() => removeSkillHave(index)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              value={skillHaveInput}
              onChange={(e) => setSkillHaveInput(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg placeholder:text-[var(--text-tertiary)]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkillHave();
                }
              }}
            />
            <button
              type="button"
              onClick={addSkillHave}
              className="px-4 py-2 bg-[var(--accent-color)] text-[var(--button-text)] hover:bg-[var(--accent-hover)] hover:-translate-y-1 transition rounded-lg"
            >
              Add
            </button>
          </div>

          {/* Skills Need */}
          <label className="font-semibold text-[14px] mt-6 block">Skills I Need</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {skillsNeed.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-[var(--skill-need)] border border-red-500 text-sm font-semibold"
              >
                {skill}
                <button
                  className="ml-2 text-gray-400"
                  onClick={() => removeSkillNeed(index)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              value={skillNeedInput}
              onChange={(e) => setSkillNeedInput(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg placeholder:text-[var(--text-tertiary)]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkillNeed();
                }
              }}
            />
            <button
              type="button"
              onClick={addSkillNeed}
              className="px-4 py-2 bg-[var(--accent-color)] text-[var(--button-text)] hover:bg-[var(--accent-hover)] hover:-translate-y-1 transition rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
        {/* Timeline */}
        <div className="mb-[30px] pb-[20px] border-b border-[var(--border-color)]">
          <h2 className="text-[20px] font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
            <svg className="w-6 h-6 fill-[var(--accent-color)] rounded-sm "><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
            Timeline
          </h2>
          <div className=" grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[14px] text-[var(--text-primary)]">
                Start Date<span className="text-red-500"> *</span>
              </label>
              <input
                id="start_Date"
                value={form.start_Date}
                type="date"
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)] rounded-lg placeholder:text-[var(--text-tertiary)]"
                placeholder="e.g., Web Dev Warriors"
              />
            </div>
            <div>
              <label className="font-semibold text-[14px] text-[var(--text-primary)]">
                End Date (Optional)
              </label>

              <input
                id="end_Date"
                value={form.end_Date}
                type="date"
                onChange={handleChange}
                required
                className="
              w-full mt-2 p-3 bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)]
              rounded-lg text-[var(--text-primary)]
            "
              >

              </input>
              <div className="text-[12px] mt-2.5">Leave empty for ongoing projects</div>
            </div>
          </div>
        </div>

        {/* Team and collabration */}
        <div className="mb-[30px] pb-[20px] border-b border-[var(--border-color)]">
          <h2 className="text-[20px] font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
            <svg className="w-6 h-6 fill-[var(--accent-color)] rounded-sm "><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
            Team & Collaboration
          </h2>
          <div className=" grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[14px] text-[var(--text-primary)]">
                Team Size Needed<span className="text-red-500"> *</span>
              </label>

              <select
                id="team_Size"
                value={form.team_Size}
                onChange={handleChange}
                required
                className="
              w-full mt-2 p-3 bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)]
              rounded-lg text-[var(--text-primary)]
            "
              >
                <option value="">Select size</option>
                <option value="1">Solo Project</option>
                <option value="2-3">Small (2-3 people)</option>
                <option value="4-6">Medium (4-6 people)</option>
                <option value="7+">Large (7+ people)</option>
              </select>
            </div>
            <div className="pb-7">
              <label className="font-semibold text-[14px] text-[var(--text-primary)]">
                Time Commitment<span className="text-red-500"> *</span>
              </label>

              <select
                id="project_Timeline"
                value={form.project_Timeline}
                onChange={handleChange}
                required
                className="
              w-full mt-2 p-3 bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)]
              rounded-lg text-[var(--text-primary)]
            "
              >
                <option value="">Select commitment</option>
                <option value="5-10">5-10 hours/week</option>
                <option value="10-20">10-20 hours/week</option>
                <option value="20-30">20-30 hours/week</option>
                <option value="30+">30+ hours/week</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>


        {/* --- Resources & Additional Info --- */}
        <div className="form-section   pb-[35px] border-b border-[var(--border-color)]">
          <h2 className="mb-4 flex items-center gap-2 text-[20px] font-semibold text-[var(--text-primary)]">
            <svg
              className="h-5 w-5 fill-[var(--accent-color)]"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            Resources & Additional Info
          </h2>

          {/* Resource Links */}
          <div className="mb-5 flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--text-primary)]">
              Resource Links
            </label>
            <div className="mb-2 flex gap-3">
              <input
                type="url"
                className="flex-1 rounded-md px-3 py-2 text-sm border border-[var(--border-color)] bg-[var(--bg-tertiary)]  text-[var(--text-primary)] 
                                placeholder:text-[var(--text-tertiary)]   transition   focus:ring-1 border-2 border-[var(--border-color)]"
                id="resourceUrl"
                placeholder="https://github.com/your-project"
                value={resourceInput}
                onChange={(e) => setResourceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    AddResource();
                  }
                }}
              />
              <button
                type="button"
                className="0 px-4 py-2 text-sm font-semibold  bg-[var(--accent-color)] text-[var(--button-text)] rounded-lg flex items-center gap-2 hover:bg-[var(--accent-hover)] hover:-translate-y-1 transition"
                id="addResourceBtn"
                onClick={AddResource}
              >
                Add
              </button>
            </div>
            <div className="max-h-[200px] space-y-2 overflow-y-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)]   p-3">
              {resources.length === 0 && (
                <div className="text-xs text-[var(--text-primary)] py-1 ">
                  No resources added yet.
                </div>
              )}
              {resources.map((url) => (
                <div
                  key={url}
                  className="flex items-center justify-between rounded-md bg-[var(--bg-tertiary)] px-3 text-sm"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-blue-600 hover:underline"
                  >
                    {url}
                  </a>
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs font-semibold text-red-600 hover:bg-[var(--accent-hover)]"
                    onClick={() => RemoveResource(url)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="text-[12px] mt-2.5">
              Add GitHub repository, Figma designs, documentation, etc.
            </div>
          </div>

          {/* Project Status */}
          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--text-primary)]">
              Project Status
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 ">
              {[
                { value: "planning", label: "Planning Phase" },
                { value: "development", label: "In Development" },
                { value: "testing", label: "Testing Phase" },
              ].map((status) => {
                const isSelected = projectStatus === status.value;
                return (
                  <label
                    key={status.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-4 py-3 text-sm transition ${isSelected
                      ? "border-blue-600 "
                      : "border-transparent "
                      }`}
                    onClick={() =>
                      setProjectStatus(status.value as ProjectStatus)
                    }
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${isSelected
                        ? "border-blue-600 bg-blue-600"
                        : "border-[var(--accent-color)]"
                        }`}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{status.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Project Visibility */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--text-primary)]">
              Project Visibility
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { value: "public", label: "Public (Anyone can view)" },
                { value: "private", label: "Private (Invite only)" },
                { value: "team", label: "Team Only" },
              ].map((vis) => {
                const isSelected = projectVisibility === vis.value;
                return (
                  <label
                    key={vis.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-4 py-3 text-sm transition ${isSelected
                      ? "border-blue-600    "
                      : "border-transparent "
                      }`}
                    onClick={() =>
                      setProjectVisibility(vis.value as ProjectVisibility)
                    }
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${isSelected
                        ? "border-blue-600 bg-blue-600"
                        : "border-[var(--accent-color)]"
                        }`}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{vis.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 border-t pt-6 border-[var(--border-color)]">
          <button type="button"
            onClick={() => setShowCancelPopup(true)}
            className="px-6 py-3 bg-[var(--accent-color)] text-[var(--button-text)] rounded-lg flex items-center gap-2 hover:bg-[var(--accent-hover)] hover:-translate-y-1 transition">
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-[var(--accent-color)] text-[var(--button-text)] rounded-lg flex items-center gap-2 hover:bg-[var(--accent-hover)] hover:-translate-y-1 transition"
          >
            <svg width="22" height="22" fill="currentColor"><path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>
            Create Post
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="mb-8 rounded-xl bg-[var(--card-bg)]  shadow-[var(--card-shadow)]
        border border-[var(--post-border)] p-8  ">
        <h2 className="mb-5 flex items-center gap-2 text-[20px] font-semibold text-[var(--text-primary)]">
          <svg
            className="h-5 w-5 fill-[var(--accent-color)]"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          Project Preview
        </h2>

        <div className="rounded-lg bg-[var(--card-bg)]  shadow-[var(--card-shadow)]
        border border-[var(--post-border)] p-5">
          {!showPreview ? (
            <div className="py-10 text-center text-sm text-[var(--text-primary)]">
              Your project preview will appear here as you fill out the form
            </div>
          ) : (
            <div>
              {/* Preview Header */}
              <div className="mb-5 flex items-start justify-between gap-4 ">
                <div>
                  <h3 className="mb-1 text-2xl font-bold text-[var(--text-primary)]">
                    {form.project_Title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-primary)]">
                    {form.team_Name && (
                      <span className="rounded-full   px-3 py-1 font-medium text-[var(--text-primary)">
                        Team: {form.team_Name}
                      </span>
                    )}
                    {form.start_Date && (
                      <span className="rounded-full  px-3 py-1 font-medium text-[var(--text-primary)">
                        Start: {form.start_Date}
                      </span>
                    )}
                    {form.end_Date && (
                      <span className="rounded-full  px-3 py-1 font-medium text-[var(--text-primary)">
                        End: {form.end_Date}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${getProjectTypeBadgeClasses()}`}
                  >
                    {projectTypeLabel()}
                  </span>
                  {form.experience_Level && (
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-primary)">
                      {form.experience_Level}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-5 text-sm leading-relaxed text-[var(--text-primary)">
                {form.project_Description}
              </div>

              {/* Skills */}
              <div className="my-4 space-y-4">
                <div>
                  <div className="mb-2 text-sm font-semibold text-[var(--text-primary)">
                    Skills We Have
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsHave.length === 0 ? (
                      <span className="text-xs text-[var(--text-primary)">
                        Not specified.
                      </span>
                    ) : (
                      skillsHave.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-semibold text-[var(--text-primary)">
                    Skills We Need
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsNeed.length === 0 ? (
                      <span className="text-xs text-slate-400">
                        Not specified.
                      </span>
                    ) : (
                      skillsNeed.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="mt-5 grid gap-4 rounded-lg bg-[var(--card-bg)] shadow-[--card-shadow] border border-[var(--post-border)]  p-5 text-xs text-[var(--text-primary) md:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-primary)">
                    Team Size
                  </span>
                  <span className="text-sm font-medium">
                    {form.team_Size}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-primary)">
                    Time Commitment
                  </span>
                  <span className="text-sm font-medium">
                    {form.project_Timeline
                      ? `${form.project_Timeline} hrs/week`.replace("flexible hrs/week", "Flexible")
                      : "Not specified"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-primary)">
                    Status / Visibility
                  </span>
                  <span className="text-sm font-medium">
                    {(projectStatus &&
                      projectStatus[0].toUpperCase() +
                      projectStatus.slice(1)) ||
                      "Status N/A"}
                    {" • "}
                    {(projectVisibility &&
                      projectVisibility[0].toUpperCase() +
                      projectVisibility.slice(1)) ||
                      "Visibility N/A"}
                  </span>
                </div>
              </div>

              {/* Resources Summary */}
              {resources.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-sm font-semibold text-[var(--text-primary)">
                    Resources
                  </div>
                  <ul className="space-y-1 text-xs">
                    {resources.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showCancelPopup && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-lg w-[350px] text-center">

            <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">Leave this page?</h2>
            <p className="text-[var(--text-primary)] mb-6">
              Are you sure you want to discard this post and go back?
            </p>

            <div className="flex justify-center gap-4">
              {/* No button */}
              <button
                onClick={() => setShowCancelPopup(false)}
                className="px-6 py-3 bg-[var(--accent-color)] text-[var(--button-text)] rounded-lg flex items-center gap-2 hover:bg-[var(--accent-hover)] hover:-translate-y-1 transition"
              >
                No
              </button>

              {/* Yes button */}
              <button
                onClick={() => router.push("/")}
                className="  bg-red-500 px-6 py-3  text-[var(--button-text)] rounded-lg flex items-center gap-2   hover:-translate-y-1 transition"
              >
                Yes
              </button>
            </div>

          </div>
        </div>
      )}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-lg w-[350px] text-center">

            <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">Post Created!</h2>
            <p className="text-[var(--text-primary)] mb-6">
              Your post has been successfully created.
            </p>

            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-green-600 text-[var(--button-text)] rounded-lg  hover:-translate-y-1 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}


    </main>
  </>
  );
};

export default CreatePost;