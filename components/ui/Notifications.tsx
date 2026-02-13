
"use client";
import React from 'react';
import { useEffect } from 'react';

import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Notifications() {
  const { notifications, removeNotification } = useAppStore()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "max-w-sm rounded-lg border p-4 shadow-lg",
            "animate-in slide-in-from-right-full",
            notification.type === 'success' && "border-green-200 bg-green-50 text-green-800",
            notification.type === 'error' && "border-red-200 bg-red-50 text-red-800",
            notification.type === 'warning' && "border-yellow-200 bg-yellow-50 text-yellow-800",
            notification.type === 'info' && "border-blue-200 bg-blue-50 text-blue-800"
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-sm opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}