import React from 'react';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: 'text' | 'textarea' | 'select';
  options?: Array<{ value: string | number; label: string }>;
  required?: boolean;
  rows?: number;
  className?: string;
  monospace?: boolean;
}

/**
 * Reusable form field component that handles different input types
 */
export default function FormField({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  options = [],
  required = true,
  rows = 4,
  className = '',
  monospace = false
}: FormFieldProps) {
  const baseClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500";
  const fullClasses = `${baseClasses} ${monospace ? 'font-mono' : ''} ${className}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className={fullClasses}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={fullClasses}
        >
          {options.length === 0 && <option value="">Select an option</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={fullClasses}
        />
      )}
    </div>
  );
} 