"use client";

import { useState } from "react";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  min?: string;
  className?: string;
}

export default function DatePicker({
  label,
  value,
  onChange,
  min,
  className = "",
}: DatePickerProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
