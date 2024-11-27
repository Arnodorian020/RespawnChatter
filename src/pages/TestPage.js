import React, { useState } from 'react';

const TestPage = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Tailwind CSS Test Page
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
            <div className="space-y-4">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                Primary Button
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300">
                Secondary Button
              </button>
            </div>
          </div>

          {/* Toggle Switch Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Toggle Switch</h2>
            <div
              className={`w-16 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${isToggled ? 'bg-green-500' : ''}`}
              onClick={() => setIsToggled(!isToggled)}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isToggled ? 'translate-x-8' : ''}`}
              ></div>
            </div>
            <p className="mt-2 text-gray-600">
              Status: {isToggled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>

        {/* Input and Form Elements */}
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="w-full px-4 py-2 border border-gray-300 rounded">
              <option>Select an option</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Responsive Grid</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-blue-100 p-4 rounded text-center hover:bg-blue-200 transition duration-300"
              >
                Grid Item {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;