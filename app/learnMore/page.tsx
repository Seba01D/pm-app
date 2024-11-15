import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function page() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-4 bg-white shadow-md">
        <div className="text-xl md:text-2xl font-bold text-blue-600">PManager</div>
        <div>
          <a
            href="/"
            className="px-6 py-3 bg-yellow-400 text-blue-600 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* Learn More Content */}
      <section className="flex-grow flex flex-col items-center justify-center px-6 md:px-10 py-10 md:py-16 bg-white text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
          About This Project
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-2xl mb-8">
          This is an engineering project developed by <span className="font-bold text-yellow-400">Sebastian Drabik</span>. The aim of this project is to create an intuitive platform for project management, helping teams collaborate effectively and manage their tasks efficiently.
        </p>

        <div className="flex flex-col items-center">
          <a
            href="https://github.com/Seba01D/pm-app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-500 transition"
          >
            <FaGithub className="text-3xl" />
            <span>View Project on GitHub</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 md:py-7">
        <div className="max-w-6xl mx-auto text-center text-sm md:text-base">
          <p>&copy; 2024 PManager. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
