import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate('/');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <Scissors className="w-12 h-12 text-zinc-800 mb-4" />
          <h1 className="text-3xl font-bold text-zinc-800">Catoia do Corte</h1>
          <p className="text-zinc-500 mt-2">Crie sua conta para agendar horários</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-800 text-white py-3 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Criar Conta
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-zinc-800 font-semibold hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}