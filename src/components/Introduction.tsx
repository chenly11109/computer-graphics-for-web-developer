import { Link } from "react-router-dom";

function App() {
    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-48px)] py-6 bg-white shadow-md rounded-lg">
            <header className="mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 my-4">WebGPU Computer Graphics Starter Kit</h1>
                <p className="mt-4  text-gray-700">
                    Welcome to the WebGPU Computer Graphics Starter Kit! This project is tailored for front-end developers who are eager to delve into the realm of computer graphics.
                </p>
                <p className="mt-4  text-gray-700">
                    Utilize WebGPU, Vite, TypeScript, and React.
                </p>
                <p className="mt-4  text-gray-700">
                    Inspired by course
                    <a
                        className="mx-2 text-blue-500 hover:text-blue-700 font-semibold underline"
                        href="https://www.edx.org/learn/computer-graphics/the-university-of-california-san-diego-computer-graphics">CSE 167</a>

                    &
                    <a
                        className="mx-2 text-blue-500 hover:text-blue-700 font-semibold underline"
                        href='https://webgpufundamentals.org/webgpu/lessons/webgpu-fundamentals.html'
                    >WebGPU Tutorial</a>

                    . No need for C++, C, or any related language requirements.
                </p>



            </header>

            <div>
                <Link to="/01Basics" className="text-xl text-blue-500 hover:text-blue-700 font-semibold underline">Start your journey</Link>

            </div>
        </section>

    );
}

export default App;
