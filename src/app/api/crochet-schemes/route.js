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
            SELECT id, title, colors, image
            FROM crochet_schemes
            WHERE title ILIKE ${`%${filter}%`} OR colors ILIKE ${`%${filter}%`}
            ORDER BY id DESC
            LIMIT ${limit} OFFSET ${(page - 1) * limit}
        `;

        const countQuery = sql`
            SELECT COUNT(*)
            FROM crochet_schemes
            WHERE title ILIKE ${`%${filter}%`} OR colors ILIKE ${`%${filter}%`}
        `;

        const [{ rows }, { rows: countRows }] = await Promise.all([query, countQuery]);

        const totalCount = parseInt(countRows[0].count);
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            data: rows,
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount
        });
    } catch (error) {
        console.error('Error fetching crochet schemes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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