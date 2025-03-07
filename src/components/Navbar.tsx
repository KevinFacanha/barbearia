import { useNavigate } from 'react-router-dom';
import { Scissors, LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Scissors className="h-8 w-8 text-zinc-800" />
            <span className="ml-2 text-xl font-semibold text-zinc-800">
              Catoia do Corte
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-zinc-600">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center text-zinc-600 hover:text-zinc-800"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}