"use client";
import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Code, 
  Layout, 
  Database, 
  Settings, 
  Users, 
  Globe, 
  BookOpen,
  ChevronDown,
  ChevronRight,
  Eye,
  Download,
  LucideIcon
} from 'lucide-react';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  key: TabKey;
  color: string;
}

interface DocumentSection {
  id: string;
  title: string;
  status: 'available' | 'coming-soon' | 'beta';
  statusColor: string;
  items: string[];
}

interface ExpandedSections {
  [key: string]: boolean;
}

type TabKey = 'components' | 'api' | 'templates' | 'examples' | 'config' | 'auth' | 'deploy' | 'guides';

interface DocumentationMobileUIProps {
  className?: string;
}

const DocumentationMobileUI: React.FC<DocumentationMobileUIProps> = ({ className = '' }) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});
  const [activeTab, setActiveTab] = useState<TabKey>('components');

  const toggleSection = (sectionId: string): void => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleTabClick = (tabKey: TabKey): void => {
    setActiveTab(tabKey);
  };

  const quickActions: QuickAction[] = [
    { icon: FileText, label: 'Components', key: 'components' as const, color: 'bg-blue-500' },
    { icon: Code, label: 'API', key: 'api' as const, color: 'bg-purple-500' },
    { icon: Layout, label: 'Templates', key: 'templates' as const, color: 'bg-green-500' },
    { icon: Database, label: 'Examples', key: 'examples' as const, color: 'bg-orange-500' },
    { icon: Settings, label: 'Config', key: 'config' as const, color: 'bg-gray-500' },
    { icon: Users, label: 'Auth', key: 'auth' as const, color: 'bg-red-500' },
    { icon: Globe, label: 'Deploy', key: 'deploy' as const, color: 'bg-cyan-500' },
    { icon: BookOpen, label: 'Guides', key: 'guides' as const, color: 'bg-indigo-500' }
  ];

  const documentSections: DocumentSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started + Installation + Quick Setup',
      status: 'available',
      statusColor: 'bg-green-500',
      items: ['Installation', 'Project Structure', 'First Component']
    },
    {
      id: 'components',
      title: 'UI Components + Sidebar + Forms',
      status: 'available', 
      statusColor: 'bg-green-500',
      items: ['Sidebar', 'Forms', 'Cards', 'Buttons']
    },
    {
      id: 'layouts',
      title: 'Layouts + Dashboard + Login',
      status: 'available',
      statusColor: 'bg-green-500', 
      items: ['Dashboard Layout', 'Login Forms', 'Page Templates']
    },
    {
      id: 'advanced',
      title: 'Advanced + API + Integration',
      status: 'coming-soon',
      statusColor: 'bg-orange-500',
      items: ['API Reference', 'Custom Hooks', 'Integrations']
    },
    {
      id: 'examples',
      title: 'Examples + Templates + Demos',
      status: 'beta',
      statusColor: 'bg-blue-500',
      items: ['Demo Projects', 'Code Examples', 'Best Practices']
    }
  ];

  return (
    <div className={`max-w-sm mx-auto bg-white min-h-screen ${className}`}>
      {/* Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Documentation</h1>
                <p className="text-blue-100 text-sm">v1.0.0</p>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search components, guides..."
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 py-6 bg-gray-50">
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action: QuickAction) => (
            <button
              key={action.key}
              onClick={() => handleTabClick(action.key)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                activeTab === action.key 
                  ? 'bg-white shadow-md scale-105' 
                  : 'bg-white hover:shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Documentation Sections</h2>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Document Sections List */}
      <div className="px-4 space-y-3">
        {documentSections.map((section: DocumentSection) => (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {section.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${section.statusColor}`}>
                    {section.status === 'available' && 'Available'}
                    {section.status === 'coming-soon' && 'Coming Soon'}
                    {section.status === 'beta' && 'Beta'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle view action
                  }}
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle download action
                  }}
                >
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
                <div className="pointer-events-none">
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
            
            {expandedSections[section.id] && (
              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                <div className="space-y-2">
                  {section.items.map((item: string, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">{item}</span>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="px-4 py-6 mt-8">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
            <BookOpen className="w-4 h-4" />
            <span>View Docs</span>
          </button>
          <button className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationMobileUI;