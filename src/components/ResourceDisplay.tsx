import React from 'react';
import { formatNumber } from '../utils';
import { Resource } from '../types';

interface ResourceDisplayProps {
  resource: Resource;
  name: string;
  showEarned?: boolean;
}

export function ResourceDisplay({ resource, name, showEarned = false }: ResourceDisplayProps) {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 flex flex-col items-center bg-black rounded-lg p-2 min-w-[120px] shadow-lg">
      <span className="text-lg font-bold text-[#00f3ff] [text-shadow:0_0_7px_#00f3ff,0_0_10px_#00f3ff,0_0_21px_#00f3ff]">
        {formatNumber(resource.amount)}
      </span>
      <span className="text-xs text-[#00f3ff] [text-shadow:0_0_7px_#00f3ff]">
        {name}
      </span>
      {resource.perSecond > 0 && (
        <span className="text-xs text-[#00f3ff] [text-shadow:0_0_7px_#00f3ff]">
          {formatNumber(resource.perSecond)}/s
        </span>
      )}
      {showEarned && (
        <span className="text-xs text-[#00f3ff] [text-shadow:0_0_7px_#00f3ff]">
          (Total: {formatNumber(resource.earned)})
        </span>
      )}
    </div>
  );
}