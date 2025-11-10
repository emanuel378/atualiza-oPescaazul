import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { LoginForm } from '../components/Auth/login';
import type { LoginData } from '../types/auth';
import { AuthService } from '../services/authService';

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await AuthService.login(data);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Email inválido.');
          break;
        case 'auth/user-not-found':
          setError('Usuário não encontrado.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta.');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas. Tente novamente mais tarde.');
          break;
        default:
          setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      style={{
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      {/* Background decorative elements - Fixados */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        <div 
          className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: 'blob 7s infinite'
          }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: 'blob 7s infinite 2s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: 'blob 7s infinite 4s'
          }}
        ></div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
        {/* Left Side - Brand/Info */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="inline-flex items-center justify-center lg:justify-start mb-6 lg:mb-8">
              <div className="h-30 lg:h-50 w-30 lg:w-40 bg-gradient-to-r from-white-600 to-white-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                <img src="public/pesca_azul.svg" alt="logo" />
              </div>
              <span className="ml-4 text-2xl lg:text-5xl font-extrabold text-blue-900">Pesca Azul</span>
            </div>
            
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 lg:mb-6">
              Bem-vindo de volta
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 leading-relaxed">
              Entre na sua conta para acessar recursos exclusivos e gerenciar sua conta de forma simples e segura.
            </p>
            
            <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-500">
              
              </div>
              <div className="flex items-center">
                
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <Card className="py-6 lg:py-8 px-4 sm:px-6 lg:px-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Entre na sua conta</h2>
              <p className="mt-2 text-gray-600 text-sm lg:text-base">
                Ou{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  crie uma nova conta
                </Link>
              </p>
            </div>

            {error && (
              <div 
                className="mb-4 lg:mb-6 p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg lg:rounded-xl flex items-center space-x-3 animate-shake"
              >
                <svg className="h-4 lg:h-5 w-4 lg:w-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-xs lg:text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            
            <div className="mt-4 lg:mt-6 text-center">
              <p className="text-gray-600 text-xs lg:text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Esqueceu sua senha?
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};