
import React, { useState } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import { toast } from '../components/ui/sonner';

const SignupScreen: React.FC = () => {
  const { signup } = useAuth();
  const { setCurrentScreen } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.toLowerCase());
  };

  const handleSignup = () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Please fill all fields', {
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

    if (password !== confirmPassword) {
      toast.error('Passwords must match', {
        position: "top-center",
      });
      return;
    }

    if (signup(username, password)) {
      toast.success('Account created! Please log in.', {
        position: "top-center",
      });
      setCurrentScreen(ScreenType.LOGIN);
    } else {
      toast.error('Username already exists', {
        position: "top-center",
      });
    }
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
        
        <h1 className="text-3xl font-bold mb-8">Sign up</h1>
        
        <input
          type="text"
          placeholder="Username"
          className="travel-input mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          type="email"
          placeholder="Email"
          className="travel-input mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password"
          className="travel-input mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Confirm Password"
          className="travel-input mb-6"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        <button 
          className="travel-btn w-full mb-4"
          onClick={handleSignup}
        >
          Create Account
        </button>
        
        <p className="text-gray-600">
          Already have an account?{' '}
          <button 
            className="text-travel-primary font-medium"
            onClick={() => setCurrentScreen(ScreenType.LOGIN)}
          >
            Log in
          </button>
        </p>
      </div>
    </PhoneFrame>
  );
};

export default SignupScreen;
