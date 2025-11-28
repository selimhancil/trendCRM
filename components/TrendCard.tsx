interface TrendData {
  id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  likes: number;
  shares: number;
  thumbnail_url?: string;
  video_url?: string;
  creator: string;
  created_at: string;
  tags: string[];
}

interface TrendCardProps {
  data: TrendData;
}

export function TrendCard({ data }: TrendCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {data.thumbnail_url && (
        <div className="aspect-video bg-gray-200">
          <img
            src={data.thumbnail_url}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {data.category}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(data.created_at)}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {data.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {data.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              👁️ {formatNumber(data.views)}
            </span>
            <span className="flex items-center">
              ❤️ {formatNumber(data.likes)}
            </span>
            <span className="flex items-center">
              🔄 {formatNumber(data.shares)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            @{data.creator}
          </span>
        </div>
        
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                #{tag}
              </span>
            ))}
            {data.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{data.tags.length - 3} daha
              </span>
            )}
          </div>
        )}
        
        {data.video_url && (
          <div className="mt-4">
            <a
              href={data.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Videoyu İzle
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
