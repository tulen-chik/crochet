import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Parse the request body
        const { username, password } = await request.json();

        // Find the user
        const { rows } = await sql`
            SELECT id, username, password_hash
            FROM users
            WHERE username = ${username}
        `;

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const user = rows[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT
        const token = signToken({ userId: user.id, username: user.username });

        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Error logging in', error: error.message }, { status: 500 });
    }
}