'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Disciplines() {
    const router = useRouter();
    const [disciplines, setDisciplines] = useState([]);
    const [newDiscipline, setNewDiscipline] = useState({ name: "", horario: "", sala: "" });
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [accessCodes, setAccessCodes] = useState([]);
    const [disciplineAccessCodes, setDisciplineAccessCodes] = useState(null)

    useEffect(() => {
        fetchDisciplines();
        fetchStudents();
    }, []);

    const fetchDisciplines = async () => {
        const res = await fetch("/api/disciplines");
        const data = await res.json();
        setDisciplines(data);
    };

    const fetchStudents = async () => {
        const res = await fetch("/api/students");
        const data = await res.json();
        setStudents(data);
    };

    const handleCreateDiscipline = async () => {
        const res = await fetch("/api/disciplines", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDiscipline),
        });

        if (res.ok) {
            setNewDiscipline({ name: "", horario: "", sala: "" });
            fetchDisciplines();
        }
    };

    const handleAddStudent = async () => {
        if (!selectedDiscipline || !selectedStudent) return;

        const res = await fetch("/api/addStudentToDiscipline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ disciplina_id: selectedDiscipline, matricula: selectedStudent }),
        });

        if (res.ok) {
            fetchDisciplines();
        }
    };

    const getCodes = async (e, disciplinaId) => {
        const res = await fetch(`/api/getCodes?disciplina_id=${disciplinaId}`);
        const data = await res.json();
        setAccessCodes(data);
    }

    const handleAttCodes = async () => {
        const res = await fetch("/api/getCodes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ disciplina_id: disciplineAccessCodes}),
        });
        
        if (res.ok) {
            getCodes(null, disciplineAccessCodes);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-black">
            <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">Gerenciar Disciplinas</h1>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Criar Disciplina</h2>
                    <input 
                        type="text" placeholder="Nome da Disciplina" 
                        value={newDiscipline.name} 
                        onChange={(e) => setNewDiscipline({ ...newDiscipline, name: e.target.value })} 
                        className="w-full p-2 border rounded-md mb-2"
                    />
                    <input 
                        type="text" placeholder="Horário" 
                        value={newDiscipline.horario} 
                        onChange={(e) => setNewDiscipline({ ...newDiscipline, horario: e.target.value })} 
                        className="w-full p-2 border rounded-md mb-2"
                    />
                    <input 
                        type="text" placeholder="Sala" 
                        value={newDiscipline.sala} 
                        onChange={(e) => setNewDiscipline({ ...newDiscipline, sala: e.target.value })} 
                        className="w-full p-2 border rounded-md mb-2"
                    />
                    <button 
                        onClick={handleCreateDiscipline} 
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Criar Disciplina
                    </button>
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Adicionar Aluno</h2>
                    <select 
                        onChange={(e) => setSelectedDiscipline(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2"
                    >
                        <option value="">Selecione uma Disciplina</option>
                        {disciplines.map((disc) => (
                            <option key={disc.id} value={disc.id}>{disc.name}</option>
                        ))}
                    </select>

                    <select 
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2"
                    >
                        <option value="">Selecione um Aluno</option>
                        {students.map((stu) => (
                            <option key={stu.matricula} value={stu.matricula}>{stu.nome}</option>
                        ))}
                    </select>

                    <button 
                        onClick={handleAddStudent} 
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                    >
                        Adicionar Aluno
                    </button>
                </div>

                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Códigos de Acesso</h2>
                    <button 
                        onClick={handleAttCodes} 
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                    >
                        Atualizar Codigos
                    </button>
                    <select 
                        onChange={(e) => setDisciplineAccessCodes(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2"
                    >
                        <option value="">Selecione uma Disciplina</option>
                        {disciplines.map((discipline) => (
                            <option key={discipline.id} value={discipline.id} onClick={(e) => getCodes(e, discipline.id)}>{discipline.name}</option>
                        ))}
                    </select>
                    <ul className="list-disc pl-5">
                        {accessCodes.map((code) => (
                            <li key={code.matricula}>{code.matricula}: <strong>{code.access_code}</strong></li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={() => {router.push('/')}} 
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                >
                    Home
                </button>
            </div>
        </div>
    );
}
