import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function POST(req, res) {

    const formData = await req.formData();
    const username = formData.get('username');
    const password = formData.get('password');
    const email = formData.get('email');
    try {
        // Check if user already exists
        const existingUser = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const { rows } = await sql`
      INSERT INTO users (username, password_hash, email)
      VALUES (${username}, ${hashedPassword}, ${email})
      RETURNING id, username
    `;

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}