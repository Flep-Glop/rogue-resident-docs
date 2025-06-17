export default function EditorPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Editor</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Edit YAML data files directly in the browser with syntax highlighting and validation.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">✏️</div>
          <h2 className="text-xl font-medium mb-2">YAML Editor Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            This section will provide a Monaco editor for editing YAML data files
            with real-time validation and syntax highlighting.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Planned Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Monaco editor with YAML syntax highlighting</li>
                <li>• Real-time validation and error detection</li>
                <li>• Auto-completion for system references</li>
                <li>• File tree navigation</li>
                <li>• Backup and version history</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Current Workaround:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Edit files directly in your local IDE</li>
                <li>• Use the exports feature to generate documentation</li>
                <li>• Files are located in the `/data` directory</li>
                <li>• Changes are automatically detected</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-1">For Immediate Editing:</h3>
            <p className="text-sm text-blue-700">
              You can edit the YAML files in the `/data` directory using your preferred editor.
              The web app will automatically pick up changes when you refresh or generate exports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 