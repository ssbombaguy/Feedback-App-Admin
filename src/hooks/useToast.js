import { useState } from 'react';

export const useToast = (duration = 3000) => {
  const [toast, setToast] = useState(null);

  const showToast = (type) => {
    setToast(type);
    setTimeout(() => setToast(null), duration);
  };

  return { toast, showToast };
};