// import React from "react";

// /* ---------- REGISTER ---------- */

// export interface RegisterFormData {
//   full_Name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   current_Role: string;
//   bio: string;
//   userSkills: string;
// }

// export interface RegisterFormProps {
//   formData: RegisterFormData;

//   profileType: string;
//   experience: string;

//   errors: {
//     register?: string;
//     password?: string;
//   };

//   loading: boolean;

//   actions: {
//     onChange: (
//       e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => void;
//     onSubmit: (e: React.FormEvent) => void;
//     onProfileTypeChange: (type: string) => void;
//     onExperienceChange: (exp: string) => void;
//     switchToSignin: () => void;
//   };
// }

// /* ---------- LOGIN ---------- */

// export interface LoginData {
//   email: string;
//   password: string;
// }

// export interface SignInFormProps {
//   loginData: LoginData;
//   loading: boolean;
//   error?: string;

//   actions: {
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onSubmit: (e: React.FormEvent) => void;
//     switchToRegister: () => void;
//   };
// }

// /* ---------- MODAL ---------- */

// export type AuthTab = "signin" | "getstarted";

// export interface SignModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   defaultTab?: AuthTab;
// }
