export default function Home() {

  return (
    <main>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Top Navigation with Login */}
        <header className="flex justify-between items-center p-4 md:p-4 bg-white shadow-md">
          <div className="text-xl md:text-2xl font-bold text-blue-600">PManager</div> 
          <div className="flex items-center space-x-4">
              <a 
                href="/dashboard"
                className="px-4 py-2 text-xl text-yellow-400 font-semibold hover:text-yellow-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Start
              </a>
            <a 
              href="/signin"
              className="px-6 py-3 bg-gradient-to-r from-blue-300 to-blue-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Log in
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex-grow flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-10 md:py-16 bg-gradient-to-r from-blue-500 to-blue-300 text-white">
          {/* Left Side: Headline and CTA */}
          <div className="max-w-lg space-y-4 md:space-y-6 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">
              Manage Your Projects Efficiently with <span className="text-yellow-400">PManager</span>
            </h1>
            <p className="text-base md:text-lg">
              Simplify your project workflows, collaborate effortlessly, and keep track of progress all in one intuitive platform.
            </p>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
              <a
                href="/register"
                className="px-4 py-2 md:px-6 md:py-3 bg-yellow-400 text-blue-600 font-semibold rounded hover:bg-yellow-500 transition text-center"
              >
                Get Started
              </a>
              <a
                href="/learnMore"
                className="px-4 py-2 md:px-6 md:py-3 border border-white text-white rounded hover:bg-white hover:text-blue-600 transition text-center"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Side: Illustration */}
          <div className="hidden md:block">
            <img
              src="/images/project-management-illustration.png"
              alt="Project management illustration"
              className="w-3/4 max-w-md mx-auto"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-8">Features That Power Productivity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
              <div className="p-6 shadow-lg rounded-lg">
                <img src="/images/task.png" alt="Task Management" className="w-12 md:w-16 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold">Task Management</h3>
                <p className="mt-2 text-gray-600">
                  Organize your tasks efficiently and never miss a deadline with our intuitive task management features.
                </p>
              </div>
              <div className="p-6 shadow-lg rounded-lg">
                <img src="/images/collaboration.png" alt="Team Collaboration" className="w-12 md:w-16 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold">Team Collaboration</h3>
                <p className="mt-2 text-gray-600">
                  Collaborate seamlessly with team members, assign tasks, and track progress all in real-time.
                </p>
              </div>
              <div className="p-6 shadow-lg rounded-lg">
                <img src="/images/add.png" alt="Quick Add to Project" className="w-12 md:w-16 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold">Quick Add to Project</h3>
                <p className="mt-2 text-gray-600">
                  Easily add team members, resources, or new tasks to projects in seconds, streamlining your project setup and management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-600 text-white py-6 md:py-7">
          <div className="max-w-6xl mx-auto text-center text-sm md:text-base">
            <p>&copy; 2024 PManager. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
