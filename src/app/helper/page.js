'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Send, Loader2 } from 'lucide-react';

// Простая реализация нейронной сети
class NeuralNetwork {
    constructor() {
        this.responses = {
            greeting: [
                "Hi! How can I help you today?",
                "Hello! What can I assist you with?",
                "Welcome! How may I help you?",
            ],
            farewell: [
                "Goodbye! Have a great day!",
                "See you later! Take care!",
                "Bye! Feel free to return if you need more help!",
            ],
            unknown: [
                "I'm not sure I understand. Could you rephrase that?",
                "I'm still learning. Could you try asking in a different way?",
                "I'm not quite sure about that. Could you provide more details?",
            ],
        };

        this.keywords = {
            greeting: ['hi', 'hello', 'hey', 'greetings'],
            farewell: ['bye', 'goodbye', 'see you', 'farewell'],
        };
    }

    async processInput(input) {
        const lowercaseInput = input.toLowerCase();

        // Симуляция задержки обработки
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Проверка на совпадение ключевых слов
        for (const [category, words] of Object.entries(this.keywords)) {
            if (words.some(word => lowercaseInput.includes(word))) {
                const responses = this.responses[category];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }

        // По умолчанию ответ неизвестен
        const unknownResponses = this.responses.unknown;
        return unknownResponses[Math.floor(Math.random() * unknownResponses.length)];
    }
}

export default function VirtualHelper() {
    const [messages, setMessages] = useState([
        { id: 1, text: "HI! HOW CAN I HELP YOU?", sender: 'assistant' }
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);
    const neuralNetwork = useRef(new NeuralNetwork());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        // Добавление сообщения пользователя
        const userMessage = {
            id: messages.length + 1,
            text: input,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);

        try {
            // Получение ответа от нейронной сети
            const response = await neuralNetwork.current.processInput(input);

            // Добавление сообщения ассистента
            const assistantMessage = {
                id: messages.length + 2,
                text: response,
                sender: 'assistant'
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error processing message:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF6] relative">
            {/* Decorative border */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-0 top-0 w-24 h-full bg-[url('/placeholder.svg?height=600&width=100')] bg-contain bg-left opacity-20" />
                <div className="absolute right-0 top-0 w-24 h-full bg-[url('/placeholder.svg?height=600&width=100')] bg-contain bg-right opacity-20" />
            </div>

            {/* Header */}
            <header className="relative z-10 p-4 flex justify-between items-center">
                <button className="text-[#C5A572]">
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-serif text-center text-[#C5A572]">VIRTUAL HELPER</h1>
                <div className="w-10" /> {/* Placeholder for alignment */}
            </header>

            {/* Chat container */}
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white/50 backdrop-blur-sm border-[#C5A572]/20 rounded-lg shadow-lg">
                    <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-full ${
                                        message.sender === 'user'
                                            ? 'bg-[#D4C3B7] text-gray-800'
                                            : 'bg-[#C5A572] text-white'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="flex justify-start">
                                <div className="bg-[#C5A572] text-white px-4 py-2 rounded-full flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input form */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-[#C5A572]/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="rounded-full border-[#C5A572]/50 focus:border-[#C5A572] focus:ring-[#C5A572] p-2 flex-grow"
                                disabled={isProcessing}
                            />
                            <button
                                type="submit"
                                className="rounded-full bg-[#C5A572] hover:bg-[#B49461] p-2 flex items-center justify-center"
                                disabled={isProcessing}
                            >
                                <Send className="h-4 w-4 text-white" />
                                <span className="sr-only">Send message</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
