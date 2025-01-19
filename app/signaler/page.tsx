'use client';
import Navbar from "@/components/navbar";
import { useState } from 'react';

export default function EmergencyReportPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    severity: 'Low',
    description: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting the report:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-green-600">Signalement envoyé avec succès !</h1>
            <p className="mt-4">Merci d'avoir signalé ce problème. Nous vous contacterons si nécessaire.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-6 text-red-600">Signaler un problème urgent</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Votre adresse email"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="severity">Niveau de gravité</label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Low">Faible</option>
                <option value="Medium">Moyen</option>
                <option value="High">Élevé</option>
                <option value="Critical">Critique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="description">Description du problème</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le problème..."
                required
                rows={5}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Envoyer le signalement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}