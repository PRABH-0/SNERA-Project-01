"use client";

import { useState } from "react";
type Task = {
  id: number;
  title: string;
  due: string;
  assignee: string | null;
  initials: string | null;
  status: "complete" | "in-progress" | "pending";
};

export default function ProjectPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Create Project Wireframes",
      due: "Oct 15",
      assignee: "Priya Kumar",
      initials: "PK",
      status: "complete",
    },
    {
      id: 2,
      title: "Develop Product Listing Component",
      due: "Oct 22",
      assignee: "Rahul Sharma",
      initials: "RS",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Implement User Authentication",
      due: "Oct 25",
      assignee: "Alex Smith",
      initials: "AS",
      status: "in-progress",
    },
    {
      id: 4,
      title: "Design Shopping Cart UI",
      due: "Oct 28",
      assignee: "Unassigned",
      initials: "",
      status: "pending",
    },
    {
      id: 5,
      title: "Set Up Payment Integration",
      due: "Nov 5",
      assignee: "Unassigned",
      initials: "",
      status: "pending",
    },
  ]);


  const completed = tasks.filter((t) => t.status === "complete").length;
  const progress = Math.round((completed / tasks.length) * 100);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "complete" ? "pending" : "complete" }
          : t,
      ),
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };
   const toggleTask2 = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                t.status === "complete" ? "in-progress" : "complete",
            }
          : t
      )
    );
  };

  const deleteTask2 = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="ml-[50px] mt-[56px] p-6 min-h-[calc(100vh-56px)]  text-[var(--text-primary)]">
      <div className="flex justify-between items-start space-y-8 ">
        {/* HEADER */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold ">
            E-commerce Platform Development
          </h1>
          <div className="flex gap-4 mt-2 text-md items-center text-[var(--text-primary)]">
            <span className="px-2 py-1 rounded border border-[var(--success-color)] bg-[var(--success-bg)] text-[var(--success-color)] text-xs font-bold">
              ACTIVE
            </span>
            <span>• Web Dev Warriors Team</span>
            <span>• Started 2 weeks ago</span>
            <span className="bg-gradient-to-r from-green-500 to-lime-400 text-white px-2 py-1 rounded text-xs font-bold">
              Learning Project
            </span>
          </div>
        </div>

        <div className="flex gap-3  items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            fill="#ffffff"
            stroke="none"
            className="fill-[var(--icon-color)] hover:fill-[var(--icon-hover)] hover:bg-[var(--bg-tertiary)]   size-8.5      py-2 cursor-pointer rounded-md transition-all duration-300"
          >
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          <button className="px-4.5  py-2 bg-[var(--accent-color)] text-white text-sm font-semibold rounded-md ">
            Join Team
          </button>
        </div>
      </div>
      <div className="flex gap-6 items-start">
        {/* LEFT SECTION */}
        <div className="flex-1 space-y-6 w-[60vw]">
          {/* DESCRIPTION CARD */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow">
            <div className="flex justify-between  border-b border-[var(--border-color)] ">
              <h2 className="text-lg font-bold pb-3 mb-">
                Project Description
              </h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="2"
                fill="#ffffff"
                stroke="none"
                className="fill-[var(--icon-color)] hover:fill-[var(--icon-hover)] hover:bg-[var(--bg-tertiary)]   size-6 py-1 cursor-pointer rounded-md transition-all duration-300"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </div>

            <p className="text-[var(--text-tertiary)] mt-2 mb-4">
              This is a learning project focused on building a full-stack
              e-commerce platform...
            </p>

            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "MongoDB", "JavaScript", "Express"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full border border-[var(--accent-color)] bg-[var(--skill-have)] text-xs"
                  >
                    {skill}
                  </span>
                ),
              )}

              {["UI/UX Design", "Payment Integration"].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full border border-red-500 bg-[var(--skill-need)] text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* TASKS */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow">
            <h2 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex justify-between">
              Current Tasks
              <button className="bg-[var(--accent-color)] text-white px-3 py-1 rounded text-xs">
                Add Task
              </button>
            </h2>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-l-4 
                    ${
                      task.status === "complete"
                        ? "border-green-500"
                        : task.status === "in-progress"
                          ? "border-blue-500"
                          : "border-gray-400"
                    }`}
                >
                  <div
                    onClick={() => toggleTask(task.id)}
                    className="w-5 h-5 border border-[var(--border-color)] rounded cursor-pointer flex items-center justify-center"
                  >
                    {task.status === "complete" && "✓"}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Due: {task.due} • {task.assignee}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-[var(--delete-color)] text-white px-2 py-1 text-xs rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TIMELINE */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow">
            <h2 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4">
              Project Timeline
            </h2>

            <div className="pl-6 border-l border-[var(--border-color)] space-y-6">
              {[
                { week: "Week 1-2", title: "Planning", status: "complete" },
                { week: "Week 3-4", title: "Frontend", status: "in-progress" },
                { week: "Week 5-6", title: "Backend", status: "pending" },
              ].map((item) => (
                <div key={item.week} className="relative">
                  <div
                    className={`absolute -left-8 top-1 w-3 h-3 rounded-full 
                    ${
                      item.status === "complete"
                        ? "bg-green-500"
                        : item.status === "in-progress"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                    }`}
                  />

                  <p className="text-xs text-[var(--text-secondary)]">
                    {item.week}
                  </p>
                  <p className="font-semibold">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[30vw] space-y-6">
          {/* INFO CARD */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] ">
              <h2 className="text-lg font-bold mb-3">Project Information</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="2"
                fill="#ffffff"
                stroke="none"
                className="fill-[var(--icon-color)] hover:fill-[var(--icon-hover)] hover:bg-[var(--bg-tertiary)]   size-6 py-1 cursor-pointer rounded-md transition-all duration-300"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-3">
              <div>
                <p className="text-[var(--text-secondary)] t text-[12px] font-semibold ">
                  Project Type
                </p>
                <p className="font-semibold">Learning</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-[12px] font-semibold ">
                  Focus Area
                </p>
                <p className="font-semibold">Full Stack</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-[12px] font-semibold ">
                  Start Date
                </p>
                <p className="font-semibold">Oct 1, 2023</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-[12px] font-semibold ">
                  End Date
                </p>
                <p className="font-semibold">Nov 26, 2023</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-[12px] font-semibold ">
                  Team Size
                </p>
                <p className="font-semibold">3 Members</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-[12px] font-semibold ">
                  Difficulty level
                </p>
                <p className="font-semibold">Intermediate</p>
              </div>
            </div>
          </div>
          {/* teams members */}

          <div
            className="p-6 rounded-xl border shadow-md
             bg-[var(--card-bg)] border-[var(--border-color)] shadow-[var(--card-shadow)]"
          >
            <h2
              className="text-lg font-bold mb-4 pb-3 border-b flex justify-between items-center
             text-[var(--text-primary)] border-[var(--border-color)]"
            >
              Team Members
            </h2>

            <div className="flex flex-col gap-3">
              {/* <!-- Member 1 --> */}
              <div className="relative flex items-center gap-3 p-3 rounded-lg min-h-[64px] bg-[var(--bg-tertiary)]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white
                   bg-gradient-to-r from-[var(--accent-color)] to-[#0099ff]"
                >
                  RS
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-[var(--text-primary)]">
                    Rahul Sharma
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Frontend Developer
                  </div>
                </div>

                <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded font-semibold bg-[var(--admin-badge-bg)] text-[var(--admin-badge-color)]">
                  Admin
                </div>

                <div className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded bg-[var(--success-bg)] text-[var(--success-color)]">
                  Active
                </div>
              </div>

              {/* <!-- Member 2 --> */}
              <div
                className="relative flex items-center gap-3 p-3 rounded-lg min-h-[64px]
       bg-[var(--bg-tertiary)]"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white bg-gradient-to-r from-[var(--accent-color)] to-[#0099ff]">
                  PK
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-[var(--text-primary)]">
                    Priya Kumar
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    UI/UX Designer
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded bg-[var(--success-bg)] text-[var(--success-color)]">
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow">
            <h2 className="text-lg font-bold mb-3">Progress Tracking</h2>

            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="bg-[var(--bg-tertiary)] p-3 rounded">
                <p className="text-xl font-bold">{progress}%</p>
                <p className="text-xs text-[var(--text-secondary)]">Overall</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-3 rounded">
                <p className="text-xl font-bold">
                  {completed}/{tasks.length}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Tasks</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-3 rounded">
                <p className="text-xl font-bold">4</p>
                <p className="text-xs text-[var(--text-secondary)]">Members</p>
              </div>
            </div>

            <div className="w-full bg-[var(--border-color)] h-2 rounded">
              <div
                className="h-2 bg-[var(--progress-in-progress)] rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {/* Developer requests */}
          <div 
  className="p-6 rounded-xl border shadow-md animate-[fadeInUp_0.5s_ease-out]
  bg-[var(--card-bg)] border-[var(--border-color)] shadow-[var(--card-shadow)]"
>
  <h2 
    className="text-lg font-bold mb-4 pb-3 border-b flex justify-between items-center
    text-[var(--text-primary)] border-[var(--border-color)]"
  >
    Developer Requests
  </h2>

  <div className  ="flex flex-col gap-3">

    {/* <!-- Request 1 --> */}
    <div 
      className="relative flex items-center gap-3 p-3 rounded-lg min-h-[64px] bg-[var(--bg-tertiary)]"
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white
        bg-gradient-to-br from-[var(--accent-color)] to-[#0099ff]"
      >
        AK
      </div>

      <div className="flex-1">
        <div className="font-semibold text-[var(--text-primary)]">
          Amit Kumar
        </div>
        <div className="text-xs text-[var(--text-secondary)]">
          React, Node.js, MongoDB
        </div>
      </div>

      <div className="absolute bottom-2 right-2 grid gap-2">
        <button 
          className="text-[11px] font-semibold px-2 py-0.5 rounded transition-all bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] cursor-pointer"
           
        >
          View
        </button>

        <button 
          className="text-[11px] font-semibold px-2 py-0.5 rounded transition-all bg-[#d32f2f] text-white hover:bg-[#b71c1c] cursor-pointer"
          
        >
          Reject
        </button>
      </div>
    </div>

    {/* <!-- Request 2 --> */}
    <div 
      className="relative flex items-center gap-3 p-3 rounded-lg min-h-[64px] bg-[var(--bg-tertiary)]"
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white
         bg-gradient-to-br from-[var(--accent-color)] to-[#0099ff]"
      >
        SD
      </div>

      <div className="flex-1">
        <div className="font-semibold text-[var(--text-primary)]">
          Sneha Desai
        </div>
        <div className="text-xs text-[var(--text-secondary)]  ">
          UI/UX Design, Figma, Adobe XD
        </div>
      </div>

      <div className="absolute bottom-2 right-2 grid gap-2">
        <button 
          className="text-[11px] font-semibold px-2 py-1 rounded transition-all bg-[var(--accent-color)] text-white"
        >
          View
        </button>

        <button 
          className="text-[11px] font-semibold px-2 py-1 rounded transition-all bg-[#d32f2f] text-white"
        >
          Reject
        </button>
      </div>
    </div>

    {/* <!-- Request 3 --> */}
    <div 
      className="relative flex items-center gap-3 p-3 rounded-lg min-h-[64px] bg-[var(--bg-tertiary)]"
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white
         bg-gradient-to-br from-[var(--accent-color)] to-[#0099ff]"
      >
        VP
      </div>

      <div className="flex-1">
        <div className="font-semibold text-[var(--text-primary)]">
          Vikram Patel
        </div>
        <div className="text-xs text-[var(--text-secondary)]">
          Payment Integration, Stripe, PayPal
        </div>
      </div>

      <div className="absolute bottom-2 right-2 grid gap-2">
        <button 
          className="text-[11px] font-semibold px-2 py-1 rounded transition-all bg-[var(--accent-color)] text-white"
        >
          View
        </button>

        <button 
          className="text-[11px] font-semibold px-2 py-1 rounded transition-all bg-[#d32f2f] text-white"
           
        >
          Reject
        </button>
      </div>
    </div>

  </div>
</div>

        </div>
      </div>
    </main>
  );
}
