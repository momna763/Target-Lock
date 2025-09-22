import React from 'react';

const SimpleTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
        <p className="text-gray-700">
          If you can see this styled box with blue text, Tailwind CSS is working!
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default SimpleTest;
