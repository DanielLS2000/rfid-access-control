import { connectDB } from "@/db/db";
import generateCode from "@/utils/codeGenerator";
import { NextResponse } from "next/server";

export async function GET(req) {
    if (req.method !== "GET") {
        return NextResponse.json({ message: "Método não permitido" }, {status: 405});
    }

    const data = req.nextUrl.searchParams.get("disciplina_id")
    const disciplina_id = data;

    if (!disciplina_id) {
        return NextResponse.json({ message: "ID da disciplina é obrigatório" }, {status: 400});
    }

    const db = await connectDB();
    const codes = await db.all(`
        SELECT access_code, matricula 
        FROM discipline_students
        WHERE disciplina_id = ?
    `, [disciplina_id]);

    return NextResponse.json(codes, {status: 200});
}

export async function POST(req) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Método não permitido" }, { status: 405 });
    }

    try {
        const { disciplina_id } = await req.json();

        if (!disciplina_id) {
            return NextResponse.json({ message: "ID da disciplina é obrigatório" }, { status: 400 });
        }

        const db = await connectDB();

        // Buscar alunos matriculados na disciplina
        const matriculas = await db.all(`
            SELECT matricula FROM discipline_students WHERE disciplina_id = ?
        `, [disciplina_id]);

        // Verificar se existem alunos na disciplina
        if (matriculas.length === 0) {
            return NextResponse.json({ message: "Nenhum aluno encontrado para esta disciplina" }, { status: 404 });
        }

        // Gerar e atualizar códigos de acesso
        for (const aluno of matriculas) {
            const newCode = generateCode(aluno.matricula);

            await db.run(`
                UPDATE discipline_students 
                SET access_code = ? 
                WHERE disciplina_id = ? AND matricula = ?
            `, [newCode, disciplina_id, aluno.matricula]);
        }

        return NextResponse.json({ message: "Códigos de acesso atualizados com sucesso!" }, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar códigos de acesso:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}
