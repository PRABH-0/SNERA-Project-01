"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/components/Loader/FullScreenLoader";
import postApi from "@/lib/api/postApi";
import { getAvatarName } from "@/utils/getAvatarName";

type UserType = "student" | "professional" | "business-owner";
type ExperienceLevel = "0-1 years" | "1-3 years" | "3-5 years" | "5+ years";
type ProjectType =
  | "web-apps"
  | "saas"
  | "open-source"
  | "client"
  | "mobile"
  | "startups"
  | "enterprise"
  | "ecommerce"
  | "social"
  | "data-viz"
  | "ai-ml"
  | "iot"
  | "blockchain"
  | "gaming";

interface UserProfile {
  name: string;
  title: string;
  userType: UserType;
  experienceLevel: ExperienceLevel;
  bio: string;
  location: string;
  experience: string;
  availability: string;
  preferredRole: string;
  education: string;
  joinDate: string;
  email: string;
  github: string;
  linkedin: string;
  skillsHave: string[];
  skillsNeed: string[];
  projectTypes: string[];
  stats: {
    projects: number;
    connections: number;
    years: number;
  };
  projects: Array<{
    id: number;
    name: string;
    description: string;
    status: "active" | "completed";
    skills: string[];
  }>;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "projects">(
    "overview"
  );
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("");

  const [profile, setProfile] = useState<UserProfile>({
    name: "John Smith",
    title: "Frontend Developer & UI Designer",
    userType: "professional",
    experienceLevel: "3-5 years",
    bio: "Passionate frontend developer with 3 years of experience creating beautiful and functional user interfaces. I specialize in React and modern JavaScript ecosystems, with a strong focus on user experience and accessibility. Currently looking to collaborate on innovative web applications and expand my skills into full-stack development. Open to mentorship opportunities and excited to work on projects that make a positive impact.",
    location: "San Francisco, CA",
    experience: "3 years",
    availability: "15-20 hrs/week",
    preferredRole: "Frontend Lead",
    education: "Bachelor's Degree",
    joinDate: "March 2023",
    email: "john.smith@email.com",
    github: "github.com/johnsmith",
    linkedin: "linkedin.com/in/johnsmith",
    skillsHave: [
      "React",
      "JavaScript",
      "TypeScript",
      "HTML/CSS",
      "UI/UX",
      "Figma",
      "Git",
      "Responsive",
    ],
    skillsNeed: ["Node.js", "Backend", "Database", "DevOps", "AWS"],
    projectTypes: ["Web Applications", "SaaS Products", "Open Source Projects"],
    stats: {
      projects: 12,
      connections: 47,
      years: 3,
    },
    projects: [
      {
        id: 1,
        name: "TaskSync App",
        description: "Collaborative task management with real-time updates",
        status: "active",
        skills: ["React", "Firebase", "Real-time"],
      },
      {
        id: 2,
        name: "Portfolio Builder",
        description: "Drag-and-drop portfolio website builder",
        status: "completed",
        skills: ["Vue.js", "Node.js", "MongoDB"],
      },
      {
        id: 3,
        name: "LearnCode Platform",
        description: "Interactive coding tutorials with live editing",
        status: "completed",
        skills: ["React", "Express", "PostgreSQL"],
      },
      {
        id: 4,
        name: "E-commerce Dashboard",
        description: "Analytics dashboard for online stores",
        status: "completed",
        skills: ["React", "D3.js", "REST API"],
      },
    ],
  });
  const openEditProfile = () => {
    setEditForm({
      name: profile.name,
      title: profile.title,
      userType: profile.userType,
      experienceLevel: profile.experienceLevel,
    });

    setShowEditProfileModal(true);
  };

  // Form states for editing
  const [editForm, setEditForm] = useState({
    name: "",
    title: "",
    userType: "professional" as UserType,
    experienceLevel: "3-5 years" as ExperienceLevel,
  });

  const [skillsHaveInput, setSkillsHaveInput] = useState("");
  const [skillsNeedInput, setSkillsNeedInput] = useState("");
  const [editSkillsHave, setEditSkillsHave] = useState<string[]>([]);
const [editSkillsNeed, setEditSkillsNeed] = useState<string[]>([]);

