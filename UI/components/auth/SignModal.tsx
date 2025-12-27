 "use client";
 import React, { useState, useEffect  } from "react"; 
import SignInForm from "../auth/SignInForm";
import RegisterForm from "../auth/RegisterForm"; 
import FullScreenLoader from "../Loader/FullScreenLoader"; 
import { useRouter } from "next/navigation";
 import userApi from "@/lib/api/userApi";

interface SignProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: "signin" | "getstarted";
}

const Sign: React.FC<SignProps> = ({ isOpen, onClose, defaultTab = "signin" }) => {
    const [activeTab, setActiveTab] = useState<"signin" | "getstarted">(defaultTab);
    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [loginError, setLoginError] = useState("");

    const [registerError, setRegisterError] = useState("");
    const [passwordError, setPasswordError] = useState("")

    const [profileType, setProfileType] = useState("student");
    const [experience, setExperience] = useState("0-1 years");
    const [formData, setFormData] = useState({
        full_Name: "",
        email: "",
        password: "",
        confirmPassword: "",
        current_Role: "",
        bio: "",
        userSkills: "",
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setActiveTab(defaultTab);
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen, defaultTab]);
    useEffect(() => {
        if (loading) {
            document.body.style.overflow = "hidden";
        } else if (!isOpen) {
            document.body.style.overflow = "auto";
        }
    }, [loading, isOpen]);


     const router = useRouter();

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).id === "overlay") onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (registerError) setRegisterError("");
        if (passwordError) setPasswordError("");
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
        if (loginError) setLoginError("");
    };



    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setRegisterError("");
        setPasswordError("");

        if (!formData.full_Name.trim())
            return setRegisterError("Full name is required"), setLoading(false);

        if (!formData.email.trim())
            return setRegisterError("Email is required"), setLoading(false);

        if (!formData.password.trim())
            return setRegisterError("Password is required"), setLoading(false);

        if (formData.password.length < 6)
        return setRegisterError("Password must be at least 6 characters"), setLoading(false);

        if (formData.password !== formData.confirmPassword)
            return setPasswordError("Passwords do not match!"), setLoading(false);

        try {
            const payload = {
                full_Name: formData.full_Name,
                email: formData.email,
                password: formData.password,
                profile_Type: profileType,
                current_Role: formData.current_Role,
                experience,
                bio: formData.bio,
                userSkills: formData.userSkills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((s) => s.length > 0),
            };

            await userApi.register(payload); 
            setTimeout(() => {
                setActiveTab("signin");
                setLoading(false);
            }, 800);
        } catch (err: any) {
            console.error("❌ Registration failed:", err);
            setRegisterError("Registration failed! Please check your details.")
        }
        finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLoginError("");
        try {
            const res = await userApi.login(loginData); 

            const token =
                res.data.accessToken ||
                res.data.token ||
                res.data.jwt ||
                res.data.jwtToken ||
                res.data.data?.token;
                 if (!token) {
      console.error("❌ No token found in login API response");
      return;
    }
            if (token) {
                localStorage.setItem("token", token);
                const userObj = {
                    userName: res.data.userName  || "",
                    email: res.data.userEmail ||   loginData.email,
                    userId: res.data.userId ,
                    accessToken: token
                };
                 localStorage.setItem("user", JSON.stringify(userObj)); 
                router.push("/Home");

            }
        } catch (err: any) {
            setLoginError("Invalid email or password!");
        }
        finally {
            setLoading(false);
        }
    };
    if (!isOpen) return null;

    return (<>
        {loading && <FullScreenLoader />}

        <div
            id="overlay"
            onClick={handleOverlayClick}
            className="fixed inset-0 flex justify-center items-start pt-10 bg-[var(--overlay-bg)] backdrop-blur-[5px] z-50 overflow-auto"
        >
            <div 
            
            className={`bg-[var(--bg-primary)] p-8 rounded-xl shadow-lg w-[80vw] h-[550px] relative overflow-auto backdrop-blur-[5px]  ${loading ? "pointer-events-none" : ""} `}>


                <button
                    onClick={onClose}
                    className="cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-3xl absolute top-4 right-6"
                >
                    &times;
                </button>

                <div className="flex w-full mb-4 mt-4">
                    <div className="flex w-full">
                        <button
                            onClick={() => setActiveTab("signin")}
                            className={`w-full flex justify-center text-xl font-semibold ${activeTab === "signin" ? "text-[var(--accent-color)]" : "text-[var(--text-secondary)]"
                                }`}
                        >
                            Sign In
                        </button>

                        <button
                            onClick={() => setActiveTab("getstarted")}
                            className={`w-full flex justify-center text-xl font-semibold ${activeTab === "getstarted" ? "text-[var(--accent-color)]" : "text-[var(--text-secondary)]"
                                }`}
                        >
                            Get Started
                        </button>
                    </div>
                </div>

                <div className="flex justify-center w-full m-auto mb-6">
                    <div
                        className={`h-0.5 w-1/2 transition-all duration-300 ${activeTab === "signin" ? "bg-[var(--accent-color)] translate-x-[-50%]" : "bg-[var(--accent-color)] translate-x-[50%]"
                            }`}
                    />
                </div>

                {activeTab === "signin" ? (
                    <SignInForm
                        loginData={loginData}
                        onLoginChange={handleLoginChange}
                        onLoginSubmit={handleLoginSubmit}
                        switchToRegister={() => setActiveTab("getstarted")}
                        error={loginError}
                    />
                ) : (
                    <RegisterForm
                        formData={formData}
                        profileType={profileType}
                        setProfileType={setProfileType}
                        experience={experience}
                        setExperience={setExperience}
                        onRegisterSubmit={handleRegisterSubmit}
                        onChange={handleChange}
                        switchToSignin={() => setActiveTab("signin")}
                        error={registerError}
                        error2={passwordError}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    </>
    );
};

export default Sign;
