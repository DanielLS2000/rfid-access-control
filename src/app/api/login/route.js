import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    if (req.method !== "POST") return NextResponse.json({ message: "Método não permitido" }, {status: 405});

    const data = await req.json()
    const { matricula, senha } = data

    if (!matricula || !senha) {
        return NextResponse.json({ message: "Todos os campos são obrigatórios" }, {status: 400});
    }

    try {
        const db = await connectDB();
        const user = await db.get("SELECT * FROM students WHERE matricula = ? AND senha = ?", [matricula, senha]);

        if (!user) {
            return NextResponse.json({ message: "Matrícula ou senha incorretos" }, {status: 401});
        }

        return NextResponse.json({ message: "Login bem-sucedido!", user }, {status: 200});
    } catch (error) {
        console.error("Erro no login:", error);
        return NextResponse.json({ message: "Erro no servidor" }, {status: 500});
    }
}
