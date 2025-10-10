import React, { useState } from 'react';
import { Music, X, Link as LinkIcon } from 'lucide-react';

const AudioUpload = ({ value, onChange, label = "Audio/Voice" }) => {
  const [audioLink, setAudioLink] = useState(value || '');

  const handleLinkChange = (e) => {
    const link = e.target.value;
    setAudioLink(link);
    onChange(link);
  };

  const handleRemove = () => {
    setAudioLink('');
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              value={audioLink}
              onChange={handleLinkChange}
              placeholder="Enter audio/voice link (e.g., https://...)"
              className="input-field pl-10"
            />
          </div>
          {audioLink && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {audioLink && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 flex items-center gap-3">
            <Music className="h-8 w-8 text-primary-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Audio Link Added</p>
              <p className="text-xs text-gray-600 truncate">{audioLink}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUpload;
