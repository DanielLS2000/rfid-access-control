import { connectDB } from "@/db/db";
import generateCode from "@/utils/codeGenerator";
import { NextResponse } from "next/server";

export async function POST(req) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Método não permitido" }, {status: 405});
    }

    const data = await req.json()
    const { disciplina_id, matricula } = data;

    if (!disciplina_id || !matricula) {
        return NextResponse.json({ message: "Todos os campos são obrigatórios" }, {status: 400});
    }

    const access_code = generateCode(matricula)
    const db = await connectDB();
    await db.run("INSERT INTO discipline_students (disciplina_id, matricula, access_code) VALUES (?, ?, ?)", [disciplina_id, matricula, access_code]);

    return NextResponse.json({ message: "Aluno adicionado à disciplina" }, {status: 201});
}
