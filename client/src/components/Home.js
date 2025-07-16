import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 dark:bg-gray-900 text-gray-200 dark:text-gray-100 px-6 text-center">
      <h1 className="text-5xl font-extrabold text-indigo-400 mb-6 select-none">
        Welcome to{" "}
        <span className="text-indigo-600 dark:text-indigo-300">Graphique</span>
      </h1>
      <p className="max-w-xl text-lg mb-10">
        Effortlessly get powerful insights from your Excel files with beautiful,
        interactive charts.
      </p>
      <div className="space-x-4">
        <Link to="/login">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-md transition">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="px-6 py-3 border-2 border-indigo-600 hover:border-indigo-500 rounded-lg font-semibold shadow-md transition">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
