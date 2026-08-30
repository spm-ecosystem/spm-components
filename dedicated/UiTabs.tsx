import React, { useState, useEffect } from 'react';

export interface UiTabItem {
  id: string;
  label: string;
  href?: string;
  badge?: string | number;
  contentHtml?: string;
  active?: boolean;
  disabled?: boolean;
}

export interface UiTabsProps {
  tabs?: UiTabItem[];
  activeParamName?: string;
  variant?: 'underline' | 'pill' | 'boxed';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export function UiTabs({
  tabs = [],
  activeParamName,
  variant = 'underline',
  orientation = 'horizontal',
  className = '',
  style = {},
}: UiTabsProps) {
  const getInitialTabId = (): string => {
    if (activeParamName && typeof window !== 'undefined') {
      try {
        const param = new URLSearchParams(window.location.search).get(activeParamName);
        if (param && tabs.some(t => t.id === param)) {
          return param;
        }
      } catch {
        // ignore
      }
    }
    const explicit = tabs.find(t => t.active);
    if (explicit) return explicit.id;
    const firstEnabled = tabs.find(t => !t.disabled);
    if (firstEnabled) return firstEnabled.id;
    return tabs[0]?.id || '';
  };

  const [activeTabId, setActiveTabId] = useState<string>(getInitialTabId);

  useEffect(() => {
    if (!tabs.some(t => t.id === activeTabId)) {
      setActiveTabId(getInitialTabId());
    }
  }, [tabs, activeParamName]);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleTabClick = (tab: UiTabItem, e: React.MouseEvent) => {
    if (tab.disabled) {
      e.preventDefault();
      return;
    }

    if (tab.contentHtml !== undefined) {
      e.preventDefault();
      setActiveTabId(tab.id);
      if (activeParamName && typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set(activeParamName, tab.id);
          window.history.replaceState(null, '', url.toString());
        } catch {
          // ignore
        }
      }
    } else if (tab.href) {
      // Navigational tab - default browser navigation
    } else {
      e.preventDefault();
      setActiveTabId(tab.id);
      if (activeParamName && typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set(activeParamName, tab.id);
          window.history.replaceState(null, '', url.toString());
        } catch {
          // ignore
        }
      }
    }
  };

  const getTabItemStyle = (tab: UiTabItem, isSelected: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: orientation === 'vertical' ? 'flex-start' : 'center',
      fontFamily: 'inherit',
      fontSize: '13px',
      lineHeight: '1.4',
      textDecoration: 'none',
      border: 'none',
      background: 'transparent',
      cursor: tab.disabled ? 'not-allowed' : 'pointer',
      opacity: tab.disabled ? 0.45 : 1,
      transition: 'all 0.15s ease',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      outline: 'none',
      boxSizing: 'border-box',
    };

    if (variant === 'underline') {
      const isHorizontal = orientation === 'horizontal';
      return {
        ...base,
        padding: '10px 16px',
        fontWeight: isSelected ? 600 : 500,
        color: isSelected
          ? 'var(--spm-text-primary, #f8fafc)'
          : 'var(--spm-text-secondary, #94a3b8)',
        borderBottom: isHorizontal
          ? isSelected
            ? '2px solid var(--spm-accent, #38bdf8)'
            : '2px solid transparent'
          : undefined,
        borderRight: !isHorizontal
          ? isSelected
            ? '2px solid var(--spm-accent, #38bdf8)'
            : '2px solid transparent'
          : undefined,
        marginBottom: isHorizontal ? '-1px' : undefined,
        marginRight: !isHorizontal ? '-1px' : undefined,
      };
    }

    if (variant === 'pill') {
      return {
        ...base,
        padding: '6px 14px',
        borderRadius: '9999px',
        fontWeight: isSelected ? 600 : 500,
        background: isSelected
          ? 'var(--spm-accent, #38bdf8)'
          : 'transparent',
        color: isSelected
          ? 'var(--spm-accent-fg, #ffffff)'
          : 'var(--spm-text-secondary, #94a3b8)',
      };
    }

    if (variant === 'boxed') {
      return {
        ...base,
        padding: '8px 14px',
        borderRadius: 'var(--spm-radius, 6px)',
        fontWeight: isSelected ? 600 : 500,
        background: isSelected
          ? 'var(--spm-bg-surface, #0f172a)'
          : 'transparent',
        color: isSelected
          ? 'var(--spm-text-primary, #f8fafc)'
          : 'var(--spm-text-secondary, #94a3b8)',
        border: isSelected
          ? '1px solid var(--spm-border, #334155)'
          : '1px solid transparent',
        boxShadow: isSelected ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
      };
    }

    return base;
  };

  const getBadgeStyle = (isSelected: boolean): React.CSSProperties => {
    if (variant === 'pill' && isSelected) {
      return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '18px',
        height: '18px',
        padding: '0 6px',
        borderRadius: '10px',
        fontSize: '11px',
        fontWeight: 600,
        marginLeft: '6px',
        background: 'rgba(255, 255, 255, 0.25)',
        color: '#ffffff',
        lineHeight: 1,
      };
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '18px',
      height: '18px',
      padding: '0 6px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 600,
      marginLeft: '6px',
      background: 'var(--spm-bg-tertiary, #334155)',
      color: isSelected
        ? 'var(--spm-text-primary, #f8fafc)'
        : 'var(--spm-text-muted, #94a3b8)',
      border: '1px solid var(--spm-border, #475569)',
      lineHeight: 1,
    };
  };

  return (
    <div
      className={`spm-tabs-container spm-tabs-${variant} spm-tabs-${orientation} ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'row' : 'column',
        gap: orientation === 'vertical' ? '16px' : '12px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        role="tablist"
        aria-orientation={orientation}
        className={`spm-tab-list spm-tab-list-${variant} spm-tab-list-${orientation}`}
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          alignItems: orientation === 'vertical' ? 'stretch' : 'center',
          justifyContent: orientation === 'horizontal' ? 'center' : 'flex-start',
          gap: variant === 'boxed' ? '4px' : (variant === 'pill' ? '6px' : '0'),
          borderBottom: (orientation === 'horizontal' && variant === 'underline')
            ? '1px solid var(--spm-border, #334155)'
            : undefined,
          borderRight: (orientation === 'vertical' && variant === 'underline')
            ? '1px solid var(--spm-border, #334155)'
            : undefined,
          padding: variant === 'boxed' ? '4px' : undefined,
          background: variant === 'boxed' ? 'var(--spm-bg-secondary, #1e293b)' : undefined,
          borderRadius: variant === 'boxed' ? 'var(--spm-radius, 8px)' : undefined,
          overflowX: orientation === 'horizontal' ? 'auto' : undefined,
          boxSizing: 'border-box',
        }}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === activeTabId;
          const commonProps = {
            id: `spm-tab-${tab.id}`,
            role: 'tab' as const,
            'aria-selected': isSelected,
            'aria-controls': tab.contentHtml !== undefined ? `spm-tabpanel-${tab.id}` : undefined,
            'aria-disabled': tab.disabled ? true : undefined,
            tabIndex: tab.disabled ? -1 : (isSelected ? 0 : -1),
            className: `spm-tab-item ${isSelected ? 'spm-tab-active' : ''} ${tab.disabled ? 'spm-tab-disabled' : ''}`.trim(),
            style: getTabItemStyle(tab, isSelected),
            onClick: (e: React.MouseEvent) => handleTabClick(tab, e),
          };

          const innerContent = (
            <>
              <span className="spm-tab-label">{tab.label}</span>
              {tab.badge !== undefined && tab.badge !== null && tab.badge !== '' && (
                <span className="spm-tab-badge" style={getBadgeStyle(isSelected)}>
                  {tab.badge}
                </span>
              )}
            </>
          );

          if (tab.href && tab.contentHtml === undefined) {
            return (
              <a
                key={tab.id}
                href={tab.disabled ? undefined : tab.href}
                {...commonProps}
              >
                {innerContent}
              </a>
            );
          }

          return (
            <button
              type="button"
              key={tab.id}
              disabled={tab.disabled}
              {...commonProps}
            >
              {innerContent}
            </button>
          );
        })}
      </div>

      {activeTab && activeTab.contentHtml !== undefined && (
        <div
          role="tabpanel"
          id={`spm-tabpanel-${activeTab.id}`}
          aria-labelledby={`spm-tab-${activeTab.id}`}
          className="spm-tab-panel"
          style={{
            flex: 1,
            padding: '12px 0',
            color: 'var(--spm-text-primary, #f8fafc)',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          dangerouslySetInnerHTML={{ __html: activeTab.contentHtml }}
        />
      )}
    </div>
  );
}
