import { toast } from "sonner";

export const successMessage = (message) => {
  return toast.success(message, {
    style: {
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    iconTheme: {
      primary: "#155724",
      secondary: "#d4edda",
    },
    position: "top-center",
  });
};

export const errorMessage = (message) => {
  return toast.error(message, {
    style: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    iconTheme: {
      primary: "#721c24",
      secondary: "#f8d7da",
    },
    position: "top-center",
  });
};
