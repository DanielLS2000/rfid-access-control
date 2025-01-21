'use client'

import { useEffect, useState } from "react";
import './users.css'
import { useRouter } from "next/navigation";
import generateCode from "@/utils/codeGenerator";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/students");
            const data = await res.json();
            console.log(data)
            setStudents(data);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (e, matricula) => {
        e.preventDefault();
        const res = await fetch("/api/students", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(matricula),
        });
        fetchStudents()
    };

    const generatorHandler = () => {
        console.log(generateCode)
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 users">
            <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Lista de Alunos</h1>

                {loading ? (
                    <p className="text-center text-gray-600">Carregando...</p>
                ) : students.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="p-2 border border-gray-300">Matrícula</th>
                                <th className="p-2 border border-gray-300">Nome</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index} className="hover:bg-gray-200">
                                    <td className="p-2 border border-gray-300 text-center">{student.matricula}</td>
                                    <td className="p-2 border border-gray-300">{student.nome}</td>
                                    <td className="p-2 border border-gray-300">
                                        <button 
                                            onClick={generatorHandler} 
                                            className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                                        >
                                            Gerar Código
                                        </button>
                                        <button 
                                            className="p-2 border bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
                                            onClick={(e) => {handleDelete(e, student)}}    
                                        >X</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-600">Nenhum aluno cadastrado.</p>
                )}
            </div>
            <button 
                onClick={() => router.push("/register")}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
                Registrar Novo Aluno
            </button>
            <button 
                onClick={() => router.push("/")}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
                Home
            </button>
        </div>
    );
}
