'use client';

import { useState, useEffect } from 'react';

// Three-Audience Workflow Interfaces
interface WorkflowSystem {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'planning' | 'complete';
  priority: 'high' | 'medium' | 'low';
  components: number;
  lastUpdated: string;
}

interface AudienceDocument {
  type: 'conversational' | 'planning' | 'implementation';
  title: string;
  description: string;
  size: string;
  lastGenerated: string;
  content?: string;
}

interface LibraryData {
  files: Array<{
    name: string;
    path: string;
    type: 'yaml' | 'markdown' | 'json';
    category: string;
    size?: string;
  }>;
  content: Record<string, string>;
}

// Available workflow systems (only show systems that actually exist)
const WORKFLOW_SYSTEMS: WorkflowSystem[] = [
  {
    id: 'activity-interface',
    name: 'Activity Interface System',
    description: 'Hospital exploration and dialogue system components',
    status: 'active',
    priority: 'high',
    components: 4,
    lastUpdated: '2024-01-20'
  },
  {
    id: 'mentors-interface',
    name: 'Mentor Relationship System',
    description: 'Complete mentor character system with relationship progression, dialogue, and aptitude bonuses',
    status: 'active',
    priority: 'high',
    components: 4,
    lastUpdated: '2024-01-20'
  },
  {
    id: 'tutorial-flows',
    name: 'Tutorial Flow and Dialogue System',
    description: 'Structured tutorial sequences, dialogue examples, and narrative transitions',
    status: 'active',
    priority: 'high',
    components: 5,
    lastUpdated: '2024-01-20'
  }
];

// Narrative workflow focus areas
const NARRATIVE_FOCUS_AREAS = [
  {
    id: 'character',
    name: 'Character Focus',
    description: 'Character arcs, personalities, dialogue systems',
    icon: '🎭',
    systems: ['pico-character', 'amara-narrative', 'mentors']
  },
  {
    id: 'world',
    name: 'World Building',
    description: 'Medical physics setting, constellation lore, environment',
    icon: '🌍',
    systems: ['constellation-phenomenon', 'visual-design', 'game-constants']
  },
  {
    id: 'plot',
    name: 'Plot & Progression',
    description: 'Story progression, tutorial narrative, journal system',
    icon: '📖',
    systems: ['journal-system', 'activity-framework', 'tutorial-design']
  },
  {
    id: 'all',
    name: 'Comprehensive',
    description: 'Complete narrative documentation across all systems',
    icon: '📚',
    systems: []
  }
];

