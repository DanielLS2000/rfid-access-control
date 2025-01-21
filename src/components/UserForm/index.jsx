'use client'

import { useState } from "react";
import './UserForm.css'
import { useRouter } from "next/navigation";

export default function UserForm() {
    const [form, setForm] = useState({ matricula: "", nome: "", senha: "" });
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res;
        setMessage(data.message);
        router.push("/users")
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 UserForm">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Cadastro de Aluno</h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full p-2 border rounded-md" type="text" name="matricula" placeholder="Matrícula" onChange={handleChange} required />
                    <input className="w-full p-2 border rounded-md" type="text" name="nome" placeholder="Nome" onChange={handleChange} required />
                    <input className="w-full p-2 border rounded-md" type="password" name="senha" placeholder="Senha" onChange={handleChange} required />
                    
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
                        Cadastrar
                    </button>
                </form>

                {message && <p className="text-center text-green-600 mt-3">{message}</p>}
            </div>
        </div>
    );
}