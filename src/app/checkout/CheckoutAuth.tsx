// src/app/checkout/CheckoutAuth.tsx

"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";

interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
}

interface CheckoutAuthProps {
  contactInfo: ContactInfo;
  onLoginSuccess: () => void;
}

export default function CheckoutAuth({
  contactInfo,
  onLoginSuccess,
}: CheckoutAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (contactInfo.phone) {
      const sendCode = async () => {
        const response = await fetch("/api/send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: contactInfo.phone }),
        });

        const data = await response.json();
        if (data.success) {
          setGeneratedCode(data.code);
          setCountdown(120);
        } else {
          setError("Failed to send WhatsApp verification.");
        }
      };

      sendCode();
    }
  }, [contactInfo]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: contactInfo.email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        onLoginSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!contactInfo.phone) {
      setError("Phone number is required for verification");
      return;
    }

    setVerificationStep(true);
  };

  const verifyCode = async () => {
    if (verificationCode !== generatedCode) {
      setError("Invalid verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactInfo.name,
          email: contactInfo.email,
          password: hashedPassword,
          phone: contactInfo.phone,
          phoneVerified: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const loginResult = await signIn("credentials", {
        redirect: false,
        email: contactInfo.email,
        password,
      });

      if (loginResult?.error) {
        throw new Error(loginResult.error);
      }

      onLoginSuccess();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create account";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!contactInfo.phone) return;

    const response = await fetch("/api/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: contactInfo.phone }),
    });

    const data = await response.json();
    if (data.success) {
      setGeneratedCode(data.code);
      setCountdown(120);
      setVerificationCode("");
      setError("");
    } else {
      setError("Failed to resend code.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        {isLogin ? "Login" : "Create Account"}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!verificationStep ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={contactInfo.email}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          )}

          <button
            onClick={isLogin ? handleLogin : handleSignup}
            className="w-full bg-blue-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
          </button>

          <p className="mt-4 text-sm text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-blue-600 underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </>
      ) : (
        <>
          <p className="mb-4">
            A verification code has been sent to{" "}
            <strong>{contactInfo.phone}</strong>.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            onClick={verifyCode}
            className="w-full bg-green-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Create Account"}
          </button>

          {countdown > 0 ? (
            <p className="text-sm mt-2 text-gray-500">
              Resend code in {countdown}s
            </p>
          ) : (
            <button
              onClick={resendCode}
              className="text-blue-600 underline text-sm mt-2"
            >
              Resend Code
            </button>
          )}
        </>
      )}
    </div>
  );
}
