import React from 'react';
import { formatNumber } from '../utils';
import { Resource } from '../types';

interface ResourceDisplayProps {
  resource: Resource;
  name: string;
  showEarned?: boolean;
}

export function ResourceDisplay({ resource, name, showEarned = false }: ResourceDisplayProps) {
  const formatSafely = (value: number) => {
    try {
      return formatNumber(value);
    } catch (e) {
      console.error('Error formatting resource value:', value, e);
      return 'Error';
    }
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 mt-8 flex flex-col items-center bg-black/80 backdrop-blur-sm rounded-xl p-4 min-w-[240px] shadow-lg border border-blue-500/20">
      <span className="text-3xl font-bold text-[#00f3ff] [text-shadow:0_0_7px_#00f3ff,0_0_10px_#00f3ff,0_0_21px_#00f3ff]">
        {formatSafely(resource.amount)}
      </span>
      <span className="text-lg text-[#00f3ff] [text-shadow:0_0_7px_#00f3ff] mt-1">
        {name}
      </span>
      {resource.perSecond > 0 && (
        <span className="text-sm text-[#00f3ff] [text-shadow:0_0_7px_#00f3ff] mt-1">
          {formatSafely(resource.perSecond)}/s
        </span>
      )}
      {showEarned && (
        <span className="text-sm text-[#00f3ff] [text-shadow:0_0_7px_#00f3ff] opacity-75 mt-1">
          (Total: {formatSafely(resource.earned)})
        </span>
      )}
    </div>
  );
}