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
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-2 min-w-[120px]">
      <span className="text-lg font-bold text-white">{formatNumber(resource.amount)}</span>
      <span className="text-xs text-white/80">{name}</span>
      {resource.perSecond > 0 && (
        <span className="text-xs text-white/60">
          {formatNumber(resource.perSecond)}/s
        </span>
      )}
      {showEarned && (
        <span className="text-xs text-white/60">
          (Total: {formatNumber(resource.earned)})
        </span>
      )}
    </div>
  );
}