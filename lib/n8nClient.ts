/**
 * n8n Webhook Client
 * Merkezi n8n webhook yönetimi için servis katmanı
 */

interface N8NWebhookOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface N8NWebhookResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

class N8NClient {
  private baseTimeout = 30000; // 30 saniye
  private defaultRetries = 3;
  private defaultRetryDelay = 1000; // 1 saniye

  /**
   * n8n webhook'una istek gönder
   */
  async callWebhook<T = any>(
    webhookUrl: string,
    payload: any,
    options: N8NWebhookOptions = {}
  ): Promise<N8NWebhookResponse<T>> {
    const {
      timeout = this.baseTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
    } = options;

    // Webhook URL kontrolü
    if (!webhookUrl || !webhookUrl.trim()) {
      return {
        success: false,
        error: "n8n webhook URL tanımlı değil",
      };
    }

    let lastError: Error | null = null;

    // Retry mekanizması
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "trendCRM/1.0",
          },
          body: JSON.stringify({
            ...payload,
            metadata: {
              timestamp: new Date().toISOString(),
              source: "trendcrm",
              version: "1.0",
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `n8n webhook error (${response.status}): ${errorText}`
          );
        }

        const data = await response.json();

        return {
          success: true,
          data,
          statusCode: response.status,
        };
      } catch (error: any) {
        lastError = error;

        // Son deneme değilse bekle
        if (attempt < retries) {
          await this.sleep(retryDelay * attempt); // Exponential backoff
        }

        // Abort hatası özel işle
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "n8n webhook timeout - istek çok uzun sürdü",
            statusCode: 408,
          };
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || "n8n webhook çağrısı başarısız oldu",
    };
  }

  /**
   * Webhook URL'ini ayarlardan al (fallback: environment variable)
   * NOTE: AI webhooks are handled by /lib/aiAgent.ts
   */
  private async getWebhookUrl(settingKey: keyof {
    n8n_planning_schedule_url?: string;
    n8n_planning_connect_url?: string;
    n8n_planning_upload_url?: string;
    n8n_analytics_url?: string;
    n8n_comments_url?: string;
    n8n_reports_url?: string;
    n8n_calendar_url?: string;
    n8n_accounts_url?: string;
    n8n_library_url?: string;
    n8n_trend_radar_url?: string;
  }, envKey: string): Promise<string | undefined> {
    try {
      // Timeout ekle - 1 saniye içinde dönmezse environment variable kullan
      const timeoutPromise = new Promise<string | undefined>((resolve) => {
        setTimeout(() => resolve(process.env[envKey]), 1000);
      });

      const settingsPromise = (async () => {
        const { getSettingsServer } = await import("@/lib/settings");
        const settings = await getSettingsServer();
        return settings[settingKey] || process.env[envKey];
      })();

      return await Promise.race([settingsPromise, timeoutPromise]);
    } catch {
      return process.env[envKey];
    }
  }

  // NOTE: analyzeInstagram, getTrendingContent, getInstagramContent methods removed
  // These are now handled by the unified AI Agent in /lib/aiAgent.ts

  /**
   * İçerik planlama webhook'u çağır
   */
  async schedulePost(postData: {
    account: string;
    content: string;
    scheduled_time: string;
    hashtags: string[];
    post_type: "post" | "reel" | "story";
    media_url?: string;
  }): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_planning_schedule_url", "N8N_API_PLANNING_SCHEDULE_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Planlama webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      action: "schedule_post",
      post: {
        ...postData,
        id: `post_${Date.now()}`,
        created_at: new Date().toISOString(),
      },
    });
  }

  /**
   * Instagram hesap bağlama webhook'u çağır
   */
  async connectInstagram(data: {
    access_token: string;
    user_id: string;
    username?: string;
  }): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_planning_connect_url", "N8N_API_PLANNING_CONNECT_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Instagram bağlama webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      action: "connect_instagram",
      ...data,
    });
  }

  /**
   * Dosya yükleme webhook'u çağır
   */
  async uploadFile(fileData: {
    filename: string;
    contentType: string;
    size: number;
    data: string; // base64
  }): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_planning_upload_url", "N8N_API_PLANNING_UPLOAD_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Dosya yükleme webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      action: "upload_file",
      ...fileData,
    });
  }

  /**
   * Webhook sağlık kontrolü
   */
  async healthCheck(webhookUrl: string): Promise<boolean> {
    try {
      const response = await this.callWebhook(webhookUrl, {
        action: "health_check",
      });

      return response.success;
    } catch {
      return false;
    }
  }

  /**
   * Analytics verilerini getir
   */
  async getAnalytics(data: {
    accountId?: string;
    period?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_analytics_url", "N8N_API_ANALYTICS_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Analytics webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      action: "get_analytics",
      ...data,
    });
  }

  /**
   * Yorumları getir
   */
  async getComments(data: {
    accountId?: string;
    filter?: string;
    postId?: string;
  }): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_comments_url", "N8N_API_COMMENTS_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Comments webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      action: "get_comments",
      ...data,
    });
  }

  /**
   * Yorum işlemi (yanıt, sil, onayla)
   */
  async commentAction(data: {
    action: "reply" | "delete" | "approve";
    commentId: string;
    replyText?: string;
  }): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_comments_url", "N8N_API_COMMENTS_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Comments webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      ...data,
      action: "comment_action",
    });
  }

  /**
   * Rapor oluştur
   */
  async generateReport(data: {
    reportType: string;
    startDate?: string;
    endDate?: string;
    accountId?: string;
    format?: string;
  }): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_reports_url", "N8N_API_REPORTS_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Reports webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      action: "generate_report",
      ...data,
    });
  }

  /**
   * Takvim içeriklerini getir
   */
  async getCalendarPosts(data: {
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_calendar_url", "N8N_API_CALENDAR_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Calendar webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      action: "get_calendar_posts",
      ...data,
    });
  }

  /**
   * Hesapları getir
   */
  async getAccounts(): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_accounts_url", "N8N_API_ACCOUNTS_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Accounts webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      action: "get_accounts",
    });
  }

  /**
   * İçerik kütüphanesi işlemleri
   */
  async libraryAction(data: {
    action: "get" | "upload";
    filter?: string;
    accountId?: string;
    file?: any;
  }): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_library_url", "N8N_API_LIBRARY_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Library webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      ...data,
      action: "library_action",
    });
  }

  /**
   * Creative Trend Radar - sektöre özel trend verileri getir
   */
  async getTrendRadar(sector: string): Promise<N8NWebhookResponse> {
    const webhookUrl = await this.getWebhookUrl("n8n_trend_radar_url", "N8N_API_TREND_RADAR_URL");

    if (!webhookUrl) {
      return {
        success: false,
        error: "Trend Radar webhook URL tanımlı değil",
      };
    }

    return this.callWebhook(webhookUrl, {
      action: "get_trend_radar",
      sector: sector.trim(),
    }, {
      timeout: 30000, // 30 saniye timeout
    });
  }

  // NOTE: All AI-related methods have been moved to /lib/aiAgent.ts
  // This file now only handles non-AI webhooks (planning, analytics, etc.)

  /**
   * Tüm webhook'ların sağlık kontrolü
   */
  async checkAllWebhooks(): Promise<{
    [key: string]: boolean;
  }> {
    // Timeout ekle - 2 saniye içinde ayarlar alınamazsa environment variable kullan
    let settings: any = {};
    try {
      const timeoutPromise = new Promise<{}>((resolve) => {
        setTimeout(() => resolve({}), 2000);
      });

      const settingsPromise = import("@/lib/settings").then(m => m.getSettingsServer());
      settings = await Promise.race([settingsPromise, timeoutPromise]);
    } catch {
      // Hata durumunda boş obje
    }
    
    const webhooks: { [key: string]: string | undefined } = {
      // AI webhooks are now handled by unified AI Agent
      schedule: settings.n8n_planning_schedule_url || process.env.N8N_API_PLANNING_SCHEDULE_URL,
      connect: settings.n8n_planning_connect_url || process.env.N8N_API_PLANNING_CONNECT_URL,
      upload: settings.n8n_planning_upload_url || process.env.N8N_API_PLANNING_UPLOAD_URL,
      analytics: settings.n8n_analytics_url || process.env.N8N_API_ANALYTICS_URL,
      comments: settings.n8n_comments_url || process.env.N8N_API_COMMENTS_URL,
      reports: settings.n8n_reports_url || process.env.N8N_API_REPORTS_URL,
      calendar: settings.n8n_calendar_url || process.env.N8N_API_CALENDAR_URL,
      accounts: settings.n8n_accounts_url || process.env.N8N_API_ACCOUNTS_URL,
      library: settings.n8n_library_url || process.env.N8N_API_LIBRARY_URL,
    };

    const results: { [key: string]: boolean } = {};

    for (const [key, url] of Object.entries(webhooks)) {
      if (url) {
        results[key] = await this.healthCheck(url);
      } else {
        results[key] = false;
      }
    }

    return results;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const n8nClient = new N8NClient();

// NOTE: fetchInstagramAnalysis and fetchTrendingContent removed
// These are now handled by the unified AI Agent in /lib/aiAgent.ts


