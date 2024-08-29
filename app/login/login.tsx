'use client';

import { AppContext } from '@/components/UserContext';
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent, useContext } from 'react';
import jwt, { JwtPayload } from "jsonwebtoken";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [shortcodeSent, setShortcodeSent] = useState(false);
  const [userId, setUserId] = useState('');
  const { setToken, setDecodedToken } = useContext(AppContext);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const response = await fetch('https://dbuprm-backend-1.onrender.com/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const new_token = data.access_token;
      localStorage.setItem('authToken', new_token);

      const dec = jwt.decode(new_token) as JwtPayload | null;

      setDecodedToken(dec);

      if (typeof dec !== "string" && dec?.status !== "active") {
        router.push("/unauthorized");
      } else {
        setToken(new_token);
        router.push("/dashboard");
      }
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'An error occurred');
    }
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError('');

    const response = await fetch('https://dbuprm-backend-1.onrender.com/auth/forget/shortcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: forgotEmail }),
    });

    if (response.ok) {
      const data = await response.json();
      setUserId(data.userId);
      router.push(`/reset?userId=${data.userId}`);
      setShortcodeSent(true);
    } else {
      const errorData = await response.json();
      setForgotError(errorData.message || 'An error occurred');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/office-computer-laptop-light-modified.png")' }}>
      <div className="relative w-full max-w-md p-8 bg-white/70 backdrop-blur-md rounded-lg shadow-md md:max-w-lg">
        {!forgotPassword ? (
          <>
            <h4 className="text-2xl font-bold text-center text-blue-600">Welcome to</h4>
            <h2 className="text-2xl font-bold text-center text-blue-500">DBU PC Management System</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-700 hover:text-blue-600"
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </form>
          </>
        ) : !shortcodeSent ? (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-500">Forgot Password</h2>
            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              <div>
                <label htmlFor="forgot-email" className="sr-only">Email address</label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>

              {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}

              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Shortcode
              </button>

              <div className="text-sm text-right">
                <button
                  type="button"
                  className="font-medium text-blue-700 hover:text-blue-600"
                  onClick={() => setForgotPassword(false)}
                >
                  Back to login
                </button>
              </div>
            </form>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Login;
