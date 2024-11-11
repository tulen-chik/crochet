"use client"
import { useState } from 'react';

export default function AdminPanel() {
    const [title, setTitle] = useState('');
    const [colors, setColors] = useState('');
    const [description, setDescription] = useState('');
    const [instructionsInput, setInstructionsInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isCrochet, setIsCrochet] = useState(false); // Состояние для переключения между шитьем и вязанием

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const instructionsArray = instructionsInput.split(/\r?\n/).filter(step => step.trim() !== '');
        const instructionsObject = {};
        instructionsArray.forEach((step, index) => {
            instructionsObject[`шаг${index + 1}`] = step.trim();
        });

        const formData = new FormData();
        formData.append('title', title);
        formData.append('colors', colors);
        formData.append('description', description);
        formData.append('instructions', JSON.stringify(instructionsObject));
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const endpoint = isCrochet ? '/api/crochet-schemes' : '/api/embroidery-schemas'; // Выбор эндпоинта

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setSuccess('Данные успешно отправлены!');
                // Очистка формы после успешной отправки
                setTitle('');
                setColors('');
                setDescription('');
                setInstructionsInput('');
                setImageFile(null);
            } else {
                setError(result.error || 'Ошибка при отправке данных');
            }
        } catch (err) {
            setError('Ошибка при отправке данных: ' + err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Админ-панель</h1>
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setIsCrochet(false)}
                    className={`px-4 py-2 rounded-l ${!isCrochet ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    Шитье
                </button>
                <button
                    onClick={() => setIsCrochet(true)}
                    className={`px-4 py-2 rounded-r ${isCrochet ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    Вязание
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Заголовок:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Цвета:
                        <input
                            type="text"
                            value={colors}
                            onChange={(e) => setColors(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Описание:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Инструкции (каждый шаг на новой строке):
                        <textarea
                            value={instructionsInput}
                            onChange={(e) => setInstructionsInput(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                            rows={5}
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Изображение:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                        />
                    </label>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200">
                    Отправить
                </button>
            </form>
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {success && <p className="mt-4 text-green-600">{success}</p>}
        </div>
    );
}
