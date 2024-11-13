import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import path from "path";
import fs from "fs";

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
            SELECT * FROM embroidery_schemes WHERE id = ${numericId}
        `;

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Embroidery scheme not found' }, { status: 404 });
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
        // Get the record from the database to find out the image file name
        const result = await sql`
            SELECT image FROM embroidery_schemes WHERE id = ${id}
        `;

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        const imageName = result.rows[0].image;
        const imagePath = path.join(process.cwd(), 'public', imageName);

        // Delete the image file from disk if it exists
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Delete the record from the database
        await sql`
            DELETE FROM embroidery_schemes WHERE id = ${id}
        `;

        // Return a 204 No Content response
        return NextResponse.json({ error: 'Record was deleted' }, { status: 204 }); // This will send a 204 response with no content
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
