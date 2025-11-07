
import React from 'react';

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const percentage = Math.round(value);
  const isAi = percentage >= 50;
  
  const barColor = isAi ? 'bg-red-500' : 'bg-green-500';
  const labelColor = isAi ? 'text-red-400' : 'text-green-400';
  const labelText = isAi ? 'Likely AI-Generated' : 'Likely Real Image';

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-baseline">
        <span className={`text-2xl font-bold ${labelColor}`}>{labelText}</span>
        <span className="text-3xl font-bold text-white">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className={`${barColor} h-4 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
