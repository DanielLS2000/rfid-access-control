import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Método não permitido" }, {status: 405});
    }

    const data = req.nextUrl.searchParams.get("sala")
    const sala = data;
    

    if (!sala) {
        return NextResponse.json({ message: "ID da disciplina é obrigatório" }, {status: 400});
    }

    const db = await connectDB();

    const disciplinas = await db.all(`
            SELECT id, horario
            FROM disciplines
            WHERE sala = ?
        `, [sala])
    
    
    console.log(disciplinas)
    var disciplina_id;
    disciplinas.forEach((disciplina) => {
        if (isWithinTwoHours(disciplina.horario)){
            disciplina_id = disciplina.id
        }
    })

    if (disciplina_id == null){
        disciplina_id = disciplinas[0].id
    }

    const codes = await db.all(`
        SELECT access_code 
        FROM discipline_students
        WHERE disciplina_id = ?
    `, [disciplina_id]);

    

    return NextResponse.json(codes, {status: 200});
}
