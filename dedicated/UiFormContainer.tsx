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

export interface FormTab {
  id: string;
  label: string;
  title?: string;
  subTitle?: string;
  submitLabel?: string;
  actionUrl?: string;
  method?: string;
  fields?: FormField[];
  hiddenInputs?: Record<string, string>;
}

export interface UiFormContainerProps {
  title?: string;
  subTitle?: string;
  fields?: FormField[];
  submitLabel?: string;
  actionUrl?: string;
  method?: string;
  hiddenInputs?: Record<string, string>;
  tabs?: FormTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string, tab: FormTab) => void;
  forgotPasswordUrl?: string;
  secondaryLink?: { label: string; url: string };
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  // Controlled form state props
  values?: Record<string, any>;
  onChange?: (fieldId: string, value: any, values: Record<string, any>) => void;
  errors?: Record<string, string>;
  onSubmit?: (values: Record<string, any>, e: React.FormEvent<HTMLFormElement>) => void;

  // Slots & Custom field renderer
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  renderField?: (field: FormField, value: any, onChange: (val: any) => void, error?: string) => React.ReactNode;

  // Layout variants
  layout?: 'card' | 'compact' | 'hero';
}

export function UiFormContainer({
  title: initialTitle,
  subTitle: initialSubTitle,
  fields: initialFields = [],
  submitLabel: initialSubmitLabel = 'Submit',
  actionUrl: initialActionUrl = '',
  method: initialMethod = 'POST',
  hiddenInputs: initialHiddenInputs = {},
  tabs = [],
  activeTabId,
  onTabChange,
  forgotPasswordUrl,
  secondaryLink,
  children,
  className = '',
  style = {},
  values,
  onChange,
  errors = {},
  onSubmit,
  headerSlot,
  footerSlot,
  actionsSlot,
  renderField,
  layout = 'card',
}: UiFormContainerProps) {
  const resolvedTabs: FormTab[] = React.useMemo(() => {
    if (Array.isArray(tabs)) return tabs;
    if (typeof tabs === 'string') {
      try {
        const parsed = JSON.parse(tabs);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [tabs]);

  const [currentTabId, setCurrentTabId] = React.useState<string>(
    activeTabId || (resolvedTabs.length > 0 ? resolvedTabs[0].id : '')
  );

  React.useEffect(() => {
    if (activeTabId && resolvedTabs.some((t) => t.id === activeTabId)) {
      setCurrentTabId(activeTabId);
    } else if (resolvedTabs.length > 0 && !resolvedTabs.some((t) => t.id === currentTabId)) {
      setCurrentTabId(resolvedTabs[0].id);
    }
  }, [activeTabId, resolvedTabs]);

  const activeTab = resolvedTabs.find((t) => t.id === currentTabId) || (resolvedTabs.length > 0 ? resolvedTabs[0] : undefined);

  const title = activeTab?.title !== undefined ? activeTab.title : initialTitle;
  const subTitle = activeTab?.subTitle !== undefined ? activeTab.subTitle : initialSubTitle;
  const fields = activeTab?.fields !== undefined ? activeTab.fields : initialFields;
  const submitLabel = activeTab?.submitLabel !== undefined ? activeTab.submitLabel : initialSubmitLabel;
  const actionUrl = activeTab?.actionUrl !== undefined ? activeTab.actionUrl : initialActionUrl;
  const method = activeTab?.method !== undefined ? activeTab.method : initialMethod;
  const hiddenInputs = activeTab?.hiddenInputs !== undefined ? activeTab.hiddenInputs : initialHiddenInputs;

  // Internal form state for uncontrolled mode
  const [internalValues, setInternalValues] = React.useState<Record<string, any>>({});

  const handleFieldChange = (fieldId: string, val: any) => {
    const nextValues = { ...internalValues, ...(values || {}), [fieldId]: val };
    setInternalValues(nextValues);
    if (onChange) {
      onChange(fieldId, val, nextValues);
    }
  };

  const getFieldValue = (field: FormField) => {
    if (values && values[field.id] !== undefined) {
      return values[field.id];
    }
    if (internalValues[field.id] !== undefined) {
      return internalValues[field.id];
    }
    return field.defaultValue ?? (field.type === 'checkbox' ? false : '');
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const currentValues: Record<string, any> = {};
    fields.forEach((f) => {
      currentValues[f.id] = getFieldValue(f);
    });
    const mergedValues = { ...internalValues, ...(values || {}), ...currentValues };
    if (onSubmit) {
      e.preventDefault();
      onSubmit(mergedValues, e);
    }
  };

  const layoutStyles: React.CSSProperties = React.useMemo(() => {
    switch (layout) {
      case 'compact':
        return {
          padding: '16px',
          maxWidth: '420px',
          borderRadius: 'var(--spm-radius, 6px)',
        };
      case 'hero':
        return {
          padding: '40px 32px',
          maxWidth: '720px',
          borderRadius: 'var(--spm-radius, 12px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.35)',
        };
      case 'card':
      default:
        return {
          padding: '24px',
          maxWidth: '600px',
          borderRadius: 'var(--spm-radius, 8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        };
    }
  }, [layout]);

  return (
    <div
      className={`spm-form-container spm-form-${layout} ${className}`.trim()}
      style={{
        backgroundColor: 'var(--spm-form-bg, var(--spm-bg-surface, #1e293b))',
        color: 'var(--spm-text-primary, #f8fafc)',
        border: '1px solid var(--spm-border, #334155)',
        width: '100%',
        boxSizing: 'border-box',
        ...layoutStyles,
        ...style,
      }}
    >
      {headerSlot}

      {resolvedTabs && resolvedTabs.length > 0 && (
        <div
          className="spm-form-tabs"
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '20px',
            backgroundColor: 'var(--spm-input-bg, var(--spm-bg-primary, #0f172a))',
            padding: '4px',
            borderRadius: 'var(--spm-radius, 6px)',
            border: '1px solid var(--spm-border, #334155)',
          }}
        >
          {resolvedTabs.map((t) => {
            const isActive = t.id === (activeTab?.id || currentTabId);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setCurrentTabId(t.id);
                  if (onTabChange) onTabChange(t.id, t);
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: layout === 'compact' ? '12px' : '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--spm-text-primary, #ffffff)' : 'var(--spm-text-muted, #94a3b8)',
                  backgroundColor: isActive ? 'var(--spm-form-bg, var(--spm-bg-surface, #1e293b))' : 'transparent',
                  border: isActive ? '1px solid var(--spm-border, #334155)' : '1px solid transparent',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {title && (
        <h2 style={{ margin: '0 0 4px 0', fontSize: layout === 'hero' ? '24px' : layout === 'compact' ? '18px' : '20px', fontWeight: 600 }}>
          {title}
        </h2>
      )}
      {subTitle && (
        <p style={{ margin: '0 0 20px 0', fontSize: layout === 'compact' ? '12px' : '14px', color: 'var(--spm-text-muted, #94a3b8)' }}>
          {subTitle}
        </p>
      )}

      <form action={actionUrl} method={method} onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: layout === 'compact' ? '12px' : '16px' }}>
        {Object.entries(hiddenInputs).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}

        {fields.map((field) => {
          const val = getFieldValue(field);
          const error = errors[field.id];

          if (renderField) {
            return (
              <React.Fragment key={field.id}>
                {renderField(field, val, (v) => handleFieldChange(field.id, v), error)}
              </React.Fragment>
            );
          }

          const inputBorderStyle = error
            ? '1px solid var(--spm-error, #ef4444)'
            : '1px solid var(--spm-border, #334155)';

          return (
            <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {field.type !== 'checkbox' && (
                <label htmlFor={field.id} style={{ fontSize: layout === 'compact' ? '12px' : '13px', fontWeight: 500 }}>
                  {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
              )}

              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  value={String(val ?? '')}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  required={field.required}
                  rows={layout === 'compact' ? 3 : 4}
                  style={{
                    padding: layout === 'compact' ? '6px 10px' : '8px 12px',
                    backgroundColor: 'var(--spm-input-bg, var(--spm-bg-primary, #0f172a))',
                    color: 'var(--spm-text-primary, #f8fafc)',
                    border: inputBorderStyle,
                    borderRadius: 'var(--spm-radius, 6px)',
                    fontSize: layout === 'compact' ? '13px' : '14px',
                    fontFamily: 'inherit',
                  }}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.id}
                  name={field.id}
                  value={String(val ?? '')}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  required={field.required}
                  style={{
                    padding: layout === 'compact' ? '6px 10px' : '8px 12px',
                    backgroundColor: 'var(--spm-input-bg, var(--spm-bg-primary, #0f172a))',
                    color: 'var(--spm-text-primary, #f8fafc)',
                    border: inputBorderStyle,
                    borderRadius: 'var(--spm-radius, 6px)',
                    fontSize: layout === 'compact' ? '13px' : '14px',
                  }}
                >
                  {(field.options || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: layout === 'compact' ? '13px' : '14px' }}>
                  <input
                    type="checkbox"
                    id={field.id}
                    name={field.id}
                    checked={Boolean(val)}
                    onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                  />
                  {field.label}
                </label>
              ) : (
                <input
                  type={field.type || 'text'}
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  value={String(val ?? '')}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  required={field.required}
                  style={{
                    padding: layout === 'compact' ? '6px 10px' : '8px 12px',
                    backgroundColor: 'var(--spm-input-bg, var(--spm-bg-primary, #0f172a))',
                    color: 'var(--spm-text-primary, #f8fafc)',
                    border: inputBorderStyle,
                    borderRadius: 'var(--spm-radius, 6px)',
                    fontSize: layout === 'compact' ? '13px' : '14px',
                  }}
                />
              )}

              {error && (
                <span style={{ color: 'var(--spm-error, #ef4444)', fontSize: '12px', marginTop: '2px' }}>
                  {error}
                </span>
              )}
            </div>
          );
        })}

        {children}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            style={{
              padding: layout === 'compact' ? '8px 14px' : '10px 18px',
              backgroundColor: 'var(--spm-accent, #ffffff)',
              color: 'var(--spm-accent-fg, #000000)',
              border: 'none',
              borderRadius: 'var(--spm-radius, 6px)',
              fontSize: layout === 'compact' ? '13px' : '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
            }}
          >
            {submitLabel}
          </button>
          {actionsSlot}
        </div>

        {(forgotPasswordUrl || secondaryLink) && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <a
              href={secondaryLink?.url || forgotPasswordUrl}
              style={{
                fontSize: layout === 'compact' ? '12px' : '13px',
                color: 'var(--spm-text-muted, #a1a1aa)',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--spm-text-primary, #ffffff)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--spm-text-muted, #a1a1aa)')}
            >
              {secondaryLink?.label || 'Forgot Password?'}
            </a>
          </div>
        )}
      </form>

      {footerSlot}
    </div>
  );
}
