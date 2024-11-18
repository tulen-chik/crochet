import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import {del} from "@vercel/blob";

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
        // Get the record from the database to retrieve the image URL
        const result = await sql`
            SELECT image FROM crochet_schemes WHERE id = ${id}
        `;

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        const imageUrl = result.rows[0].image;

        // Delete the image from Vercel Blob
        if (imageUrl) {
            await del(imageUrl);
        }

        // Delete the record from the database
        await sql`
            DELETE FROM crochet_schemes WHERE id = ${id}
        `;

        return NextResponse.json({ message: 'Record was deleted' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
