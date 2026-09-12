import { useState } from 'react';

export interface UiSearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  submitUrl?: string;
  queryParamName?: string;
  method?: 'get' | 'post' | 'GET' | 'POST';
  hiddenFields?: { name: string; value: string }[] | string;
  className?: string;
  style?: React.CSSProperties;
  onSearch?: (value: string) => void;
}

function parseUrlAndQuery(url: string | undefined): { actionUrl: string; queryFields: { name: string; value: string }[] } {
  if (!url) return { actionUrl: '', queryFields: [] };

  const queryFields: { name: string; value: string }[] = [];
  const qIndex = url.indexOf('?');

  if (qIndex === -1) {
    return { actionUrl: url, queryFields: [] };
  }

  const actionUrl = url.substring(0, qIndex);
  const queryString = url.substring(qIndex + 1);

  if (queryString) {
    const params = new URLSearchParams(queryString);
    params.forEach((val, name) => {
      queryFields.push({ name, value: val });
    });
  }

  return { actionUrl, queryFields };
}

export function UiSearchBar({
  placeholder = 'Search…',
  defaultValue = '',
  submitUrl,
  queryParamName = 'q',
  method = 'GET',
  hiddenFields = [],
  className = '',
  style = {},
  onSearch,
}: UiSearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  const { actionUrl, queryFields } = parseUrlAndQuery(submitUrl);

  const handleSubmit = (e: React.FormEvent) => {
    if (onSearch) {
      e.preventDefault();
      onSearch(value);
    } else if (submitUrl) {
      // Allow browser to perform native form submission to submitUrl
    } else {
      e.preventDefault();
      console.warn('[UiSearchBar] Form submitted without onSearch handler or submitUrl prop.');
    }
  };

  let parsedFields: { name: string; value: string }[] = [];
  if (typeof hiddenFields === 'string') {
    try {
      parsedFields = JSON.parse(hiddenFields);
    } catch (err) {
      console.warn('[UiSearchBar] Failed to parse hiddenFields JSON string:', err);
      parsedFields = [];
    }
  } else if (Array.isArray(hiddenFields)) {
    parsedFields = hiddenFields;
  }

  const fieldMap = new Map<string, string>();
  queryFields.forEach(f => fieldMap.set(f.name, f.value));
  parsedFields.forEach(f => fieldMap.set(f.name, f.value));
  const allHiddenFields = Array.from(fieldMap.entries()).map(([name, value]) => ({ name, value }));

  return (
    <form
      action={actionUrl}
      method={method}
      onSubmit={handleSubmit}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 'var(--spm-container-max-width, 100%)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {allHiddenFields.map((field, idx) => (
        <input key={idx} type="hidden" name={field.name} value={field.value} />
      ))}

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spm-search-gap, 6px)',
          background: 'var(--spm-bg-secondary)',
          border: `1px solid ${focused ? 'var(--spm-accent)' : 'var(--spm-border)'}`,
          borderRadius: 'var(--spm-card-radius, var(--spm-radius, 6px))',
          padding: 'var(--spm-search-padding, 0 8px)',
          transition: 'border-color 0.15s',
          minWidth: 0,
        }}
      >
        <button
          type="submit"
          style={{
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            color: focused ? 'var(--spm-accent)' : 'var(--spm-text-muted)',
            transition: 'color 0.15s',
          }}
          aria-label="Search"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        <input
          type="text"
          name={queryParamName}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--spm-text-primary)',
            fontSize: '12px',
            padding: 'var(--spm-input-padding, 8px 0)',
            fontFamily: 'inherit',
          }}
        />

        {value && (
          <button
            type="button"
            onClick={() => setValue('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--spm-text-muted)',
              padding: '0',
              lineHeight: 1,
              fontSize: '11px',
              flexShrink: 0,
            }}
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
