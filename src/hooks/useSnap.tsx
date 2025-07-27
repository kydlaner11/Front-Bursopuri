import { useEffect } from 'react';

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options?: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }) => void;
    };
    embed?: (
      token: string,
      options: {
        embedId: string;
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }
    ) => void;
  }
}

interface UseSnapOptions {
  token: string;
  mode?: 'popup' | 'embed';
  embedId?: string;
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

const useSnap = ({
  token,
  mode = 'popup',
  embedId = 'snap-container',
  onSuccess,
  onPending,
  onError,
  onClose,
}: UseSnapOptions) => {
  useEffect(() => {
    if (!token) return;

    if (mode === 'popup') {
      // For popup mode, use window.snap.pay
      const interval = setInterval(() => {
        if (typeof window.snap !== 'undefined' && window.snap.pay) {
          clearInterval(interval);
          window.snap.pay(token, {
            onSuccess,
            onPending,
            onError,
            onClose,
          });
        }
      }, 500);
      return () => clearInterval(interval);
    } else {
      // For embed mode, use window.embed
      const interval = setInterval(() => {
        if (typeof window.embed !== 'undefined') {
          clearInterval(interval);
          window.embed(token, {
            embedId,
            onSuccess,
            onPending,
            onError,
            onClose,
          });
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [token, mode, embedId, onSuccess, onPending, onError, onClose]);
};

export default useSnap;
