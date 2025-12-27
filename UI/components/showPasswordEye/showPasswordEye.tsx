// "use client";
// import React, { useState } from "react";

// const showPasswordEye = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const handleMouseDown = () => setShowPassword(true);
//   const handleMouseUpLeave = () => setShowPassword(false);

//   return (
//     <div>
//       <button
//         type="button"
//         className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUpLeave}
//         onMouseLeave={handleMouseUpLeave}
//       >
//         {/* Closed Eye */}
//         {!showPassword && (
//           <svg
//             width="22"
//             height="22"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="var(--text-secondary)"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
//             <line x1="3" y1="3" x2="21" y2="21" />
//           </svg>
//         )}

//         {/* Open Eye */}
//         {showPassword && (
//           <svg
//             width="22"
//             height="22"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="var(--text-primary)"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
//             <circle cx="12" cy="12" r="3" />
//           </svg>
//         )}
//       </button>
//     </div>
//   );
// };

// export default showPasswordEye;
