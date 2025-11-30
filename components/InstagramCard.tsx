interface InstagramPost {
  id: string;
  type: "reel" | "post" | "video";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption: string;
  username: string;
  likes_count: number;
  comments_count: number;
  views_count?: number;
  timestamp: string;
  hashtags: string[];
}

interface InstagramCardProps {
  post: InstagramPost;
}

export function InstagramCard({ post }: InstagramCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Az önce";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const getTypeIcon = () => {
    switch (post.type) {
      case "reel":
        return "🎬";
      case "video":
        return "🎥";
      case "post":
        return "📸";
      default:
        return "📷";
    }
  };

  const getTypeColor = () => {
    switch (post.type) {
      case "reel":
        return "bg-purple-100 text-purple-800";
      case "video":
        return "bg-blue-100 text-blue-800";
      case "post":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const engagementScore = post.likes_count + post.comments_count * 2 + (post.views_count || 0) / 100;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
      {/* Media Container */}
      <div className="relative">
        {post.thumbnail_url && (
          <div className="aspect-square bg-gray-200 relative overflow-hidden">
            <img
              src={post.thumbnail_url}
              alt={post.caption.substring(0, 50)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Type Badge */}
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${getTypeColor()}`}>
              {getTypeIcon()} {post.type.toUpperCase()}
            </div>
            {/* Engagement Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium bg-black/70 text-white backdrop-blur-sm">
              🔥 {formatNumber(engagementScore)} etkileşim
            </div>
            {/* Play Button for Reels/Videos */}
            {(post.type === "reel" || post.type === "video") && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {post.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <a
                href={`https://instagram.com/${post.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-900 hover:text-blue-600"
              >
                @{post.username}
              </a>
              <p className="text-xs text-gray-500">{formatDate(post.timestamp)}</p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {post.caption}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                <path d="M.05 11.555A13 13 0 0110 10c2.59 0 4.853.736 6.95 1.555C18.106 13.074 18 13.982 18 15v.59a2.5 2.5 0 00-2.5 2.5v1a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5v-1A2.5 2.5 0 002 15.59V15c0-1.018-.106-1.926-.05-2.445zM10 10c-2.59 0-4.853.736-6.95 1.555A11.5 11.5 0 011 15v.59a1.5 1.5 0 003 0V15a5 5 0 0110 0v.59a1.5 1.5 0 003 0V15c0-1.018-.106-1.926-.05-2.445A13 13 0 0110 10z" />
              </svg>
              {formatNumber(post.likes_count)}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 1 11.434 1 9.111 1 5.26 4.582 2 9 2s8 3.26 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              {formatNumber(post.comments_count)}
            </span>
            {post.views_count && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {formatNumber(post.views_count)}
              </span>
            )}
          </div>
        </div>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.hashtags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
              >
                #{tag}
              </span>
            ))}
            {post.hashtags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{post.hashtags.length - 3} daha
              </span>
            )}
          </div>
        )}

        {/* View on Instagram Button */}
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-md transition-all duration-200"
        >
          Instagram'da Görüntüle →
        </a>
      </div>
    </div>
  );
}




