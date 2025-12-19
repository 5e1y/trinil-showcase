import { ReactNode, useState } from 'react';

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
}

interface TabListProps {
  children: ReactNode;
}

interface TabTriggerProps {
  value: string;
  children: ReactNode;
}

interface TabContentProps {
  value: string;
  children: ReactNode;
}

const TabContext = React.createContext<{ activeTab: string; setActiveTab: (value: string) => void } | null>(null);

export function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabContext.Provider>
  );
}

export function TabList({ children }: TabListProps) {
  return <div className="flex gap-2 border-b border-neutral-200">{children}</div>;
}

export function TabTrigger({ value, children }: TabTriggerProps) {
  const context = React.useContext(TabContext);
  const isActive = context?.activeTab === value;

  return (
    <button
      onClick={() => context?.setActiveTab(value)}
      className={`px-4 py-2 text-sm border-b-2 transition-colors ${
        isActive
          ? 'border-neutral-900 text-neutral-900 font-medium'
          : 'border-transparent text-neutral-600 hover:text-neutral-900'
      }`}
    >
      {children}
    </button>
  );
}

export function TabContent({ value, children }: TabContentProps) {
  const context = React.useContext(TabContext);
  if (context?.activeTab !== value) return null;

  return <div className="space-y-4">{children}</div>;
}

import React from 'react';

