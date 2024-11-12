import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(req) {
    const id = req.url.split("/").pop();

    if (!id || id.trim() === '') {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    try {
        const result = await sql`
            SELECT * FROM crochet_schemes WHERE id = ${numericId}
        `;

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Crochet scheme not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    const id = req.url.split("/").pop();

    if (!id || id.trim() === '') {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        // Получаем запись из базы данных, чтобы узнать имя файла изображения
        const result = await sql`
            SELECT image FROM crochet_schemes WHERE id = ${id}
        `;

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        const imageName = result.rows[0].image;
        const imagePath = path.join(process.cwd(), 'public', 'uploads', imageName);

        // Удаляем файл изображения с диска, если он существует
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Удаляем запись из базы данных
        await sql`
            DELETE FROM crochet_schemes WHERE id = ${id}
        `;

        return NextResponse.json({ error: 'Record was deleted' }, { status: 204 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
