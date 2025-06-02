import React from 'react';

interface PaymentMethodIconProps {
  method: string;
  className?: string;
}

const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({ method, className = '' }) => {
  const getIcon = () => {
    switch (method.toLowerCase()) {
      case 'paypal':
        return (
          <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M20.067 8.478c.492.315.844.825.844 1.522 0 1.845-1.534 3.373-3.373 3.373h-.674c-.315 0-.674.252-.674.674v2.022c0 .315-.252.674-.674.674h-2.022c-.315 0-.674-.252-.674-.674v-2.022c0-.315-.252-.674-.674-.674h-.674c-1.839 0-3.373-1.528-3.373-3.373 0-.697.315-1.207.844-1.522.315-.252.674-.315 1.013-.315h8.438c.315 0 .674.063 1.013.315zM7.933 15.522c-.492-.315-.844-.825-.844-1.522 0-1.845 1.534-3.373 3.373-3.373h.674c.315 0 .674-.252.674-.674V7.933c0-.315.252-.674.674-.674h2.022c.315 0 .674.252.674.674v2.022c0 .315.252.674.674.674h.674c1.839 0 3.373 1.528 3.373 3.373 0 .697-.315 1.207-.844 1.522-.315.252-.674.315-1.013.315H8.946c-.315 0-.674-.063-1.013-.315z"/>
          </svg>
        );
      case 'credit card':
        return (
          <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"/>
            <path d="M4 0h16v2H4z"/>
            <path d="M4 22h16v2H4z"/>
            <path d="M12 12h6v2h-6z"/>
            <path d="M4 12h6v2H4z"/>
          </svg>
        );
      case 'stripe':
        return (
          <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.987 3.445 1.604 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C6.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {getIcon()}
    </div>
  );
};

export default PaymentMethodIcon; 