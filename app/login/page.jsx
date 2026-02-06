"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser } from "@/lib/auth";
import { FaEye } from "react-icons/fa";
import { GiEyelashes } from "react-icons/gi";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const success = await loginUser(values.email, values.password);

        if (success) {
          toast.success("✨ Login successful! Welcome back.", { duration: 2000 });
          router.push("/dashboard");
        } else {
          toast.error("❌ Login failed. Please check your credentials and try again.", { duration: 3000 });
        }
      } catch (error) {
        const message = error.message || "Something went wrong. Please try again.";
        toast.error(message, { duration: 3000 });
        console.error("Login error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-slate-800 p-8 rounded-xl w-96 inset-shadow-sm inset-shadow-indigo-500/50"
        >
          <h2 className="text-2xl font-bold mb-6 text-cyan-400 font-serif">
            Login
          </h2>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full p-2 mb-2 bg-slate-700 rounded outline-none inset-shadow-sm inset-shadow-indigo-400/30 text-cyan-400"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-400 text-xs mb-3">{formik.errors.email}</p>
          )}

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full p-2 mb-2 bg-slate-700 rounded outline-none inset-shadow-sm inset-shadow-indigo-400/30 text-cyan-400 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2.5 hover:text-white text-cyan-200 cursor-pointer"
            >
              {showPassword ? <FaEye size={22} /> : <GiEyelashes size={23} />}
            </button>
          </div>

          {formik.touched.password && formik.errors.password && (
            <p className="text-red-400 text-xs mb-3">
              {formik.errors.password}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-300 py-2 rounded hover:bg-blue-200 transition-all ease-in duration-200 cursor-pointer shadow-md shadow-indigo-300/30 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {formik.isSubmitting && (
              <Loader2 className="animate-spin text-slate-900" size={18} />
            )}
            <span className="text-slate-950 text-md font-medium">
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </span>
          </button>

          <p className="text-cyan-400 text-sm mt-3">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-300 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
