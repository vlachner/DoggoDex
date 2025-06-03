import { AlertTriangle } from "lucide-react";
import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 my-4">
      <AlertTriangle className="mr-2" size={20} />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
