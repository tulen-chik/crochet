import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1; // Get the page value from URL parameters
    const limit = 9; // Number of items per page
    const offset = (page - 1) * limit;

    try {
        // Count total number of items
        const countResult = await sql`SELECT COUNT(*) FROM embroidery_schemes`;
        const totalCount = parseInt(countResult.rows[0].count, 10);

        // Fetch data with pagination
        const dataResult = await sql`
            SELECT * FROM embroidery_schemes
            ORDER BY id
            LIMIT ${limit} OFFSET ${offset}
        `;

        return NextResponse.json({
            schemes: dataResult.rows,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    const formData = await req.formData();
    const title = formData.get('title');
    const tags = formData.get('tags');
    const image = formData.get('image'); // Это будет объект File
    const difficulty = formData.get('difficulty');
    const description = formData.get('description');
    const materials = formData.get('materials');
    const instructions = formData.get('instructions');

    // Генерация уникального имени для изображения
    const uniqueImageName = `${uuidv4()}_${image.name}`;
    const imagePath = path.join(process.cwd(), 'public', uniqueImageName);
    const buffer = Buffer.from(await image.arrayBuffer());

    // Сохранение файла изображения
    fs.writeFileSync(imagePath, buffer);

    try {
        const result = await sql`
            INSERT INTO embroidery_schemes (title, tags, image, difficulty, description, materials, instructions)
            VALUES (${title}, ${tags}, ${uniqueImageName}, ${difficulty}, ${description}, ${materials}, ${instructions})
            RETURNING *
        `;

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
