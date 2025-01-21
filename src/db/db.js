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
            matricula TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            senha TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS disciplines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            horario TEXT NOT NULL,
            sala TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS discipline_students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disciplina_id INTEGER NOT NULL,
            matricula TEXT NOT NULL,
            access_code TEXT NOT NULL,
            FOREIGN KEY (disciplina_id) REFERENCES disciplines(id) ON DELETE CASCADE,
            FOREIGN KEY (matricula) REFERENCES students(matricula) ON DELETE CASCADE
        );
    `);
}

initDB();
