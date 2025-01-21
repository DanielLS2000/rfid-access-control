import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const db = await connectDB();

    const disciplines = await db.all("SELECT * FROM disciplines");
    return NextResponse.json(disciplines, {status: 200});
}

export async function POST(req) {
    const db = await connectDB();

    if (req.method === "POST") {
        const data =  await req.json()
        const { name, horario, sala } = data;
        await db.run("INSERT INTO disciplines (name, horario, sala) VALUES (?, ?, ?)", [name, horario, sala]);
        return NextResponse.json({ message: "Disciplina criada com sucesso" });
    }

    return NextResponse.json({ message: "Método não permitido" }, {status: 405});
}