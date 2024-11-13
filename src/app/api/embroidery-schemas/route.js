import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;

    try {
        const countResult = await sql`SELECT COUNT(*) FROM embroidery_schemes`;
        const totalCount = parseInt(countResult.rows[0].count, 10);

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
    const image = formData.get('image');
    const difficulty = formData.get('difficulty');
    const description = formData.get('description');
    const materials = formData.get('materials');
    const instructions = formData.get('instructions');

    if (!image) {
        return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    try {
        const uniqueImageName = `${uuidv4()}_${image.name}`;

        // Upload image to Vercel Blob
        const { url } = await put(uniqueImageName, image, {
            access: 'public',
        });

        const result = await sql`
            INSERT INTO embroidery_schemes (title, tags, image, difficulty, description, materials, instructions)
            VALUES (${title}, ${tags}, ${url}, ${difficulty}, ${description}, ${materials}, ${instructions})
            RETURNING *
        `;

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}