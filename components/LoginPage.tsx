"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { setCookie } from "cookies-next";
import { login } from "@/api/auth/login";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData.email, formData.password);

      console.log(response.token);
      console.log(response.data);

      const token = response.token;
      const companyData = response.data[0];
      const companyId = companyData._id;

      // // Store token in cookie
      setCookie("token", token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      setCookie("companyId", companyId, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Company Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
