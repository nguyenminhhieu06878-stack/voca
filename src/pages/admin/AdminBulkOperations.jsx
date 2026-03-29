import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { 
  Upload, 
  Download, 
  FileText,
  Database,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react'
import toast from 'react-hot-toast'
import Papa from 'papaparse'

const AdminBulkOperations = () => {
  const [importFile, setImportFile] = useState(null)
  const [importPreview, setImportPreview] = useState([])
  const [importErrors, setImportErrors] = useState([])
  const queryClient = useQueryClient()

  // Import vocabulary mutation
  const importMutation = useMutation({
    mutationFn: adminService.bulkImportVocabulary,
    onSuccess: (data) => {
      toast.success(`Successfully imported ${data.imported} vocabulary items`)
      queryClient.invalidateQueries(['admin-vocabulary'])
      setImportFile(null)
      setImportPreview([])
      setImportErrors([])
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to import vocabulary')
    }
  })

  // Export mutations
  const exportVocabularyMutation = useMutation({
    mutationFn: adminService.exportVocabulary,
    onSuccess: (data) => {
      downloadCSV(data, 'vocabulary')
      toast.success('Vocabulary exported successfully')
    }
  })

  const exportUsersMutation = useMutation({
    mutationFn: adminService.exportUsers,
    onSuccess: (data) => {
      downloadCSV(data, 'users')
      toast.success('Users exported successfully')
    }
  })

  const exportPracticesMutation = useMutation({
    mutationFn: adminService.exportPractices,
    onSuccess: (data) => {
      downloadCSV(data, 'practices')
      toast.success('Practices exported successfully')
    }
  })

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }

    setImportFile(file)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors = validateImportData(results.data)
        setImportPreview(results.data.slice(0, 10))
        setImportErrors(errors)
      },
      error: (error) => {
        toast.error('Failed to parse CSV file')
        console.error(error)
      }
    })
  }

  const validateImportData = (data) => {
    const errors = []
    const requiredFields = ['word', 'translation', 'category']

    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field] || row[field].trim() === '') {
          errors.push(`Row ${index + 1}: Missing ${field}`)
        }
      })
    })

    return errors
  }

  const handleImport = () => {
    if (!importFile) {
      toast.error('Please select a file first')
      return
    }

    if (importErrors.length > 0) {
      toast.error('Please fix validation errors before importing')
      return
    }

    Papa.parse(importFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        importMutation.mutate(results.data)
      }
    })
  }

  const downloadCSV = (data, filename) => {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadTemplate = () => {
    const template = [
      {
        word: 'cat',
        translation: 'con mèo',
        category: 'animals',
        difficulty: 'easy',
        phonetic: '/kæt/',
        example: 'The cat is sleeping.',
        audioUrl: ''
      },
      {
        word: 'dog',
        translation: 'con chó',
        category: 'animals',
        difficulty: 'easy',
        phonetic: '/dɔːɡ/',
        example: 'I have a dog.',
        audioUrl: ''
      }
    ]
    downloadCSV(template, 'vocabulary_template')
    toast.success('Template downloaded')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 flex items-center">
          <Database className="mr-3 h-6 w-6" />
          Bulk Operations
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Import and export data in bulk
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Section */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Upload className="mr-2 h-5 w-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Import Vocabulary</h3>
            </div>

            <div className="space-y-4">
              <div>
                <button
                  onClick={downloadTemplate}
                  className="btn-secondary w-full mb-4"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Template
                </button>

                <label className="block">
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500">CSV file only</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </label>

                {importFile && (
                  <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary-600 mr-2" />
                        <span className="text-sm font-medium text-primary-900">
                          {importFile.name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setImportFile(null)
                          setImportPreview([])
                          setImportErrors([])
                        }}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Validation Errors */}
              {importErrors.length > 0 && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-error-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-error-900 mb-2">
                        Validation Errors ({importErrors.length})
                      </h4>
                      <ul className="text-xs text-error-700 space-y-1 max-h-32 overflow-y-auto">
                        {importErrors.slice(0, 10).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {importErrors.length > 10 && (
                          <li>• ... and {importErrors.length - 10} more errors</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              {importPreview.length > 0 && importErrors.length === 0 && (
                <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-success-900 mb-2">
                        Preview ({importPreview.length} items shown)
                      </h4>
                      <div className="text-xs text-success-700 space-y-1 max-h-32 overflow-y-auto">
                        {importPreview.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.word}</span>
                            <span className="text-success-600">{item.translation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={!importFile || importErrors.length > 0 || importMutation.isLoading}
                className="btn-primary w-full"
              >
                {importMutation.isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Vocabulary
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Download className="mr-2 h-5 w-5 text-success-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Export Data</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 border border-neutral-200 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Vocabulary</h4>
                <p className="text-sm text-neutral-600 mb-3">
                  Export all vocabulary words with translations and metadata
                </p>
                <button
                  onClick={() => exportVocabularyMutation.mutate()}
                  disabled={exportVocabularyMutation.isLoading}
                  className="btn-secondary w-full"
                >
                  {exportVocabularyMutation.isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export Vocabulary
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 border border-neutral-200 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Users</h4>
                <p className="text-sm text-neutral-600 mb-3">
                  Export all user accounts and their statistics
                </p>
                <button
                  onClick={() => exportUsersMutation.mutate()}
                  disabled={exportUsersMutation.isLoading}
                  className="btn-secondary w-full"
                >
                  {exportUsersMutation.isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export Users
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 border border-neutral-200 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Practice Sessions</h4>
                <p className="text-sm text-neutral-600 mb-3">
                  Export all practice sessions with scores and feedback
                </p>
                <button
                  onClick={() => exportPracticesMutation.mutate()}
                  disabled={exportPracticesMutation.isLoading}
                  className="btn-secondary w-full"
                >
                  {exportPracticesMutation.isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export Practices
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Import Instructions</h3>
          <div className="prose prose-sm max-w-none text-neutral-600">
            <ol className="space-y-2">
              <li>Download the CSV template to see the required format</li>
              <li>Fill in your vocabulary data following the template structure</li>
              <li>Required fields: <code className="text-primary-600">word</code>, <code className="text-primary-600">translation</code>, <code className="text-primary-600">category</code></li>
              <li>Optional fields: <code className="text-neutral-500">difficulty</code>, <code className="text-neutral-500">phonetic</code>, <code className="text-neutral-500">example</code>, <code className="text-neutral-500">audioUrl</code></li>
              <li>Upload your CSV file and review the preview</li>
              <li>Click "Import Vocabulary" to add the words to the database</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBulkOperations
