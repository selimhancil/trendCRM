"use client";
import { useState } from "react";

interface ApprovalStep {
  id: string;
  role: string;
  order: number;
  required: boolean;
}

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState<Array<{
    id: string;
    name: string;
    steps: ApprovalStep[];
    active: boolean;
  }>>([
    {
      id: "1",
      name: "Standart İçerik Onayı",
      steps: [
        { id: "1", role: "editor", order: 1, required: true },
        { id: "2", role: "manager", order: 2, required: true },
      ],
      active: true,
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✅ Onay Süreçleri</h1>
          <p className="text-gray-600">İçerik onay workflow'larını yönetin</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          ➕ Yeni Workflow
        </button>
      </div>

      {/* Workflows */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{workflow.name}</h3>
                <span className={`text-xs ${workflow.active ? "text-green-600" : "text-gray-500"}`}>
                  {workflow.active ? "● Aktif" : "○ Pasif"}
                </span>
              </div>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                Düzenle
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {workflow.steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-sm font-medium text-gray-700">
                    {step.role}
                  </div>
                  {idx < workflow.steps.length - 1 && (
                    <svg className="w-6 h-6 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




