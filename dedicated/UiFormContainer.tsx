import React from 'react';

export interface FormField {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'password' | 'email' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  defaultValue?: string | boolean;
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
}

export interface UiFormContainerProps {
  title?: string;
  subTitle?: string;
  fields?: FormField[];
  submitLabel?: string;
  actionUrl?: string;
  method?: string;
  hiddenInputs?: Record<string, string>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function UiFormContainer({
  title,
  subTitle,
  fields = [],
  submitLabel = 'Submit',
  actionUrl = '',
  method = 'POST',
  hiddenInputs = {},
  children,
  className = '',
  style = {},
}: UiFormContainerProps) {
  return (
    <div
      className={`spm-form-container ${className}`}
      style={{
        backgroundColor: 'var(--spm-bg-surface, #1e293b)',
        color: 'var(--spm-text-primary, #f8fafc)',
        borderRadius: 'var(--spm-radius, 8px)',
        border: '1px solid var(--spm-border, #334155)',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {title && (
        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 600 }}>{title}</h2>
      )}
      {subTitle && (
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--spm-text-muted, #94a3b8)' }}>{subTitle}</p>
      )}

      <form action={actionUrl} method={method} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(hiddenInputs).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}

        {fields.map((field) => (
          <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {field.type !== 'checkbox' && (
              <label htmlFor={field.id} style={{ fontSize: '13px', fontWeight: 500 }}>
                {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
            )}

            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                name={field.id}
                placeholder={field.placeholder}
                defaultValue={String(field.defaultValue || '')}
                required={field.required}
                rows={4}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--spm-bg-primary, #0f172a)',
                  color: 'var(--spm-text-primary, #f8fafc)',
                  border: '1px solid var(--spm-border, #334155)',
                  borderRadius: 'var(--spm-radius, 6px)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                }}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                defaultValue={String(field.defaultValue || '')}
                required={field.required}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--spm-bg-primary, #0f172a)',
                  color: 'var(--spm-text-primary, #f8fafc)',
                  border: '1px solid var(--spm-border, #334155)',
                  borderRadius: 'var(--spm-radius, 6px)',
                  fontSize: '14px',
                }}
              >
                {(field.options || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  id={field.id}
                  name={field.id}
                  defaultChecked={Boolean(field.defaultValue)}
                />
                {field.label}
              </label>
            ) : (
              <input
                type={field.type || 'text'}
                id={field.id}
                name={field.id}
                placeholder={field.placeholder}
                defaultValue={String(field.defaultValue || '')}
                required={field.required}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--spm-bg-primary, #0f172a)',
                  color: 'var(--spm-text-primary, #f8fafc)',
                  border: '1px solid var(--spm-border, #334155)',
                  borderRadius: 'var(--spm-radius, 6px)',
                  fontSize: '14px',
                }}
              />
            )}
          </div>
        ))}

        {children}

        <button
          type="submit"
          style={{
            marginTop: '8px',
            padding: '10px 18px',
            backgroundColor: 'var(--spm-accent, #3b82f6)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--spm-radius, 6px)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
