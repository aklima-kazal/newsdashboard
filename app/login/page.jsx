"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function LoginPage() {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:4000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok && data.token) {
          // Save token so middleware/auth.js can see it
          Cookies.set("token", data.token, { expires: 1, sameSite: "strict" });
          toast.success("Login Successful!");
          window.location.href = "/dashboard"; // Force refresh for session sync
        } else {
          toast.error(data.error || "Login failed");
        }
      } catch (err) {
        toast.error("Is the backend running on Port 4000?");
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={formik.handleSubmit}
        className="p-8 bg-white rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Admin Login
        </h1>
        <div className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="admin@news.com"
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            {...formik.getFieldProps("email")}
          />
          <input
            name="password"
            type="password"
            placeholder="password123"
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            {...formik.getFieldProps("password")}
          />
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {formik.isSubmitting ? "Verifying..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
