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
  isFavorite?: boolean;
  isSelected?: boolean;
  onFavoriteToggle?: () => void;
  onSelectToggle?: () => void;
  onShare?: () => void;
}

export function TrendCard({ data, isFavorite = false, isSelected = false, onFavoriteToggle, onSelectToggle, onShare }: TrendCardProps) {
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
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Eğlence': 'from-purple-500 to-pink-500',
      'Teknoloji': 'from-blue-500 to-cyan-500',
      'Moda': 'from-pink-500 to-rose-500',
      'Yemek': 'from-orange-500 to-red-500',
      'Spor': 'from-green-500 to-emerald-500',
      'Eğitim': 'from-indigo-500 to-blue-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={`group bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-purple-300'
    }`}>
      {/* Thumbnail */}
      {data.thumbnail_url && (
        <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          <img
            src={data.thumbnail_url}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {data.video_url && (
              <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-xs font-medium text-white">Video</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons Overlay */}
          <div className="absolute top-3 left-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onFavoriteToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle();
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  isFavorite 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
                title={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
              >
                <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
            {onSelectToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectToggle();
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  isSelected 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
                title={isSelected ? "Seçimi kaldır" : "Karşılaştırma için seç"}
              >
                <svg className="w-4 h-4" fill={isSelected ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-all"
                title="Paylaş"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}
          </div>

          <div className={`absolute top-3 right-3 bg-gradient-to-r ${getCategoryColor(data.category)} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
            {data.category}
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(data.created_at)}
          </span>
          <span className="text-xs font-medium text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            @{data.creator}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {data.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">
          {data.description}
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-200">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center text-gray-700 font-medium">
              <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {formatNumber(data.views)}
            </span>
            <span className="flex items-center text-gray-700 font-medium">
              <svg className="w-4 h-4 mr-1.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {formatNumber(data.likes)}
            </span>
            <span className="flex items-center text-gray-700 font-medium">
              <svg className="w-4 h-4 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              {formatNumber(data.shares)}
            </span>
          </div>
        </div>
        
        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {data.tags.length > 4 && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                +{data.tags.length - 4}
              </span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {data.video_url && (
            <a
              href={data.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Videoyu İzle
            </a>
          )}
          
          {/* Mobile Action Buttons */}
          <div className="flex items-center space-x-1 md:hidden">
            {onFavoriteToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle();
                }}
                className={`p-2.5 rounded-xl transition-all ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}