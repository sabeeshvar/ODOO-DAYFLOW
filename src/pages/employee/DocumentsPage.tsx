import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { dataService } from '../../services/dataService';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import type { DocumentItem } from '../../types';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  FileCheck, 
  ShieldCheck 
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentItem['type']>('Resume');
  const fileSize = '1.8 MB';

  const refreshDocs = () => {
    if (!user) return;
    const emp = dataService.getEmployeeById(user.employeeId);
    setDocuments(emp?.documents || []);
  };

  useEffect(() => {
    refreshDocs();
    const unsub = dataService.subscribe(refreshDocs);
    return unsub;
  }, [user]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !docName.trim()) return;

    dataService.addDocument(user.employeeId, {
      name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      type: docType,
      fileSize: fileSize || '2.1 MB',
    });

    showToast('Document Uploaded', `${docName} has been deposited in your personnel vault.`, 'success');
    setIsUploadModalOpen(false);
    setDocName('');
  };

  const handleDelete = (docId: string, name: string) => {
    if (!user) return;
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      dataService.deleteDocument(user.employeeId, docId);
      showToast('Document Removed', `${name} has been deleted.`, 'info');
    }
  };

  const handleDownload = (name: string) => {
    showToast('Download Commenced', `Downloading secure copy of ${name}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Employee Personnel Documents
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access, view, and deposit your verified contractual and identity documents.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          icon={<Upload className="w-4 h-4" />}
        >
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Stored</p>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{documents.length} Files</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Verification Status</p>
            <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">100% Compliant</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl shrink-0">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Encrypted Storage</p>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">Cloud Vault</h4>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader
          title="Document Repository"
          subtitle="All credentials deposited by you and the Human Resources office"
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/80 uppercase text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Document Name</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">File Size</th>
                  <th className="px-6 py-3.5">Upload Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No documents stored. Upload an ID or resume copy.
                    </td>
                  </tr>
                ) : (
                  documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{doc.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{doc.fileSize}</td>
                      <td className="px-6 py-4 text-slate-500">{doc.uploadedAt}</td>
                      <td className="px-6 py-4">
                        <Badge variant="success" size="sm" dot>
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownload(doc.name)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id, doc.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Personnel Document"
        description="Choose document type and provide title for verification."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Input
            label="Document Title"
            type="text"
            placeholder="e.g. Passport_Identity_Scan.pdf"
            value={docName}
            onChange={e => setDocName(e.target.value)}
            required
          />

          <Select
            label="Document Category"
            value={docType}
            onChange={e => setDocType(e.target.value as DocumentItem['type'])}
            options={[
              { value: 'Resume', label: 'Resume / Curriculum Vitae' },
              { value: 'ID Document', label: 'Government ID / Passport' },
              { value: 'Joining Letter', label: 'Signed Joining Agreement' },
              { value: 'Tax Form', label: 'Tax Exemption Declaration' },
              { value: 'Contract', label: 'Employment Contract' },
              { value: 'Other', label: 'Other Certification' },
            ]}
          />

          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
            <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Drag and drop your file here, or browse
            </p>
            <p className="text-[11px] text-slate-400 mt-1">PDF, PNG, JPG up to 10MB</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
