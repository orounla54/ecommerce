import { AlertTriangle, CheckCircle, Info, AlertOctagon } from 'lucide-react';

interface MessageProps {
  variant?: 'success' | 'danger' | 'info' | 'warning';
  children: React.ReactNode;
}

const Message = ({ variant = 'info', children }: MessageProps) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'danger':
        return <AlertOctagon size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'danger':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div
      className={`flex items-center p-4 mb-4 border rounded-md ${getStyles()}`}
      role="alert"
    >
      <div className="mr-2 flex-shrink-0">{getIcon()}</div>
      <div>{children}</div>
    </div>
  );
};

export default Message;