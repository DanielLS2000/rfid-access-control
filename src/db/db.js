import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Função para conectar ao banco de dados SQLite
export async function connectDB() {
    return open({
        filename: "./database.sqlite",
        driver: sqlite3.Database,
    });
}

// Criando a tabela de alunos (se não existir)
async function initDB() {
    const db = await connectDB();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            matricula TEXT UNIQUE NOT NULL,
            nome TEXT NOT NULL,
            senha TEXT NOT NULL
        )
    `);
}

initDB();
