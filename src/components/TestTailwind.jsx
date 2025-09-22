import React from 'react';

const TestTailwind = () => {
  return (
    <div className="p-8 max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Test Component</div>
          <p className="mt-2 text-gray-500">
            If you can see this styled box with rounded corners and shadow, Tailwind CSS is working correctly!
          </p>
          <div className="mt-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Test Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTailwind;
