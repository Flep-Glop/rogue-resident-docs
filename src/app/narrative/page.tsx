'use client'

import { useState, useEffect } from 'react'

interface FocusArea {
  id: string
  name: string
  description: string
  systems: string[]
}

interface WorkflowOptions {
  includeArchives: {
    name: string
    description: string
  }
  exportReferences: {
    name: string
    description: string
  }
}

interface GeneratedFiles {
  narrative_context: string
  lore_implementation: string
  story_continuity: string
}

interface FileInfo {
  name: string
  size: number
  lastModified: string
}

interface WorkflowResult {
  success: boolean
  focusArea: string
  includeArchives: boolean
  exportReferences: boolean
  files: GeneratedFiles
  fileInfo: FileInfo[]
  referencesInfo: Array<{name: string, size: number}>
  generationLog: string
  timestamp: string
}

export default function NarrativePage() {
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([])
  const [workflowOptions, setWorkflowOptions] = useState<WorkflowOptions | null>(null)
  const [selectedFocusArea, setSelectedFocusArea] = useState<string>('all')
  const [includeArchives, setIncludeArchives] = useState<boolean>(false)
  const [exportReferences, setExportReferences] = useState<boolean>(true)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [result, setResult] = useState<WorkflowResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<keyof GeneratedFiles>('narrative_context')

  useEffect(() => {
    fetchWorkflowInfo()
  }, [])

  const fetchWorkflowInfo = async () => {
    try {
      const response = await fetch('/api/narrative-workflow')
      const data = await response.json()
      setFocusAreas(data.focusAreas)
      setWorkflowOptions(data.options)
    } catch (error) {
      console.error('Error fetching workflow info:', error)
      setError('Failed to load workflow information')
    }
  }

  const generateWorkflow = async () => {
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/narrative-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          focusArea: selectedFocusArea,
          includeArchives,
          exportReferences,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
        setSelectedDocument('narrative_context') // Default to first document
      } else {
        setError(data.error || 'Failed to generate workflow')
      }
    } catch (error) {
      console.error('Error generating workflow:', error)
      setError('Network error during generation')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadDocument = (docKey: keyof GeneratedFiles) => {
    if (!result) return
    
    const content = result.files[docKey]
    const fileInfo = result.fileInfo.find(f => f.name.includes(docKey.replace('_', '-')))
    const filename = fileInfo?.name || `${docKey}.md`
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getDocumentTitle = (docKey: keyof GeneratedFiles) => {
    switch (docKey) {
      case 'narrative_context':
        return '🎭 Narrative Context'
      case 'lore_implementation':
        return '🛠️ Lore Implementation'
      case 'story_continuity':
        return '🧠 Story Continuity'
      default:
        return docKey
    }
  }

  const getDocumentDescription = (docKey: keyof GeneratedFiles) => {
    switch (docKey) {
      case 'narrative_context':
        return 'Complete narrative guide for writers and narrative designers'
      case 'lore_implementation':
        return 'Technical implementation guide for developers'
      case 'story_continuity':
        return 'Story bible and consistency reference for AI assistants'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎭 Narrative Workflow Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate comprehensive story, character, and world-building documentation for 
              writers, developers, and AI assistants working on Rogue Resident.
            </p>
          </div>

          {/* Configuration Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Configure Narrative Export</h2>
            
            {/* Focus Area Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Focus Area
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {focusAreas.map((area) => (
                  <div
                    key={area.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedFocusArea === area.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFocusArea(area.id)}
                  >
                    <div className="font-medium text-gray-900 mb-2">{area.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{area.description}</div>
                    {area.systems.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Systems: {area.systems.slice(0, 2).join(', ')}
                        {area.systems.length > 2 && ` +${area.systems.length - 2} more`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {workflowOptions && (
                <>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={includeArchives}
                      onChange={(e) => setIncludeArchives(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {workflowOptions.includeArchives.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {workflowOptions.includeArchives.description}
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={exportReferences}
                      onChange={(e) => setExportReferences(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {workflowOptions.exportReferences.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {workflowOptions.exportReferences.description}
                      </div>
                    </div>
                  </label>
                </>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={generateWorkflow}
              disabled={isGenerating}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              } text-white`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating Narrative Documentation...</span>
                </span>
              ) : (
                'Generate Narrative Workflow 🎭'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-medium">Error</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Results Header */}
              <div className="bg-green-50 border-b border-green-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-green-800 mb-2">
                      ✅ Narrative Documentation Generated Successfully!
                    </h2>
                    <p className="text-green-700">
                      Focus: {focusAreas.find(a => a.id === result.focusArea)?.name || result.focusArea} • 
                      Generated at {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm text-green-600">
                    {result.fileInfo.length} documents
                    {result.referencesInfo.length > 0 && ` + ${result.referencesInfo.length} references`}
                  </div>
                </div>
              </div>

              {/* Document Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {(Object.keys(result.files) as Array<keyof GeneratedFiles>).map((docKey) => (
                    <button
                      key={docKey}
                      onClick={() => setSelectedDocument(docKey)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        selectedDocument === docKey
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {getDocumentTitle(docKey)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Document Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getDocumentTitle(selectedDocument)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getDocumentDescription(selectedDocument)}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadDocument(selectedDocument)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download</span>
                  </button>
                </div>

                {/* Document Preview */}
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {result.files[selectedDocument].substring(0, 2000)}
                    {result.files[selectedDocument].length > 2000 && '\n\n... (truncated for preview)'}
                  </pre>
                </div>

                {/* File Info */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.fileInfo.map((fileInfo) => (
                    <div key={fileInfo.name} className="bg-blue-50 rounded-lg p-3">
                      <div className="font-medium text-blue-900 text-sm">{fileInfo.name}</div>
                      <div className="text-blue-700 text-xs">
                        {formatFileSize(fileInfo.size)} • Modified {new Date(fileInfo.lastModified).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* References Info */}
                {result.referencesInfo.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Reference Files ({result.referencesInfo.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {result.referencesInfo.map((ref, index) => (
                        <div key={index} className="bg-gray-50 rounded p-2 text-xs">
                          <div className="font-medium text-gray-900">{ref.name}</div>
                          <div className="text-gray-600">{formatFileSize(ref.size)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 