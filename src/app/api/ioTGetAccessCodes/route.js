import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";

function isWithinTwoHours(disciplineTime) {
    // Obtém a data e hora atual
    const now = new Date();

    // Converte a string do horário da disciplina para um objeto Date
    const [hours, minutes] = disciplineTime.split(":").map(Number);
    const disciplineDate = new Date();
    disciplineDate.setHours(hours, minutes, 0, 0); // Define a hora e os minutos

    // Calcula a diferença em milissegundos
    const differenceInMs = now - disciplineDate;
    
    // 2 horas em milissegundos
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    // Retorna true se estiver dentro do intervalo de até 2 horas após
    return differenceInMs >= 0 && differenceInMs <= twoHoursInMs;
}

export async function POST(req) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Método não permitido" }, {status: 405});
    }

    // app/api/ioTGetAccessCodes?sala=261
    const data = req.nextUrl.searchParams.get("sala")
    const sala = data;

    if (!sala) {
        return NextResponse.json({ message: "Sala é obrigatório" }, {status: 400});
    }

    const db = await connectDB();

    const disciplinas = await db.all(`
            SELECT id, horario
            FROM disciplines
            WHERE sala = ?
        `, [sala])
    
    
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

    const access_code = await req.json()
    if (codes.includes(access_code.UID)){
        console.log("Aluno autorizado")
        return NextResponse.json({result: true}, {status: 200});
    } else {
        console.log("Aluno não autorizado")
        return NextResponse.json({result: false}, {status: 200});
    }
}
