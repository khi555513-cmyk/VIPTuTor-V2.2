
import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ApiKeyModalProps {
  onSuccess: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSuccess }) => {
  // Since we switched to Puter.js/Claude which doesn't require a user API key,
  // we can auto-complete this modal step or just show a loading state briefly.
  
  useEffect(() => {
    // Automatically trigger success after mount
    onSuccess();
  }, [onSuccess]);

  // Optionally render nothing, or a brief splash screen if desired.
  // Rendering null ensures it doesn't flash.
  return null;
};

export default ApiKeyModal;
