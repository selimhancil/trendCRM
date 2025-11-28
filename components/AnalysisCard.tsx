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
}

interface AnalysisCardProps {
  data: AnalysisData;
}

export function AnalysisCard({ data }: AnalysisCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-4 mb-4">
        {data.profile_pic && (
          <img
            src={data.profile_pic}
            alt={data.username}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            @{data.username}
            {data.verified && <span className="ml-2 text-blue-500">✓</span>}
          </h2>
          {data.bio && (
            <p className="text-gray-600 text-sm mt-1">{data.bio}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.followers?.toLocaleString() || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Takipçi</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.engagement || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Etkileşim</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.posts_count?.toLocaleString() || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Gönderi</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            {data.following?.toLocaleString() || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Takip Edilen</div>
        </div>
      </div>

      {data.recommendation && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            💡 AI Önerileri
          </h3>
          <p className="text-yellow-700">{data.recommendation}</p>
        </div>
      )}
    </div>
  );
}
