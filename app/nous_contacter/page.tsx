    'use client';

    import React, { useState } from 'react';
    import Navbar from "@/components/navbar";
    import { Mail, Phone, Clock } from 'lucide-react';

    export default function Contact() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const toggleColumn = () => {
        setIsOpen(!isOpen);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ici vous pouvez ajouter la logique d'envoi du formulaire
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-white">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />

        <div className="max-w-6xl mx-auto px-4 py-12">
            <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nous Contacter</h1>
            <p className="text-lg text-gray-600">Nous sommes là pour vous aider. N&apos;hésitez pas à nous contacter.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                <Phone className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">Téléphone</h2>
                </div>
                <p className="text-gray-600">+33 (0)1 23 45 67 89</p>
                <p className="text-gray-600">+33 (0)1 98 76 54 32</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">Email</h2>
                </div>
                <p className="text-gray-600">contact@ld-makeur.fr</p>
                <p className="text-gray-600">support@ld-makeur.fr</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">Horaires</h2>
                </div>
                <p className="text-gray-600">Lun-Ven: 9h-18h</p>
                <p className="text-gray-600">Sam-Dim: Fermé</p>
            </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                    </label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                    </label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>
                </div>

                <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                </label>
                <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="support">Support technique</option>
                    <option value="commercial">Question commerciale</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                </select>
                </div>

                <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                ></textarea>
                </div>

                <div>
                <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
                >
                    Envoyer le message
                </button>
                </div>
            </form>
            </div>

            <footer className="mt-12 text-center text-gray-600">
            <p>© 2025 LD-Makeur. Tous droits réservés.</p>
            </footer>
        </div>
        </div>
    );
    }