
import React, { useState } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import { toast } from '../components/ui/sonner';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { setCurrentScreen } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password', {
        position: "top-center",
      });
      return;
    }

    if (login(username, password)) {
      toast.success('Login successful!', {
        position: "top-center",
      });
      setCurrentScreen(ScreenType.HOME);
    } else {
      toast.error('Invalid credentials', {
        position: "top-center",
      });
    }
  };
  
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.toLowerCase());
  };
  
  const handleForgotPassword = () => {
    if (!email.trim()) {
      toast.error('Please enter your email address', {
        position: "top-center",
      });
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address', {
        position: "top-center",
      });
      return;
    }
    
    toast.success('Password reset link sent to your email', {
      position: "top-center",
    });
    setShowForgotPassword(false);
    setEmail('');
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col items-center justify-center px-8 py-10 h-full">
        <div className="mb-10 flex items-center">
          <img 
            src="/logo.png" 
            alt="Travel Express Logo" 
            className="w-16 h-16 mr-3" 
          />
          <div>
            <span className="text-3xl font-bold">Travel</span>
            <span className="text-3xl font-bold text-travel-primary">Express</span>
          </div>
        </div>
        
        {!showForgotPassword ? (
          <>
            <h1 className="text-3xl font-bold mb-8">Log in</h1>
            
            <input
              type="text"
              placeholder="Username"
              className="travel-input mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            <input
              type="password"
              placeholder="Password"
              className="travel-input mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <button 
              className="text-travel-primary text-sm self-end mb-6"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
            
            <button 
              className="travel-btn w-full mb-4"
              onClick={handleLogin}
            >
              Log In
            </button>
            
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                className="text-travel-primary font-medium"
                onClick={() => setCurrentScreen(ScreenType.SIGNUP)}
              >
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">Forgot Password</h1>
            
            <p className="text-gray-600 mb-6 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <input
              type="email"
              placeholder="Email address"
              className="travel-input mb-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <button 
              className="travel-btn w-full mb-4"
              onClick={handleForgotPassword}
            >
              Send Reset Link
            </button>
            
            <button 
              className="text-travel-primary font-medium"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </PhoneFrame>
  );
};

export default LoginScreen;
