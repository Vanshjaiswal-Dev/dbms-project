import React from 'react';

export const FoodCardSkeleton = () => {
  return (
    <div className="card overflow-hidden">
      <div className="h-48 bg-backgroundAlt skeleton"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-backgroundAlt skeleton rounded w-3/4"></div>
        <div className="h-4 bg-backgroundAlt skeleton rounded w-1/2"></div>
        <div className="h-4 bg-backgroundAlt skeleton rounded w-full"></div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-backgroundAlt skeleton rounded w-20"></div>
          <div className="h-9 bg-backgroundAlt skeleton rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export const OrderCardSkeleton = () => {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-backgroundAlt skeleton rounded w-32"></div>
          <div className="h-4 bg-backgroundAlt skeleton rounded w-48"></div>
        </div>
        <div className="h-6 bg-backgroundAlt skeleton rounded w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-backgroundAlt skeleton rounded w-full"></div>
        <div className="h-4 bg-backgroundAlt skeleton rounded w-3/4"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="h-5 bg-backgroundAlt skeleton rounded w-24"></div>
      </div>
    </div>
  );
};
