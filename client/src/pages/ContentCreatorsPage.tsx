import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { convertVimeoUrl } from "@/lib/vimeo-utils";
import { ChevronLeft, X } from "lucide-react";

// دالة مساعدة لتحويل البيانات بشكل آمن
const safeParse = (data: any): string[] => {
  if (!data) return [];
  try {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [data];
      } catch {
        return data ? [data] : [];
      }
    }
    return [];
  } catch (e) {
    console.error("Error parsing data:", e, data);
    return [];
  }
};

export default function ContentCreatorsPage() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: creators = [] } = trpc.contentCreators.getAll.useQuery();

  // استخراج المنصات والفئات الفريدة
  const { platforms, categories } = useMemo(() => {
    const platformsSet = new Set<string>();
    const categoriesSet = new Set<string>();

    creators.forEach((creator: any) => {
      const creatorPlatforms = safeParse(creator.platforms);
      const creatorCategories = safeParse(creator.categories);

      creatorPlatforms.forEach((p: string) => platformsSet.add(p));
      creatorCategories.forEach((c: string) => categoriesSet.add(c));
    });

    return {
      platforms: Array.from(platformsSet).sort(),
      categories: Array.from(categoriesSet).sort(),
    };
  }, [creators]);

  // تصفية المنشئين
  const filteredCreators = useMemo(() => {
    return creators.filter((creator: any) => {
      let platformMatch = true;
      let categoryMatch = true;

      if (selectedPlatforms.length > 0) {
        const creatorPlatforms = safeParse(creator.platforms);
        platformMatch = selectedPlatforms.some((p: string) => creatorPlatforms.includes(p));
      }

      if (selectedCategories.length > 0) {
        const creatorCategories = safeParse(creator.categories);
        categoryMatch = selectedCategories.some((c: string) => creatorCategories.includes(c));
      }

      return platformMatch && categoryMatch;
    });
  }, [creators, selectedPlatforms, selectedCategories]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <a
            href="/"
            className="flex items-center gap-2 text-orange-500 hover:text-orange-400 mb-4 transition-colors"
          >
            <ChevronLeft size={20} />
            العودة للرئيسية
          </a>
          <h1 className="text-4xl font-bold text-white mb-2">صناع المحتوى</h1>
          <p className="text-gray-400">اكتشف أفضل صناع المحتوى والمؤثرين</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {/* Platforms Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">المنصات</label>
            <div className="flex flex-wrap gap-2">
              {platforms.length === 0 ? (
                <span className="text-gray-500">لا توجد منصات</span>
              ) : (
                platforms.map((platform: string) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedPlatforms.includes(platform)
                        ? "bg-orange-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {platform}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">الفئات</label>
            <div className="flex flex-wrap gap-2">
              {categories.length === 0 ? (
                <span className="text-gray-500">لا توجد فئات</span>
              ) : (
                categories.map((category: string) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategories.includes(category)
                        ? "bg-orange-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Creators Grid - عرض الفيديوهات بشكل ريلز عمودي */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredCreators.map((creator: any) => {
            const platforms = safeParse(creator.platforms);
            const works = safeParse(creator.sampleWorks);
            const videoUrl = works[0];
            const embedUrl = videoUrl ? convertVimeoUrl(videoUrl) : null;

            return (
              <div key={creator.id} className="flex flex-col">
                {/* الفيديو بشكل ريلز عمودي (9:16) مع تشغيل تلقائي */}
                {embedUrl && (
                  <div
                    onClick={() => setSelectedVideo(creator)}
                    className="relative group rounded-lg overflow-hidden bg-gray-800 cursor-pointer mb-4"
                    style={{ aspectRatio: "9 / 16" }}
                  >
                    <iframe
                      src={`${embedUrl}?autoplay=1&muted=1&loop=1`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; accelerometer; gyroscope; xr-spatial-tracking; geolocation"
                      allowFullScreen
                      title={creator.name}
                      style={{ border: 'none' }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="text-sm">اضغط للوضع الكامل</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* معلومات صانع المحتوى */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{creator.name}</h3>

                  {/* المنصات */}
                  {platforms.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {platforms.map((platform: string) => (
                        <span
                          key={platform}
                          className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}

                  {creator.bio && <p className="text-gray-400 text-sm line-clamp-2">{creator.bio}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCreators.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">لا توجد نتائج مطابقة للفلاتر المحددة</p>
          </div>
        )}
      </div>

      {/* Fullscreen Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogTitle className="sr-only">فيديو {selectedVideo?.name}</DialogTitle>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-0 flex items-center justify-center">
          {selectedVideo && (() => {
            const works = safeParse(selectedVideo.sampleWorks);
            const videoUrl = works[0];
            const embedUrl = videoUrl ? convertVimeoUrl(videoUrl) : null;

            return (
              <div className="w-full h-[95vh] flex items-center justify-center relative">
                {embedUrl ? (
                  <div className="w-full h-full max-w-md flex items-center justify-center">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={selectedVideo.name}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">{selectedVideo.name}</h2>
                    <p className="text-gray-400">{selectedVideo.bio}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
