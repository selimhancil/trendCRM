interface AnalysisData {
  username: string;
  followers: number;
  engagement: string;
  recommendation: string;
  profile_pic?: string;
  bio?: string;
  posts_count?: number;
  following?: number;
  verified?: boolean;
  sector?: string;
  goal?: string;
  detailedAnalysis?: {
    contentStrategy: string;
    postingSchedule: string;
    hashtagStrategy: string;
    audienceInsights: string;
    improvementAreas: string[];
    competitiveAdvantage: string;
  };
}

interface AnalysisCardProps {
  data: AnalysisData;
}

export function AnalysisCard({ data }: AnalysisCardProps) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {data.profile_pic && (
            <img
              src={data.profile_pic}
              alt={data.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-3xl font-bold">
                @{data.username}
              </h2>
              {data.verified && (
                <span className="bg-blue-500 rounded-full p-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            {data.bio && (
              <p className="text-white/90 text-sm mb-3">{data.bio}</p>
            )}
            {data.sector && (
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📊 {data.sector}
                </span>
                {data.goal && (
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    🎯 {data.goal.substring(0, 30)}...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 text-center transform hover:scale-105 transition-transform">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {data.followers?.toLocaleString() || 'N/A'}
          </div>
          <div className="text-sm font-medium text-blue-800">Takipçi</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 text-center transform hover:scale-105 transition-transform">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {data.engagement || 'N/A'}
          </div>
          <div className="text-sm font-medium text-green-800">Etkileşim</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 text-center transform hover:scale-105 transition-transform">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {data.posts_count?.toLocaleString() || 'N/A'}
          </div>
          <div className="text-sm font-medium text-purple-800">Gönderi</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200 text-center transform hover:scale-105 transition-transform">
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {data.following?.toLocaleString() || 'N/A'}
          </div>
          <div className="text-sm font-medium text-orange-800">Takip Edilen</div>
        </div>
      </div>

      {/* AI Recommendation */}
      {data.recommendation && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-xl p-6 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-xl font-bold text-yellow-900 mb-3">
                🤖 AI Genel Önerileri
              </h3>
              <p className="text-yellow-800 whitespace-pre-line leading-relaxed">
                {data.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analysis */}
      {data.detailedAnalysis && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white mr-3">
              📊
            </span>
            Detaylı Analiz ve Strateji
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content Strategy */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">İçerik Stratejisi</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {data.detailedAnalysis.contentStrategy}
              </p>
            </div>

            {/* Posting Schedule */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Paylaşım Takvimi</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {data.detailedAnalysis.postingSchedule}
              </p>
            </div>

            {/* Hashtag Strategy */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Hashtag Stratejisi</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {data.detailedAnalysis.hashtagStrategy}
              </p>
            </div>

            {/* Audience Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Hedef Kitle Analizi</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {data.detailedAnalysis.audienceInsights}
              </p>
            </div>
          </div>

          {/* Improvement Areas */}
          {data.detailedAnalysis.improvementAreas && data.detailedAnalysis.improvementAreas.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border-2 border-orange-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                İyileştirme Alanları
              </h4>
              <ul className="space-y-3">
                {data.detailedAnalysis.improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Competitive Advantage */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Rekabet Avantajı
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {data.detailedAnalysis.competitiveAdvantage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}