import React, { ReactNode, useState } from 'react';
import { Button } from './Button';

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface TabListProps {
  children: ReactNode;
  className?: string;
}

interface TabTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const TabContext = React.createContext<{ activeTab: string; setActiveTab: (value: string) => void } | null>(null);

export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabContext.Provider>
  );
}

export function TabList({ children, className = '' }: TabListProps) {
  return <div className={`flex gap-2 border-b border-neutral-200 ${className}`}>{children}</div>;
}

export function TabTrigger({ value, children, className = '' }: TabTriggerProps) {
  const context = React.useContext(TabContext);
  const isActive = context?.activeTab === value;

  return (
    <Button
      onClick={() => context?.setActiveTab(value)}
      variant={isActive ? 'secondary' : 'secondary'}
      size="sm"
      className={`border-b-2 rounded-none px-4 py-2 ${
        isActive
          ? 'border-neutral-900 text-neutral-900 font-medium'
          : 'border-transparent text-neutral-600'
      } ${className}`}
    >
      {children}
    </Button>
  );
}

export function TabContent({ value, children, className = '' }: TabContentProps) {
  const context = React.useContext(TabContext);
  if (context?.activeTab !== value) return null;

  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

