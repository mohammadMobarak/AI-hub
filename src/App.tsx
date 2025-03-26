import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Brain, LogIn, UserPlus, LogOut, User as UserIcon } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">AI Tools Hub</span>
              </div>
              <div className="flex items-center space-x-4">
                {!user ? (
                  <>
                    <a href="#/login" className="flex items-center text-gray-600 hover:text-blue-500">
                      <LogIn className="h-5 w-5 mr-1" />
                      Login
                    </a>
                    <a href="#/register" className="flex items-center text-gray-600 hover:text-blue-500">
                      <UserPlus className="h-5 w-5 mr-1" />
                      Register
                    </a>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="h-5 w-5 mr-1" />
                      <span>{user.email}</span>
                    </div>
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="flex items-center text-gray-600 hover:text-blue-500"
                    >
                      <LogOut className="h-5 w-5 mr-1" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
