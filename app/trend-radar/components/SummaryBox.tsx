"use client";

interface SummaryBoxProps {
  summary: string;
  insights?: Array<{ trend: string; insight: string }>;
}

export default function SummaryBox({ summary, insights }: SummaryBoxProps) {
  return (
    <div
      style={{
        animation: "fadeInUp 0.3s ease-out 0.3s forwards",
        opacity: 0,
      }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <svg
          className="w-6 h-6 text-purple-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <h3 className="text-xl font-bold text-gray-900">AI Insight Summary</h3>
      </div>

      <p className="text-gray-700 leading-relaxed mb-4">{summary}</p>

      {insights && insights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-purple-200">
          <h4 className="font-semibold text-gray-900 mb-2">Key Insights:</h4>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <span className="text-purple-600 mr-2">•</span>
                <span>
                  <strong>{insight.trend}:</strong> {insight.insight}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

