import { Link } from "react-router-dom";
import Notes from "./components/Notes";

function App() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-6 flex flex-col md:flex-row gap-4">
      <section className="md:w-1/4 lg:w-1/6 bg-gray-100 shadow-lg p-4 rounded-lg">
        <Notes />
      </section>

      <section className="flex-1 bg-gray-100 shadow-lg p-4 rounded-lg">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">WebGPU Computer Graphics Starter Kit</h1>
          <p className="mt-4 text-xl text-gray-700">
            Welcome to the WebGPU Computer Graphics Starter Kit! This project is designed for front-end developers eager to explore the world of computer graphics using WebGPU. Leverage modern web development tools like Vite, TypeScript, and React to create an efficient and educational environment for learning and experimentation.
          </p>
        </header>

        <div>
          <Link to="notes/01Basics" className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">Start your journey</Link>
          <p className="mt-4 text-lg text-gray-700">
            Begin by exploring the basics of WebGPU and how to render basic 2D and 3D graphics in your browser. Refer to the topics in the Table of Contents to start learning.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
