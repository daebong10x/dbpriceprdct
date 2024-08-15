import React, { useState } from 'react';

const Toggle = ({ label }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label 
      className="flex items-center cursor-pointer" 
      style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px' }} // 배경 색과 패딩, 둥근 모서리 추가
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          aria-checked={isChecked}
          aria-label={label}
        />
        <div className={`block w-14 h-8 rounded-full ${isChecked ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isChecked ? 'transform translate-x-6' : ''}`}></div>
      </div>
      <div className="ml-3 text-gray-700 font-medium">
        {label}
      </div>
    </label>
  );
};

export default Toggle;
