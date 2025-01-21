'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import './home.css'
import generateCode from "@/utils/codeGenerator";

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [code, setCode] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push("/login"); // Redireciona se não estiver logado
        }
    }, []);

    const generatorHandler = () => {
        setCode(generateCode); // Apenas imprime 100 por enquanto
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 home">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md text-center ">
                <h1 className="text-2xl font-bold mb-4">Bem-vindo, {user?.nome || "Usuário"}!</h1>

                <div className="mb-4">
                    <p><strong>Matrícula:</strong> {user?.matricula || "N/A"}</p>
                </div>
                <button 
                    onClick={() => {router.push('/users')}} 
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                >
                    Lista de Usuarios
                </button>
                
                <button 
                    onClick={generatorHandler} 
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                >
                    Gerar Código
                </button>

                {code && <p className="text-xl font-bold mt-4">{code}</p>}
            </div>
        </div>
    );
}
