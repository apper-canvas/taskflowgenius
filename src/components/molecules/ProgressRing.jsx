import React from 'react';

const ProgressRing = ({ percentage, size = 16, strokeWidth = 2, className = '' }) => {
    const radius = 18 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative w-${size} h-${size}`}>
            <svg className={`w-full h-full transform -rotate-90`} viewBox="0 0 36 36">
                <path
                    className="text-surface-200"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    d={`M18 2.0845 a ${radius} ${radius} 0 0 1 0 ${2 * radius} a ${radius} ${radius} 0 0 1 0 -${2 * radius}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />
                <path
                    className="text-primary-600"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    strokeDashoffset={offset}
                    d={`M18 2.0845 a ${radius} ${radius} 0 0 1 0 ${2 * radius} a ${radius} ${radius} 0 0 1 0 -${2 * radius}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold text-surface-900 ${className}`}>
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
};

export default ProgressRing;