export default function ThreeAudienceWorkflow() {
  const [selectedSystem, setSelectedSystem] = useState<string>('activity-interface');
  const [audienceDocuments, setAudienceDocuments] = useState<AudienceDocument[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<'conversational' | 'planning' | 'implementation'>('conversational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflow' | 'library' | 'status'>('workflow');
  
  // Enhanced workflow state
  const [includeArchives, setIncludeArchives] = useState(false);
  const [copyToPath, setCopyToPath] = useState('');
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  
  // Narrative workflow state
  const [workflowMode, setWorkflowMode] = useState<'technical' | 'narrative'>('technical');
  const [selectedNarrativeFocus, setSelectedNarrativeFocus] = useState<string>('all');
  const [narrativeExportReferences, setNarrativeExportReferences] = useState(true);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Library state
  const [libraryData, setLibraryData] = useState<LibraryData | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAudienceDocuments();
    loadLibraryData();
  }, [selectedSystem]);

  const loadAudienceDocuments = async () => {
    // Simulate loading the three audience documents
    const docs: AudienceDocument[] = [
      {
        type: 'conversational',
        title: 'Design Discussion Context',
        description: 'Perfect for Luke + Zach design discussions',
        size: '6.2KB',
        lastGenerated: '2 minutes ago',
        content: 'Loading...'
      },
      {
        type: 'planning', 
        title: 'Development Plan',
        description: 'Triage-style implementation roadmap for Luke',
        size: '9.6KB',
        lastGenerated: '2 minutes ago',
        content: 'Loading...'
      },
      {
        type: 'implementation',
        title: 'LLM Implementation Context',
        description: 'Focused technical context for Claude collaboration',
        size: '10.0KB',
        lastGenerated: '2 minutes ago',
        content: 'Loading...'
      }
    ];
    setAudienceDocuments(docs);
  };

  const loadLibraryData = async () => {
    try {
      const response = await fetch('/api/library-data');
      if (response.ok) {
        const data = await response.json();
        setLibraryData(data);
      }
    } catch (error) {
      console.error('Error loading library data:', error);
    }
  };

  const generateWorkflowDocuments = async () => {
    setIsGenerating(true);
    try {
      let response, result;
      
      if (workflowMode === 'narrative') {
        // Generate narrative workflow documentation
        const narrativeRequestBody = {
          focusArea: selectedNarrativeFocus,
          includeArchives,
          exportReferences: narrativeExportReferences
        };
        
        response = await fetch('/api/narrative-workflow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(narrativeRequestBody)
        });
        
        result = await response.json();
        
        if (result.success && result.files) {
          // Convert narrative results to audience document format
          const focusLabel = NARRATIVE_FOCUS_AREAS.find(f => f.id === selectedNarrativeFocus)?.name || selectedNarrativeFocus;
          const enhancedLabel = result.includeArchives ? ' (Enhanced)' : '';
          
          const updatedDocs: AudienceDocument[] = [
            {
              type: 'conversational',
              title: `🎭 Narrative Context${enhancedLabel}`,
              description: `Story development guide for ${focusLabel.toLowerCase()}`,
              size: `${Math.round(result.files.narrative_context.length / 1024 * 10) / 10}KB`,
              lastGenerated: 'Just now',
              content: result.files.narrative_context
            },
            {
              type: 'planning',
              title: `🛠️ Lore Implementation${enhancedLabel}`, 
              description: `Technical integration guide for ${focusLabel.toLowerCase()}`,
              size: `${Math.round(result.files.lore_implementation.length / 1024 * 10) / 10}KB`,
              lastGenerated: 'Just now',
              content: result.files.lore_implementation
            },
            {
              type: 'implementation',
              title: `🧠 Story Continuity${enhancedLabel}`,
              description: `Complete story bible for ${focusLabel.toLowerCase()}`,
              size: `${Math.round(result.files.story_continuity.length / 1024 * 10) / 10}KB`,
              lastGenerated: 'Just now',
              content: result.files.story_continuity
            }
          ];
          setAudienceDocuments(updatedDocs);
          
          let successMessage = `🎭 Narrative workflow generated successfully for ${focusLabel}!`;
          if (result.includeArchives) {
            successMessage += ` Enhanced mode included comprehensive narrative content.`;
          }
          if (result.referencesInfo?.length > 0) {
            successMessage += ` ${result.referencesInfo.length} reference files exported.`;
          }
          showToast(successMessage, 'success');
        } else {
          throw new Error(result.error || 'Failed to generate narrative workflow');
        }
      } else {
        // Generate technical workflow documentation (existing functionality)
        const requestBody: { 
        system: string; 
        includeArchives?: boolean; 
        copyTo?: string; 
      } = { system: selectedSystem };
        
        if (includeArchives) {
          requestBody.includeArchives = true;
        }
        
        if (copyToPath.trim()) {
          requestBody.copyTo = copyToPath.trim();
        }
        
        response = await fetch('/api/workflow-export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        result = await response.json();
      
      if (result.success && result.documents) {
        // Update documents with actual content
        const enhancedLabel = result.enhanced ? ' (Enhanced)' : '';
        const updatedDocs: AudienceDocument[] = [
          {
            type: 'conversational',
            title: `Design Discussion Context${enhancedLabel}`,
            description: 'Perfect for Luke + Zach design discussions',
            size: `${Math.round(result.documents.conversational.length / 1024 * 10) / 10}KB`,
            lastGenerated: 'Just now',
            content: result.documents.conversational
          },
          {
            type: 'planning',
            title: `Development Plan${enhancedLabel}`, 
            description: 'Triage-style implementation roadmap for Luke',
            size: `${Math.round(result.documents.planning.length / 1024 * 10) / 10}KB`,
            lastGenerated: 'Just now',
            content: result.documents.planning
          },
          {
            type: 'implementation',
            title: `LLM Implementation Context${enhancedLabel}`,
            description: result.enhanced 
              ? 'Comprehensive context with all archives & game systems'
              : 'Focused technical context for Claude collaboration',
            size: `${Math.round(result.documents.implementation.length / 1024 * 10) / 10}KB`,
            lastGenerated: 'Just now',
            content: result.documents.implementation
          }
        ];
        setAudienceDocuments(updatedDocs);
        
        // Show success toast with enhanced features
        let successMessage = '🎉 Workflow documentation generated successfully!';
        if (result.enhanced) {
          successMessage += ` Enhanced mode included ${result.documents.implementation.length > 15000 ? '19+ archived documents' : 'comprehensive context'}.`;
        }
        if (result.copiedTo) {
          successMessage += ` Files copied to ${result.copiedTo}.`;
        }
        showToast(successMessage, 'success');
        } else {
          // Handle error case
          const errorMessage = `❌ Error generating workflow documentation:\n\n${result.error}\n\nThis usually means the system YAML file doesn't exist yet. Available systems: activity-interface, mentors-interface, tutorial-flows\n\nTo fix this, either:\n1. Select one of the available systems (which work)\n2. Create the missing YAML file in data/interfaces/`;
          
          const errorDocs: AudienceDocument[] = audienceDocuments.map(doc => ({
            ...doc,
            content: errorMessage,
            lastGenerated: 'Error - just now'
          }));
          setAudienceDocuments(errorDocs);
        }
      }
    } catch (error) {
      console.error('Error generating workflow documents:', error);
      const errorMessage = `❌ Network error generating workflow documentation:\n\n${error}\n\nPlease check that the development server is running properly.`;
      const errorDocs: AudienceDocument[] = audienceDocuments.map(doc => ({
        ...doc,
        content: errorMessage,
        lastGenerated: 'Error - just now'
      }));
      setAudienceDocuments(errorDocs);
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanupWorkflowDirectory = async () => {
    setIsCleaningUp(true);
    try {
      const cleanupPath = copyToPath.trim() || '../rogue-resident-local/docs/workflow/';
      
      const response = await fetch('/api/cleanup-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directory: cleanupPath })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast(`🧹 Cleaned up ${result.filesRemoved || 0} files from ${cleanupPath}`, 'success');
      } else {
        showToast(`❌ Cleanup failed: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      showToast('❌ Network error during cleanup', 'error');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const getAudienceIcon = (type: string) => {
    switch (type) {
      case 'conversational': return '🗣️';
      case 'planning': return '📋';
      case 'implementation': return '🤖';
      default: return '📄';
    }
  };

  const getAudienceColor = (type: string) => {
    switch (type) {
      case 'conversational': return 'blue';
      case 'planning': return 'purple';
      case 'implementation': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'planning': return 'yellow';
      case 'complete': return 'blue';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  // Library helper functions
  const categories = [
    { id: 'all', name: 'All Files', icon: '📚' },
    { id: 'character-arcs', name: 'Character Arcs', icon: '👥' },
    { id: 'bosses', name: 'Boss Encounters', icon: '⚔️' },
    { id: 'cards', name: 'Card Systems', icon: '🃏' },
    { id: 'mentors', name: 'Mentors', icon: '🧙‍♂️' },
    { id: 'constants', name: 'Game Systems', icon: '⚙️' },
    { id: 'interfaces', name: 'Interface Systems', icon: '🖥️' },
    { id: 'design', name: 'Design Docs', icon: '🎨' }
  ];

  const getFilesByCategory = () => {
    if (!libraryData) return [];
    
    let files = libraryData.files;
    
    if (selectedCategory !== 'all') {
      files = files.filter(file => file.category === selectedCategory);
    }
    
    if (searchTerm) {
      files = files.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.path.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return files;
  };

  const getFileContent = (path: string) => {
    if (!libraryData?.content) return 'Content not available';
    return libraryData.content[path] || 'Content not found';
  };

  const formatFileContent = (content: string, type: string) => {
    if (type === 'yaml' || type === 'json') {
      return (
        <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 border">
          <code className="text-gray-800">{content}</code>
        </pre>
      );
    } else {
      return (
        <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto border">
          <pre className="whitespace-pre-wrap text-gray-800 font-sans">{content}</pre>
        </div>
      );
    }
  };

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Auto-hide after 3 seconds
  };

  // Copy and Download functionality for workflow documents
  const copyDocumentToClipboard = async (doc: AudienceDocument) => {
    if (!doc.content) {
      showToast('No content to copy', 'error');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(doc.content);
      showToast(`📋 ${doc.title} copied to clipboard!`, 'success');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      try {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = doc.content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast(`📋 ${doc.title} copied to clipboard!`, 'success');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_fallbackError) {
        showToast('❌ Failed to copy to clipboard', 'error');
      }
    }
  };

  const downloadDocument = (doc: AudienceDocument) => {
    if (!doc.content) {
      showToast('No content to download', 'error');
      return;
    }
    
    try {
      // Use the appropriate identifier based on workflow mode
      const systemName = workflowMode === 'narrative' ? selectedNarrativeFocus : selectedSystem;
      const fileName = `${systemName}-${doc.type}.md`;
      const blob = new Blob([doc.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      showToast(`💾 Downloaded ${fileName}`, 'success');
    } catch (error) {
      console.error('Failed to download document:', error);
      showToast('❌ Failed to download document', 'error');
    }
  };

  const filteredFiles = getFilesByCategory();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 transition-opacity duration-300 opacity-100">
          <div className={`px-6 py-4 rounded-lg shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{toast.message}</span>
              <button 
                onClick={() => setToast(null)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-3 shadow-lg">
                  <div className="text-2xl text-white">🎭</div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Three-Audience Workflow System
                  </h1>
                  <p className="text-gray-600 mt-1 font-medium">Transform complex development into smooth workflow - from design discussions to LLM collaboration</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                
                <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>System Operational</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span>{WORKFLOW_SYSTEMS.length} Systems</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-t border-gray-100">
            <nav className="flex space-x-0">
              {[
                { id: 'workflow', name: 'Workflow Hub', icon: '🎭', desc: 'Three-Audience Documentation', color: 'purple' },
                { id: 'library', name: 'Content Library', icon: '📚', desc: 'Browse Source Files', color: 'blue' },
                { id: 'status', name: 'System Status', icon: '📊', desc: 'Development Progress', color: 'green' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'workflow' | 'library' | 'status')}
                  className={`relative flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 group ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r from-${tab.color}-50 to-${tab.color}-100 text-${tab.color}-700 border-b-3 border-${tab.color}-500`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className={`text-lg transition-transform duration-200 ${
                      activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      {tab.icon}
                    </span>
                    <div className="text-left hidden sm:block">
                      <div className="font-semibold">{tab.name}</div>
                      <div className={`text-xs mt-0.5 ${
                        activeTab === tab.id ? `text-${tab.color}-600` : 'text-gray-400'
                      }`}>
                        {tab.desc}
                      </div>
                    </div>
                  </div>
                  
                  {activeTab === tab.id && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 rounded-t-lg`}></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Workflow Hub Tab */}
        {activeTab === 'workflow' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-8 py-12 text-white">
                <div className="max-w-4xl">
                  <h2 className="text-3xl font-bold mb-4">🚀 Three-Audience Workflow Active</h2>
                  <p className="text-purple-100 text-lg mb-6">
                    Generate targeted documentation for each audience: <strong>design discussions</strong> (Luke + Zach), 
                    <strong> development planning</strong> (Luke&apos;s workflow), and <strong>LLM collaboration</strong> (Claude). 
                    Transform 30+ minutes of context assembly into 2 minutes of focused generation.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="text-sm text-purple-100">Context Assembly Time</div>
                      <div className="font-semibold">30min → 2min</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="text-sm text-purple-100">Workflow Support</div>
                      <div className="font-semibold">✅ Triage-Style</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="text-sm text-purple-100">Integration Prevention</div>
                      <div className="font-semibold">🛡️ Anti-Patchwork</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  📂 {workflowMode === 'narrative' ? 'Select Narrative Focus' : 'Select System for Workflow Generation'}
                </h3>
                <div className="flex items-center space-x-3">
                  {/* Workflow Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setWorkflowMode('technical')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        workflowMode === 'technical'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      🔧 Technical
                    </button>
                    <button
                      onClick={() => setWorkflowMode('narrative')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        workflowMode === 'narrative'
                          ? 'bg-white text-purple-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      🎭 Narrative
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-lg">
                    {workflowMode === 'narrative' 
                      ? `${NARRATIVE_FOCUS_AREAS.length} focus areas` 
                      : `${WORKFLOW_SYSTEMS.length} system${WORKFLOW_SYSTEMS.length !== 1 ? 's' : ''} available`
                    }
                  </div>
                </div>
              </div>
              
              {WORKFLOW_SYSTEMS.length === 1 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm text-amber-800">
                    <strong>💡 Expanding the system:</strong> Currently showing Activity Interface System (the working example). 
                    Currently showing 3 available interface systems. To add more systems, create their YAML files in <code className="bg-amber-100 px-1 rounded">data/interfaces/</code> 
                    using the same pattern as <code className="bg-amber-100 px-1 rounded">activity-interface.yaml</code>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {workflowMode === 'narrative' ? (
                  // Narrative Focus Areas
                  NARRATIVE_FOCUS_AREAS.map((focus) => (
                    <button
                      key={focus.id}
                      onClick={() => setSelectedNarrativeFocus(focus.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedNarrativeFocus === focus.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{focus.icon}</span>
                          <h4 className="font-semibold text-gray-900">{focus.name}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{focus.description}</p>
                      {focus.systems.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Systems: {focus.systems.slice(0, 2).join(', ')}
                          {focus.systems.length > 2 && ` +${focus.systems.length - 2} more`}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  // Technical Workflow Systems
                  WORKFLOW_SYSTEMS.map((system) => (
                    <button
                      key={system.id}
                      onClick={() => setSelectedSystem(system.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedSystem === system.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{system.name}</h4>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 bg-${getStatusColor(system.status)}-400 rounded-full`}></div>
                          <div className={`w-2 h-2 bg-${getPriorityColor(system.priority)}-400 rounded-full`}></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{system.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{system.components} components</span>
                        <span>{system.lastUpdated}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Generation Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      ⚡ Generate {workflowMode === 'narrative' ? 'Narrative' : 'Three-Audience'} Documentation
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {workflowMode === 'narrative' 
                        ? `Current focus: ${NARRATIVE_FOCUS_AREAS.find(f => f.id === selectedNarrativeFocus)?.name || selectedNarrativeFocus}`
                        : `Current system: ${WORKFLOW_SYSTEMS.find(s => s.id === selectedSystem)?.name}`
                      }
                    </p>
                  </div>
                </div>
                
                {/* Enhanced Options */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">📚 Enhanced Options</h4>
                  
                  <div className="space-y-4">
                    {/* Include Archives Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeArchives}
                            onChange={(e) => setIncludeArchives(e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Include Archives</span>
                            <p className="text-xs text-gray-600">
                              {workflowMode === 'narrative' 
                                ? 'Add comprehensive character content and world-building documentation'
                                : 'Add all design docs, character content, and game constants to LLM context'
                              }
                            </p>
                          </div>
                        </label>
                      </div>
                      {includeArchives && (
                        <div className="ml-4 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                          +19 files, ~16KB context
                        </div>
                      )}
                    </div>
                    
                    {workflowMode === 'narrative' ? (
                      /* Export References Toggle for Narrative Mode */
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={narrativeExportReferences}
                              onChange={(e) => setNarrativeExportReferences(e.target.checked)}
                              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-900">Export References</span>
                              <p className="text-xs text-gray-600">Export referenced files to references/ directory instead of embedding inline</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    ) : (
                      /* Copy to Directory for Technical Mode */
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Copy to Directory (Optional)
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={copyToPath}
                            onChange={(e) => setCopyToPath(e.target.value)}
                            placeholder="../rogue-resident-local/docs/workflow/"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                          <button
                            onClick={() => setCopyToPath('../rogue-resident-local/docs/workflow/')}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Use Default
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Automatically copy generated files to your game repository for immediate use
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  {/* Cleanup Button */}
                  <button
                    onClick={cleanupWorkflowDirectory}
                    disabled={isCleaningUp || isGenerating}
                    className="px-4 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white disabled:opacity-50"
                    title={`Clean up workflow directory: ${copyToPath || '../rogue-resident-local/docs/workflow/'}`}
                  >
                    {isCleaningUp ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span className="hidden sm:inline">Cleaning...</span>
                      </>
                    ) : (
                      <>
                        <span>🧹</span>
                        <span className="hidden sm:inline">Cleanup</span>
                      </>
                    )}
                  </button>

                  {/* Generate Button */}
                  <button
                    onClick={generateWorkflowDocuments}
                    disabled={isGenerating || isCleaningUp}
                    className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl ${
                      includeArchives 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700' 
                        : workflowMode === 'narrative'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                    } text-white disabled:opacity-50`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>
                          {includeArchives 
                            ? 'Generating Enhanced...' 
                            : workflowMode === 'narrative' 
                            ? 'Generating Narrative...' 
                            : 'Generating...'
                          }
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{includeArchives ? '📚' : workflowMode === 'narrative' ? '🎭' : '🎭'}</span>
                        <span>
                          {includeArchives 
                            ? 'Generate Enhanced Docs' 
                            : workflowMode === 'narrative' 
                            ? 'Generate Narrative Workflow' 
                            : 'Generate Workflow Docs'
                          }
                        </span>
                        {copyToPath && workflowMode !== 'narrative' && <span className="text-xs opacity-75">+ Copy</span>}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Three Audience Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-0">
                  {audienceDocuments.map((doc) => (
                    <button
                      key={doc.type}
                      onClick={() => setSelectedAudience(doc.type)}
                      className={`flex-1 py-3 px-4 font-medium text-sm transition-all duration-200 border-b-2 ${
                        selectedAudience === doc.type
                          ? `border-${getAudienceColor(doc.type)}-500 text-${getAudienceColor(doc.type)}-700 bg-${getAudienceColor(doc.type)}-50`
                          : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg">{getAudienceIcon(doc.type)}</span>
                        <div className="text-left hidden sm:block">
                          <div className="font-semibold">{doc.title}</div>
                          <div className="text-xs opacity-75">{doc.size}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Document Preview */}
              {selectedAudience && (
                <div className="space-y-4">
                  {(() => {
                    const doc = audienceDocuments.find(d => d.type === selectedAudience);
                    if (!doc) return null;
                    
                    return (
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getAudienceIcon(doc.type)}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                              <p className="text-sm text-gray-600">{doc.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{doc.size}</span>
                            <span>{doc.lastGenerated}</span>
                            <button 
                              onClick={() => copyDocumentToClipboard(doc)}
                              disabled={!doc.content || doc.content.includes('Loading...')}
                              className={`px-3 py-1 rounded transition-colors font-medium ${
                                doc.content && !doc.content.includes('Loading...')
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                              title={doc.content && !doc.content.includes('Loading...') 
                                ? "Copy document to clipboard" 
                                : "Generate documents first"
                              }
                            >
                              📋 Copy
                            </button>
                            <button 
                              onClick={() => downloadDocument(doc)}
                              disabled={!doc.content || doc.content.includes('Loading...')}
                              className={`px-3 py-1 rounded transition-colors font-medium ${
                                doc.content && !doc.content.includes('Loading...')
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                              title={doc.content && !doc.content.includes('Loading...') 
                                ? "Download document as markdown file" 
                                : "Generate documents first"
                              }
                            >
                              💾 Download
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                            {doc.content || `# ${doc.title}\n\n> **Generated for**: ${selectedSystem}\n> **Audience**: ${doc.type}\n> **Generated**: ${doc.lastGenerated}\n\nDocument content will appear here after generation...\n\n## Key Features\n\n- User-experience organized content\n- ${doc.type === 'conversational' ? 'Design discussion focus' : doc.type === 'planning' ? 'Triage-style priorities' : 'Complete technical context'}\n- Asset requirements clearly identified\n- Integration points for anti-patchwork development\n\n---\n\n*Generated by Three-Audience Workflow System*`}
                          </pre>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">📚 Content Library</h3>
                <div className="text-sm text-gray-600">
                  {filteredFiles.length} files {selectedCategory !== 'all' && `in ${selectedCategory}`}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Categories Sidebar */}
                <div className="lg:col-span-1">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Search</h4>
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Files List */}
                <div className="lg:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-3">Files</h4>
                  <div className="space-y-2 max-h-96 overflow-auto">
                    {filteredFiles.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFile(file.path)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedFile === file.path
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{file.type === 'yaml' ? '📄' : file.type === 'markdown' ? '📝' : '📊'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{file.name}</div>
                            <div className="text-xs text-gray-500 truncate">{file.path}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* File Content */}
                <div className="lg:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Content Preview</h4>
                  {selectedFile ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-auto">
                      {(() => {
                        const file = filteredFiles.find(f => f.path === selectedFile);
                        const content = getFileContent(selectedFile);
                        return formatFileContent(content, file?.type || 'text');
                      })()}
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                      Select a file to view its content
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 System Status Dashboard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WORKFLOW_SYSTEMS.map((system) => (
                  <div key={system.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{system.name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 bg-${getStatusColor(system.status)}-400 rounded-full`}></div>
                        <span className="text-sm text-gray-600 capitalize">{system.status}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{system.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Components</div>
                        <div className="font-semibold">{system.components}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Priority</div>
                        <div className={`font-semibold text-${getPriorityColor(system.priority)}-600 capitalize`}>
                          {system.priority}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-gray-500">Last Updated</div>
                        <div className="font-semibold">{system.lastUpdated}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
