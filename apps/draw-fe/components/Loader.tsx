import React from "react";

const ThreeBodyLoader: React.FC = () => {
  return (
    <div className="relative inline-block h-10 w-10 animate-[spin_2s_linear_infinite]">
      <div className="absolute h-full w-3 left-0 origin-[50%_85%] rotate-[60deg]">
        <div className="absolute bottom-0 left-0 h-0 w-full animate-[wobble_0.8s_infinite_ease-in-out] rounded-full bg-purple-600 pb-full"></div>
      </div>
      <div className="absolute h-full w-3 right-0 origin-[50%_85%] -rotate-[60deg]">
        <div
          className="absolute bottom-0 left-0 h-0 w-full animate-[wobble_0.8s_infinite_ease-in-out] rounded-full bg-purple-600 pb-full"
          style={{ animationDelay: "-0.15s" }}
        ></div>
      </div>
      <div className="absolute bottom-[-5%] left-0 translate-x-[116.666%] w-3">
        <div className="absolute top-0 left-0 h-0 w-full animate-[wobble2_0.8s_infinite_ease-in-out] rounded-full bg-purple-600 pb-full"></div>
      </div>
      <style>
        {`
          @keyframes wobble {
            0%, 100% { transform: translateY(0%) scale(1); opacity: 1; }
            50% { transform: translateY(-66%) scale(0.65); opacity: 0.8; }
          }
          @keyframes wobble2 {
            0%, 100% { transform: translateY(0%) scale(1); opacity: 1; }
            50% { transform: translateY(66%) scale(0.65); opacity: 0.8; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .pb-full { padding-bottom: 100%; }
        `}
      </style>
    </div>
  );
};

export default ThreeBodyLoader;
