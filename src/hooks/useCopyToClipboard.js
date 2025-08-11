import { useState } from 'react';

export function useCopyToClipboard() {
  const [copyOk, setCopyOk] = useState(false);

  const copyToClipboard = async (text) => {
    if (!text) return false;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1600);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };

  return [copyOk, copyToClipboard];
}
