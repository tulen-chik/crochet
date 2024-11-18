import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const filter = searchParams.get('filter') || '';
    const limit = 9; // Number of items per page

    try {
        let query = sql`
            SELECT id, title, tags, image, difficulty
            FROM embroidery_schemes
            WHERE title ILIKE ${`%${filter}%`} OR tags ILIKE ${`%${filter}%`} OR difficulty ILIKE ${`%${filter}%`}
            ORDER BY id DESC
            LIMIT ${limit} OFFSET ${(page - 1) * limit}
        `;

        const countQuery = sql`
            SELECT COUNT(*)
            FROM embroidery_schemes
            WHERE title ILIKE ${`%${filter}%`} OR tags ILIKE ${`%${filter}%`} OR difficulty ILIKE ${`%${filter}%`}
        `;

        const [{ rows }, { rows: countRows }] = await Promise.all([query, countQuery]);

        const totalCount = parseInt(countRows[0].count);
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            schemes: rows,
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount
        });
    } catch (error) {
        console.error('Error fetching embroidery schemes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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