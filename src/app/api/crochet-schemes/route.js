import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

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

export async function POST(req) {
    const formData = await req.formData();
    const title = formData.get('title');
    const colors = formData.get('colors');
    const description = formData.get('description');
    const instructions = formData.get('instructions');
    const image = formData.get('image'); // This will be a File object

    // Check if the image file is present in the request
    if (!image) {
        return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    try {
        // Generate a unique name for the image
        const uniqueImageName = `${uuidv4()}_${image.name}`;

        // Upload the image to Vercel Blob
        const { url } = await put(uniqueImageName, image, {
            access: 'public',
        });

        // Insert the data into the database
        const result = await sql`
            INSERT INTO crochet_schemes (title, colors, image, description, instructions)
            VALUES (${title}, ${colors}, ${url}, ${description}, ${instructions})
            RETURNING *
        `;

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}