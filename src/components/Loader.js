import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = "Loading..." }) => (
  <div className="flex justify-center items-center h-full">
    <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
    <span className="ml-4 text-gray-300 text-xl">{message}</span>
  </div>
);

export default Loader;
