"use client";
import { useState } from "react";

interface IntegrationStep {
  id: string;
  type: "trigger" | "action";
  name: string;
  config: any;
}

export default function IntegrationBuilderPage() {
  const [steps, setSteps] = useState<IntegrationStep[]>([]);
  const [workflowName, setWorkflowName] = useState("");

  const availableTriggers = [
    { id: "new_post", name: "Yeni Post Yayınlandı", icon: "📱" },
    { id: "new_comment", name: "Yeni Yorum", icon: "💬" },
    { id: "report_ready", name: "Rapor Hazır", icon: "📊" },
    { id: "scheduled_time", name: "Planlanan Zaman", icon: "⏰" },
  ];

  const availableActions = [
    { id: "send_email", name: "Email Gönder", icon: "📧" },
    { id: "slack_notify", name: "Slack Bildirimi", icon: "💬" },
    { id: "webhook", name: "Webhook Gönder", icon: "🔗" },
    { id: "create_task", name: "Görev Oluştur", icon: "✅" },
  ];

  const addStep = (type: "trigger" | "action", item: any) => {
    setSteps([
      ...steps,
      {
        id: `step_${Date.now()}`,
        type,
        name: item.name,
        config: {},
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Integration Builder</h1>
        <p className="text-gray-600">Özel otomasyonlar ve entegrasyonlar oluşturun</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Components */}
        <div className="lg:col-span-1 space-y-6">
          {/* Triggers */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">⚡ Tetikleyiciler</h2>
            <div className="space-y-2">
              {availableTriggers.map((trigger) => (
                <button
                  key={trigger.id}
                  onClick={() => addStep("trigger", trigger)}
                  className="w-full text-left p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors border border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{trigger.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{trigger.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🎯 Aksiyonlar</h2>
            <div className="space-y-2">
              {availableActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => addStep("action", action)}
                  className="w-full text-left p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-colors border border-blue-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{action.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Builder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Adı</label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Örn: Yeni Post Bildirimi"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Steps */}
            <div className="space-y-4 min-h-[400px]">
              {steps.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <div className="text-6xl mb-4">🔧</div>
                  <p className="text-lg font-medium">Workflow'unuzu oluşturun</p>
                  <p className="text-sm">Sol taraftan tetikleyici ve aksiyonlar ekleyin</p>
                </div>
              ) : (
                steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border-2 ${
                      step.type === "trigger"
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300"
                        : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          step.type === "trigger" ? "bg-purple-600" : "bg-blue-600"
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{step.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{step.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSteps(steps.filter(s => s.id !== step.id))}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="flex justify-center my-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {steps.length > 0 && (
              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Kaydet (Taslak)
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                  Aktif Et
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




