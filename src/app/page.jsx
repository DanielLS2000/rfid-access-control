'use client'

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-6 text-black">Bem-vindo ao Sistema</h1>

                <div className="space-y-4">
                    <button 
                        onClick={() => router.push("/register")}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Cadastrar Aluno
                    </button>

                    <button 
                        onClick={() => router.push("/login")}
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                    >
                        Login
                    </button>

                    <button 
                        onClick={() => router.push("/users")}
                        className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition duration-200"
                    >
                        Listar Alunos
                    </button>

                    <button 
                        onClick={() => router.push("/home")}
                        className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                    >
                        Página do Usuário
                    </button>
                </div>
            </div>
        </div>
    );
}

