 "use client";
   import React from "react"; 

type RegisterProps = {
  formData: {
    full_Name: string;
    email: string;
    password: string;
    confirmPassword: string;
    current_Role: string;
    bio: string;
    userSkills: string;
  };
  profileType: string;
  setProfileType: (s: string) => void;
  experience: string;
  setExperience: (s: string) => void;
  onRegisterSubmit: (e: React.FormEvent) => Promise<void> | void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  switchToSignin: () => void;
  error?: string
  error2?: string
  loading: boolean;
};

const RegisterForm: React.FC<RegisterProps> = ({
  formData,
  profileType,
  setProfileType,
  experience,
  setExperience,
  onRegisterSubmit,
  onChange,
  switchToSignin,
  error,
  error2,
  loading
}) => {
  return (
     <div className={`${loading ? "pointer-events-none opacity-40" : ""}`}> 

      <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] my-8 mt-0">
        Join SNERA Community
      </h2>

      <form onSubmit={onRegisterSubmit}>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 w-full">
          <div>
            <label className="block text-sm font-medium">Full Name *</label>
            <input
              type="text"
              name="full_Name"
              value={formData.full_Name}
              onChange={onChange}
              placeholder="Enter your full name"
              className={`mt-1 w-full border border-[var(--border-line)] placeholder:text-[var(--text-tertiary)]  bg-[var(--input-bg)] rounded-md px-3 py-2 focus:border-[var(--border-color)] ${error ? "border-red-500" : " "} `}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="Enter your email"
              className={`mt-1 w-full border border-[var(--border-line)] placeholder:text-[var(--text-tertiary)]  bg-[var(--input-bg)] rounded-md px-3 py-2 focus:border-[var(--border-color)] ${error ? "border-red-500" : " "} `}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Create a strong password"
              className={`mt-1 w-full rounded-md px-3 py-2 border border-[var(--border-line)] placeholder:text-[var(--text-tertiary)]  bg-[var(--input-bg)]  focus:border-[var(--border-color)]  ${error2 ? "border-red-500" : " "} ${error ? "border-red-500" : " "} `}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onChange}
              placeholder="Confirm your password"
              className={`mt-1 w-full border border-[var(--border-line)] placeholder:text-[var(--text-tertiary)]  bg-[var(--input-bg)]  focus:border-[var(--border-color)] rounded-md px-3 py-2 ${error2 ? "border-red-500" : " "} ${error ? "border-red-500" : " "} `}
              required
            />
          </div>
        </div>

        {/* Profile Type */}
        <div>
          <p className="font-medium mb-2">Profile Type</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { key: "student", label: "Student/Fresher" },
              { key: "professional", label: "Professional" },
              { key: "business", label: "Business Owner" },
            ].map((type) => (
              <button
                type="button"
                key={type.key}
                onClick={() => setProfileType(type.key)}
                className={`border rounded-md py-3 font-medium ${profileType === type.key ? "bg-black text-white" : "bg-white text-black border-gray-300"
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experience + Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div>
            <label className="block text-sm font-medium">Current Role/Title</label>
            <input
              type="text"
              name="current_Role"
              value={formData.current_Role}
              onChange={onChange}
              placeholder="e.g., Frontend Developer"
              className="mt-1 w-full   rounded-md px-3 py-2 border border-[var(--border-line)] placeholder:text-[var(--text-tertiary)]  bg-[var(--input-bg)]  focus:border-[var(--border-color)] "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <div className="flex flex-wrap gap-2">
              {["0-1 years", "1-3 years", "3-5 years", "5+ years"].map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setExperience(exp)}
                  className={`px-4 py-2 rounded-md border ${experience === exp ? "bg-black text-white" : "bg-white text-black border-gray-300"
                    }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-10">
          <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
          <input
            type="text"
            name="userSkills"
            value={formData.userSkills}
            onChange={onChange}
            placeholder="e.g., React, Node.js, SQL"
            className="w-full  rounded-md p-3 border border-[var(--border-line)] placeholder:text-[var(--text-tertiary)]  bg-[var(--input-bg)]  focus:border-[var(--border-color)] "
          />
        </div>

        {/* Bio */}
        <div >
          <label className="block text-sm font-medium mb-2">Bio/Introduction</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={onChange}
            rows={4}
            placeholder="Tell us about yourself..."
            className="w-full rounded-md p-3 border border-[var(--border-line)] placeholder:text-[var(--text-tertiary)]  bg-[var(--input-bg)]  focus:border-[var(--border-color)] "
          ></textarea>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-3 bg-red-100 border-l-4 border-red-500 p-2 rounded">
            {error}
          </p>
        )}
        {error2 && (
          <p className="text-red-500 text-sm mt-3 bg-red-100 border-l-4 border-red-500 p-2 rounded">
            {error2}
          </p>
        )}

        <button
          type="submit"
          className="w-full px-4 py-3 bg-[var(--accent-color)] text-[var(--button-text)] text-base rounded-md font-semibold mt-10 transition-all duration-300 ease-in-out hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_var(--shadow-color)]"
        >
          Create Account & Join Community
        </button>
         
        <div className=" border-t border-[var(--border-color)] mt-10 text-center flex items-center justify-center">
          <p className="text-center text-sm mr-1 mt-10 text-[var(--text-secondary)]">
            Already have an account?{" "}
            <button
              onClick={switchToSignin}
              className="text-[var(--accent-color)] font-bold underline cursor-pointer"
            >
              Sign in here
            </button>

          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
