import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1; // Получаем значение page из параметров URL
    const limit = 9; // Количество элементов на странице
    const offset = (page - 1) * limit;

    try {
        // Подсчет общего количества элементов
        const countResult = await sql`SELECT COUNT(*) FROM crochet_schemes`;
        const totalCount = parseInt(countResult.rows[0].count, 10);

        // Получение данных с пагинацией
        const dataResult = await sql`
            SELECT * FROM crochet_schemes
            ORDER BY id
            LIMIT ${limit} OFFSET ${offset}
        `;

        return NextResponse.json({
            data: dataResult.rows,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(req, res) {
    const { title, colors, description, instructions } = req.body;

    // Проверка, есть ли файл в запросе
    if (!req.body.image) {
        return res.status(400).json({ error: 'Image file is required' });
    }

    const imageBuffer = Buffer.from(await req.body.image.arrayBuffer());
    const uniqueImageName = `${uuidv4()}_${req.body.image.name}`;
    const imagePath = path.join(process.cwd(), 'public', 'uploads', uniqueImageName);

    // Сохранение файла изображения
    fs.writeFileSync(imagePath, imageBuffer);

    try {
        const result = await sql`
            INSERT INTO crochet_schemes (title, colors, image, description, instructions)
            VALUES (${title}, ${colors}, ${uniqueImageName}, ${description}, ${instructions})
            RETURNING *
        `;

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