  const [editBio, setEditBio] = useState("");
  const [editProjectTypes, setEditProjectTypes] = useState<string[]>([]);
  const [editProjectTypeInput, setEditProjectTypeInput] = useState(""); // NEW: for project type input
  const [editDetails, setEditDetails] = useState({
    location: "",
    experience: "",
    availability: "",
    preferredRole: "",
    education: "",
    joinDate: "",
    email: "",
    github: "",
    linkedin: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const raw = localStorage.getItem("user");
        if (!raw) return;

        const userObj = JSON.parse(raw);
        setUser(userObj);

        const res = await postApi.getUserProfile(userObj.userId);
        setProfile(mapApiProfileToUI(res.data));
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleOpenSectionModal = (section: string) => {
    setCurrentSection(section);

    // Initialize form data based on section
    switch (section) {
      case "skills":
  setEditSkillsHave([...profile.skillsHave]);
  setEditSkillsNeed([...profile.skillsNeed]);
  break;

      case "bio":
        setEditBio(profile.bio);
        break;
      case "preferences":
        setEditProjectTypes(profile.projectTypes);
        setEditProjectTypeInput(""); // Reset input
        break;
      case "details":
        setEditDetails({
          location: profile.location,
          experience: profile.experience,
          availability: profile.availability,
          preferredRole: profile.preferredRole,
          education: profile.education,
          joinDate: profile.joinDate,
          email: profile.email,
          github: profile.github,
          linkedin: profile.linkedin,
        });
        break;
    }

    setShowEditSectionModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      if (!user?.userId) return;

      setLoading(true);

     const payload = {
      name: editForm.name,
      title: editForm.title,
      profileType: editForm.userType as UserType,
      experienceLevel: editForm.experienceLevel as ExperienceLevel,
    };
 await postApi.updateUserProfile(payload);
      const res = await postApi.getUserProfile(user.userId);
      setProfile(mapApiProfileToUI(res.data));

      setShowEditProfileModal(false);
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      setLoading(false);
    }
  };

  const mapApiProfileToUI = (data: any): UserProfile => ({
    name: data.name ?? "",
    title: data.title ?? "",
    userType: data.profileType ?? "professional",
    experienceLevel: data.experienceLevel ?? "0-1 years",
    bio: data.bio ?? "",

    location: data.location ?? "",
    experience: data.experienceLevel ?? "",
    availability: data.availability ?? "",
    preferredRole: data.preferredRole ?? "",
    education: data.education ?? "",

    joinDate: new Date(data.joinDate).toLocaleDateString(),
    email: data.email ?? "",
    github: data.gitHub ?? "",
    linkedin: data.linkedIn ?? "",

    skillsHave: data.skillsHave ?? [],
    skillsNeed: data.skillsNeed ?? [],

    projectTypes: data.projectTypes ?? [],

    stats: {
      projects: data.projectsCount ?? 0,
      connections: data.connectionsCount ?? 0,
      years: data.yearsOfExperience ?? 0,
    },

    projects: data.projects ?? [],
  });

 const handleSaveSection = async () => {
  try {
    if (!user?.userId) return;
    setLoading(true);

    const payload: any = {};

    if (currentSection === "skills") {
      payload.skillsHave = editSkillsHave;
      payload.skillsNeed = editSkillsNeed;
    }

    if (currentSection === "bio") {
      payload.bio = editBio;
    }

    if (currentSection === "preferences") {
      payload.projectTypes = editProjectTypes;
    }

    if (currentSection === "details") {
      payload.location = editDetails.location;
      payload.availability = editDetails.availability;
      payload.preferredRole = editDetails.preferredRole;
      payload.education = editDetails.education;
      payload.email = editDetails.email;
      payload.gitHub = editDetails.github;
      payload.linkedIn = editDetails.linkedin;
    }

    if (Object.keys(payload).length === 0) return;

    await postApi.updateUserProfile(payload);

    const res = await postApi.getUserProfile(user.userId);
    setProfile(mapApiProfileToUI(res.data));

    setShowEditSectionModal(false);
  } catch (err) {
    console.error("Section update failed", err);
  } finally {
    setLoading(false);
  }
};


  // Add project type function
  const addProjectType = () => {
    if (
      editProjectTypeInput.trim() &&
      !editProjectTypes.includes(editProjectTypeInput.trim())
    ) {
      setEditProjectTypes((prev) => [...prev, editProjectTypeInput.trim()]);
      setEditProjectTypeInput("");
    }
  };

  // Remove project type function
  const removeProjectType = (type: string) => {
    setEditProjectTypes((prev) => prev.filter((t) => t !== type));
  };

 const addSkillHave = () => {
  if (
    skillsHaveInput.trim() &&
    !editSkillsHave.includes(skillsHaveInput.trim())
  ) {
    setEditSkillsHave(prev => [...prev, skillsHaveInput.trim()]);
    setSkillsHaveInput("");
  }
};


  const addSkillNeed = () => {
  if (
    skillsNeedInput.trim() &&
    !editSkillsNeed.includes(skillsNeedInput.trim())
  ) {
    setEditSkillsNeed(prev => [...prev, skillsNeedInput.trim()]);
    setSkillsNeedInput("");
  }
};

  

 const removeSkillHave = (skill: string) => {
  setEditSkillsHave(prev => prev.filter(s => s !== skill));
};

 const removeSkillNeed = (skill: string) => {
  setEditSkillsNeed(prev => prev.filter(s => s !== skill));
};


  // Get label for project type (if it's a known type, use the label, otherwise use the value)
  const getProjectTypeLabel = (type: string) => {
    const projectTypeLabels: Record<string, string> = {
      "web-apps": "Web Applications",
      saas: "SaaS Products",
      "open-source": "Open Source",
      client: "Client Projects",
      mobile: "Mobile Apps",
      startups: "Startups",
      enterprise: "Enterprise Software",
      ecommerce: "E-commerce",
      social: "Social Platforms",
      "data-viz": "Data Visualization",
      "ai-ml": "AI/ML Projects",
      iot: "IoT Projects",
      blockchain: "Blockchain",
      gaming: "Gaming",
    };

    return projectTypeLabels[type] || type;
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <main className="ml-[50px] mt-[56px] p-6 min-h-[calc(100vh-56px)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-bold text-[28px] text-[var(--text-primary)] leading-[1.3]">
              My Profile
            </h1>
          </div>
        </div>

        {/* Profile Container */}
        <div className="bg-[var(--card-bg)] rounded-xl shadow-[var(--card-shadow)] border border-[var(--border-color)] mb-6 overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-br from-[var(--navbar-bg)] to-[var(--bg-tertiary)] p-8">
            <div className="absolute top-0 left-0 right-0 h-[120px] bg-[var(--navbar-bg)]"></div>
            <div className="relative z-10 flex items-end gap-6">
              <div className="w-[120px] h-[120px] rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[36px] font-semibold text-[var(--text-secondary)] border-4 border-[var(--card-bg)] shadow-lg">
                {getAvatarName(profile.name)}
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-[28px] font-bold mb-2">{profile.name}</h1>
                <p className="text-[16px] text-[var(--text-secondary)] mb-4">
                  {profile.title}
                </p>
                <div className="inline-block bg-[var(--badge-partner-text)] text-white px-3 py-1 rounded-full text-[12px] font-medium mr-2 mb-2">
                  Professional
                </div>
                <div className="inline-block bg-[rgba(0,102,204,0.1)] text-[var(--accent-color)] px-3 py-1 rounded-full text-[12px] font-medium mb-2">
                  {profile.experienceLevel}
                </div>
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-[20px] font-semibold">
                      {profile.stats.projects}
                    </div>
                    <div className="text-[14px] text-[var(--text-secondary)]">
                      Projects
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[20px] font-semibold">
                      {profile.stats.connections}
                    </div>
                    <div className="text-[14px] text-[var(--text-secondary)]">
                      Connections
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[20px] font-semibold">
                      {profile.stats.years}
                    </div>
                    <div className="text-[14px] text-[var(--text-secondary)]">
                      Years
                    </div>
                  </div>
                </div>
              </div>
              <div className="pb-2">
                <button
                  onClick={openEditProfile}
                  className="bg-[var(--badge-partner-text)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--accent-hover)] hover:-translate-y-[2px] transition-all"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="flex border-b border-[var(--border-color)]">
            <button
              className={`px-5 py-3 font-medium text-[14px] border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-[var(--text-primary)] text-[var(--text-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-5 py-3 font-medium text-[14px] border-b-2 transition-colors ${
                activeTab === "projects"
                  ? "border-[var(--text-primary)] text-[var(--text-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" ? (
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Skills Section */}
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-5 border border-[var(--border-color)]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[16px] font-semibold">Skills</h3>
                      <button
                        onClick={() => handleOpenSectionModal("skills")}
                        className="text-[13px] text-[var(--accent-color)] font-medium hover:text-[var(--accent-hover)] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-[13px] text-[var(--text-secondary)] font-medium mb-2">
                      Skills I Have
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.skillsHave.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-[var(--badge-partner-text)] text-white px-3 py-1.5 rounded-full text-[12px] font-medium hover:-translate-y-[1px] transition-transform cursor-pointer"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="text-[13px] text-[var(--text-secondary)] font-medium mb-2">
                      Skills I Need
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skillsNeed.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-[#cc3300] text-white px-3 py-1.5 rounded-full text-[12px] font-medium hover:-translate-y-[1px] transition-transform cursor-pointer"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-5 border border-[var(--border-color)]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[16px] font-semibold">About Me</h3>
                      <button
                        onClick={() => handleOpenSectionModal("bio")}
                        className="text-[13px] text-[var(--accent-color)] font-medium hover:text-[var(--accent-hover)] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <p
                      className={`text-[14px] text-[var(--text-tertiary)] leading-relaxed ${
                        isBioExpanded ? "" : "max-h-[120px] overflow-hidden"
                      }`}
                    >
                      {profile.bio}
                    </p>
                    <button
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                      className="text-[13px] text-[var(--accent-color)] mt-2 hover:text-[var(--accent-hover)] transition-colors"
                    >
                      {isBioExpanded ? "Read less" : "Read more"}
                    </button>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Preferences Section */}
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-5 border border-[var(--border-color)]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[16px] font-semibold">
                        Project Preferences
                      </h3>
                      <button
                        onClick={() => handleOpenSectionModal("preferences")}
                        className="text-[13px] text-[var(--accent-color)] font-medium hover:text-[var(--accent-hover)] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-[13px] text-[var(--text-secondary)] font-medium mb-2">
                      Project Types
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.projectTypes.map((type, index) => (
                        <span
                          key={index}
                          className="bg-[#4CAF50] text-white px-3 py-1.5 rounded-full text-[12px] font-medium hover:-translate-y-[1px] transition-transform cursor-pointer"
                        >
                          {getProjectTypeLabel(type)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="bg-[var(--bg-tertiary)] rounded-lg p-5 border border-[var(--border-color)]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[16px] font-semibold">Details</h3>
                      <button
                        onClick={() => handleOpenSectionModal("details")}
                        className="text-[13px] text-[var(--accent-color)] font-medium hover:text-[var(--accent-hover)] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-[12px] text-[var(--text-secondary)] font-medium mb-1">
                          Location
                        </div>
                        <div className="text-[14px] font-medium">
                          {profile.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] text-[var(--text-secondary)] font-medium mb-1">
                          Experience
                        </div>
                        <div className="text-[14px] font-medium">
                          {profile.experience}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] text-[var(--text-secondary)] font-medium mb-1">
                          Availability
                        </div>
                        <div className="text-[14px] font-medium">
                          {profile.availability}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] text-[var(--text-secondary)] font-medium mb-1">
                          Preferred Role
                        </div>
                        <div className="text-[14px] font-medium">
                          {profile.preferredRole}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] text-[var(--text-secondary)] font-medium mb-1">
                          Education
                        </div>
                        <div className="text-[14px] font-medium">
                          {profile.education}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] text-[var(--text-secondary)] font-medium mb-1">
                          Joined
                        </div>
                        <div className="text-[14px] font-medium">
                          {profile.joinDate}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-2 text-[13px] text-[var(--accent-color)] hover:text-[var(--accent-hover)] transition-colors"
                      >
                        <svg
                          className="w-4 h-4 fill-[var(--accent-color)]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        {profile.email}
                      </a>
                      <a
                        href={`https://${profile.github}`}
                        className="flex items-center gap-2 text-[13px] text-[var(--accent-color)] hover:text-[var(--accent-hover)] transition-colors"
                      >
                        <svg
                          className="w-4 h-4 fill-[var(--accent-color)]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        {profile.github}
                      </a>
                      <a
                        href={`https://${profile.linkedin}`}
                        className="flex items-center gap-2 text-[13px] text-[var(--accent-color)] hover:text-[var(--accent-hover)] transition-colors"
                      >
                        <svg
                          className="w-4 h-4 fill-[var(--accent-color)]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        {profile.linkedin}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Projects Tab */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[var(--card-bg)] rounded-lg p-4 text-center border border-[var(--border-color)]">
                    <div className="text-[24px] font-bold mb-1">24</div>
                    <div className="text-[12px] text-[var(--text-secondary)]">
                      Total Projects
                    </div>
                  </div>
                  <div className="bg-[var(--card-bg)] rounded-lg p-4 text-center border border-[var(--border-color)]">
                    <div className="text-[24px] font-bold mb-1">89%</div>
                    <div className="text-[12px] text-[var(--text-secondary)]">
                      Completion Rate
                    </div>
                  </div>
                  <div className="bg-[var(--card-bg)] rounded-lg p-4 text-center border border-[var(--border-color)]">
                    <div className="text-[24px] font-bold mb-1">6</div>
                    <div className="text-[12px] text-[var(--text-secondary)]">
                      Active Collaborations
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--bg-tertiary)] rounded-lg p-5 border border-[var(--border-color)]">
                  <h3 className="text-[16px] font-semibold mb-4">
                    All Projects
                  </h3>
                  <div className="space-y-3">
                    {profile.projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-[var(--card-bg)] rounded-lg p-4 border border-[var(--border-color)] hover:-translate-y-[2px] transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded bg-[var(--bg-tertiary)] flex items-center justify-center text-[12px] font-semibold text-[var(--text-secondary)]">
                            {project.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="text-[14px] font-semibold mb-1">
                              {project.name}
                            </div>
                            <p className="text-[12px] text-[var(--text-tertiary)] mb-2 leading-relaxed">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-[11px] px-2 py-1 rounded-full ${
                                  project.status === "active"
                                    ? "bg-[#e7f4e4] text-[#2d8515]"
                                    : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                                }`}
                              >
                                {project.status === "active"
                                  ? "Active"
                                  : "Completed"}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {project.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="bg-[rgba(0,102,204,0.1)] text-[var(--accent-color)] text-[10px] px-2 py-1 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] rounded-xl w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="absolute top-5 right-5 text-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              &times;
            </button>
            <h2 className="text-[20px] font-semibold mb-5">Edit Profile</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold mb-2">
                    Current Role/Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold mb-2">
                    Profile Type
                  </label>
                  <div className="flex gap-2">
                    {(
                      [
                        "student",
                        "professional",
                        "business-owner",
                      ] as UserType[]
                    ).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`flex-1 p-3 rounded-lg border ${
                          editForm.userType === type
                            ? "border-[var(--badge-partner-text)] bg-[var(--badge-partner-text)] text-white"
                            : "border-[var(--border-color)] bg-[var(--bg-tertiary)]"
                        }`}
                        onClick={() =>
                          setEditForm({ ...editForm, userType: type })
                        }
                      >
                        {type === "student"
                          ? "Student/Fresher"
                          : type === "professional"
                          ? "Professional"
                          : "Business Owner"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-semibold mb-2">
                    Experience Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        "0-1 years",
                        "1-3 years",
                        "3-5 years",
                        "5+ years",
                      ] as ExperienceLevel[]
                    ).map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={`p-3 rounded-lg border ${
                          editForm.experienceLevel === level
                            ? "border-[var(--badge-partner-text)] bg-[var(--badge-partner-text)] text-white"
                            : "border-[var(--border-color)] bg-[var(--bg-tertiary)]"
                        }`}
                        onClick={() =>
                          setEditForm({ ...editForm, experienceLevel: level })
                        }
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(false)}
                    className="flex-1 p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg font-semibold hover:bg-[var(--border-color)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                     
                    type="submit"
                    className="flex-1 p-3 bg-[var(--badge-partner-text)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {showEditSectionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] rounded-xl w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowEditSectionModal(false)}
              className="absolute top-5 right-5 text-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              &times;
            </button>
            <h2 className="text-[20px] font-semibold mb-5">
              Edit{" "}
              {currentSection === "skills"
                ? "Skills"
                : currentSection === "bio"
                ? "About Me"
                : currentSection === "preferences"
                ? "Project Preferences"
                : "Details"}
            </h2>

            <div className="space-y-6">
              {currentSection === "skills" && (
                <div>
                  <div className="mb-4">
                    <label className="block text-[14px] font-semibold mb-2">
                      Skills I Have
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 min-h-[60px] border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)]">
                      {editSkillsHave.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-[var(--badge-partner-text)] text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkillHave(skill)}
                            className="text-white hover:text-gray-200"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        className="flex-1 min-w-[100px] bg-transparent outline-none"
                        placeholder="Type a skill and press Enter"
                        value={skillsHaveInput}
                        onChange={(e) => setSkillsHaveInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkillHave();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-[14px] font-semibold mb-2">
                      Skills I Need
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 min-h-[60px] border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)]">
                      {editSkillsNeed.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-[#cc3300] text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkillNeed(skill)}
                            className="text-white hover:text-gray-200"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        className="flex-1 min-w-[100px] bg-transparent outline-none"
                        placeholder="Type a skill and press Enter"
                        value={skillsNeedInput}
                        onChange={(e) => setSkillsNeedInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkillNeed();
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentSection === "bio" && (
                <div>
                  <label className="block text-[14px] font-semibold mb-2">
                    About Me
                  </label>
                  <textarea
                    className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg min-h-[100px]"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                  />
                </div>
              )}

              {currentSection === "preferences" && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-[14px] font-semibold mb-3">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z" />
                      </svg>
                      Project Types
                    </div>
                    <div className="flex flex-wrap gap-2 p-3 min-h-[60px] border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)]">
                      {editProjectTypes.map((type, index) => (
                        <div
                          key={index}
                          className="bg-[#4CAF50] text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-2"
                        >
                          {getProjectTypeLabel(type)}
                          <button
                            type="button"
                            onClick={() => removeProjectType(type)}
                            className="text-white hover:text-gray-200"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          className="flex-1 min-w-[100px] bg-transparent outline-none"
                          placeholder="Type a project type"
                          value={editProjectTypeInput}
                          onChange={(e) =>
                            setEditProjectTypeInput(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addProjectType();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={addProjectType}
                          className="bg-[#4CAF50] text-white px-3 py-1.5 rounded-lg text-[12px] font-medium hover:bg-[#45a049]"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <p className="text-[12px] text-[var(--text-secondary)] mt-2">
                      Type a project type and press Enter or click Add
                    </p>
                  </div>
                </div>
              )}

              {currentSection === "details" && (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-[12px] font-semibold mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                        value={editDetails.location}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold mb-1">
                        Experience
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                        value={editDetails.experience}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            experience: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold mb-1">
                        Availability
                      </label>
                      <select
                        className="w-full p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                        value={editDetails.availability}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            availability: e.target.value,
                          })
                        }
                      >
                        <option value="5-10 hours/week">5-10 hours/week</option>
                        <option value="10-20 hours/week">10-20 hours/week</option>
                        <option value="20+ hours/week">20+ hours/week</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold mb-1">
                        Preferred Role
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                        value={editDetails.preferredRole}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            preferredRole: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold mb-1">
                        Education
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                        value={editDetails.education}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            education: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold mb-1">
                        Joined
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                        value={editDetails.joinDate}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            joinDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                    <div>
                      <label className="block text-[12px] font-semibold mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                        value={editDetails.email}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                        value={editDetails.github}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            github: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg"
                        value={editDetails.linkedin}
                        onChange={(e) =>
                          setEditDetails({
                            ...editDetails,
                            linkedin: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEditSectionModal(false)}
                  className="flex-1 p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg font-semibold hover:bg-[var(--border-color)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSection}
                  className="flex-1 p-3 bg-[var(--badge-partner-text)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
