"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  if (!loading && isLoggedIn) {
    router.push("/dashboard");
  }

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "Min 6 chars").required("Required"),
    }),
    onSubmit: async (values) => {
      const result = await login(values.email, values.password);
      if (result.success) {
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Login failed");
      }
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-slate-900">
        <Loader2 className="animate-spin text-cyan-400" size={40} />
        <p className="text-cyan-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Toaster />
      <form
        onSubmit={formik.handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-96 flex flex-col gap-4"
      >
        <h1 className="text-2xl text-cyan-400 font-bold text-center">Login</h1>

        <div className="flex flex-col">
          <label className="text-cyan-200 mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="p-2 rounded bg-slate-700 text-white"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && formik.touched.email && (
            <p className="text-red-400 text-sm">{formik.errors.email}</p>
          )}
        </div>

        <div className="flex flex-col relative">
          <label className="text-cyan-200 mb-1">Password</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className="p-2 rounded bg-slate-700 text-white"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-9 text-cyan-400"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {formik.errors.password && formik.touched.password && (
            <p className="text-red-400 text-sm">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-cyan-400 text-slate-900 font-bold py-2 rounded hover:bg-cyan-500"
        >
          Login
        </button>
      </form>
    </div>
  );
}
