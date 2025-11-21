import { forwardRef } from 'react';
import { clsx } from 'clsx';

const FormTextarea = forwardRef(({ 
  label, 
  error, 
  helpText, 
  required = false, 
  className = '',
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'form-input resize-none',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;