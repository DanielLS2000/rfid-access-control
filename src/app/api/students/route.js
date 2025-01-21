import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    if (request.method !== "POST") {
        return NextResponse.json({ message: "Método não permitido" }, {status: 405});
    }

    const data = await request.json()
    const { matricula, nome, senha } = data;

    if (!matricula || !nome || !senha) {
        return NextResponse.json({ message: "Todos os campos são obrigatórios"}, {status: 400});
    }

    try {
        const db = await connectDB();

        // Verifica se a matrícula já existe
        const existingStudent = await db.get("SELECT * FROM students WHERE matricula = ?", [matricula]);
        if (existingStudent) {
            return NextResponse.json({ message: "Matrícula já cadastrada" }, {status: 400});
        }

        // Insere o novo aluno
        await db.run("INSERT INTO students (matricula, nome, senha) VALUES (?, ?, ?)", [matricula, nome, senha]);

        return NextResponse.json({ message: "Aluno cadastrado com sucesso" }, {status: 201});
    } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        return NextResponse.json({ message: "Erro no servidor" }, {status: 500});
    }
}

export async function GET(req) {
    if (req.method !== "GET") return NextResponse.json({ message: "Método não permitido" }, {status: 405});

    try {
        const db = await connectDB();
        const students = await db.all("SELECT matricula, nome FROM students");

        return NextResponse.json(students, {status: 200});
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        return NextResponse.json({ message: "Erro no servidor" }, {status: 500});
    }
}

export async function DELETE(req) {
    if (req.method !== "DELETE") return NextResponse.json({ message: "Método não permitido" }, {status: 405});

    const data = await req.json()
    const { matricula } = data;

    try {
        const db = await connectDB();
        const existingStudent = await db.get("SELECT * FROM students WHERE matricula = ?", [matricula]);
        if (!existingStudent) {
            return NextResponse.json({ message: "Aluno não encontrado" }, {status:404});
        }
        await db.run("DELETE FROM students WHERE matricula = ?", [matricula]);

        return NextResponse.json({ message: "Aluno deletado com sucesso!" }, {status: 200});
    } catch (error) {
        console.error("Erro ao deletar aluno:", error);
        return NextResponse.json({ message: "Erro no servidor" }, {status: 500});
    }
}

