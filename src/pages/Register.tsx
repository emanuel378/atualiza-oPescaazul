import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { RegisterForm } from '../components/Auth/RegisterForm';
import type { RegisterData } from '../types/auth';
import { AuthService } from '../services/authService';

export const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await AuthService.register(data);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Este email já está em uso.');
          break;
        case 'auth/invalid-email':
          setError('Email inválido.');
          break;
        case 'auth/weak-password':
          setError('Senha muito fraca. Use pelo menos 6 caracteres.');
          break;
        default:
          setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4"
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
          className="absolute -top-40 -right-32 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: 'blob 7s infinite'
          }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: 'blob 7s infinite 2s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
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
            
            <h1 className="text-4xl lg:text-4xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent mb-4 lg:mb-6">
              Comece agora
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 leading-relaxed">
              Junte-se a milhares de usuários e descubra todas as funcionalidades que preparamos para você.
            </p>
            
            <div className="space-y-2 lg:space-y-3 text-sm text-gray-500">
              
              <div className="flex items-center justify-center lg:justify-start">
                
              </div>
              <div className="flex items-center justify-center lg:justify-start">
               
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <Card className="py-6 lg:py-8 px-4 sm:px-6 lg:px-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Crie sua conta</h2>
              <p className="mt-2 text-gray-600 text-sm lg:text-base">
                Ou{' '}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  entre na sua conta existente
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
            
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            
            <div className="mt-4 lg:mt-6 text-center">
              <p className="text-xs text-gray-500">
                Ao criar uma conta, você concorda com nossos{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 underline">Termos de Serviço</a> e{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 underline">Política de Privacidade</a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};