import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { convertVimeoUrl } from "@/lib/vimeo-utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ModelsPage() {
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<any | null>(null);

  // جلب البيانات من قاعدة البيانات
  const { data: models = [] } = trpc.models.list.useQuery({});

  const filteredModels = models.filter((model: any) => {
    if (!model.isActive) return false;
    const genderMatch = selectedGender === "all" || model.gender === selectedGender;
    return genderMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-orange-500 hover:text-orange-400 mb-4 transition-colors"
          >
            <ChevronLeft size={20} />
            العودة للرئيسية
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">توفير الموديلات</h1>
          <p className="text-gray-400">اكتشف أفضل الموديلات والعارضين</p>
        </div>

        {/* Gender Filter */}
        <div className="mb-12">
          <label className="block text-sm font-medium text-gray-300 mb-3">الجنس</label>
          <div className="flex gap-2">
            {["all", "ذكر", "أنثى"].map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedGender === gender
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {gender === "all" ? "الكل" : gender}
              </button>
            ))}
          </div>
        </div>

        {/* Models Grid - عرض الفيديوهات بشكل ريلز عمودي */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredModels.map((model: any) => {
            const embedUrl = model.videoUrl ? convertVimeoUrl(model.videoUrl) : null;

            return (
              <div key={model.id} className="flex flex-col">
                {/* الفيديو بشكل ريلز عمودي (9:16) مع تشغيل تلقائي */}
                {embedUrl && (
                  <div
                    onClick={() => setSelectedModel(model)}
                    className="relative group rounded-lg overflow-hidden bg-gray-800 cursor-pointer mb-4"
                    style={{ aspectRatio: "9 / 16" }}
                  >
                    <iframe
                      src={`${embedUrl}?autoplay=1&muted=1&loop=1`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; accelerometer; gyroscope; xr-spatial-tracking; geolocation"
                      allowFullScreen
                      title={model.name}
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

                {/* معلومات الموديل */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{model.name}</h3>

                  <div className="space-y-1 text-sm text-gray-400">
                    <p>الجنس: {model.gender === "ذكر" ? "ذكر" : "أنثى"}</p>
                    <p>العمر: {model.age} سنة</p>
                    <p>الطول: {model.height} سم</p>
                    {model.experience && <p>الخبرة: {model.experience}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">لا توجد نتائج مطابقة للفلاتر المحددة</p>
          </div>
        )}
      </div>

      {/* Fullscreen Video Dialog */}
      <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
        <DialogTitle className="sr-only">فيديو {selectedModel?.name}</DialogTitle>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-0 flex items-center justify-center">
          {selectedModel && (() => {
            const embedUrl = selectedModel.videoUrl ? convertVimeoUrl(selectedModel.videoUrl) : null;

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
                      title={selectedModel.name}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">{selectedModel.name}</h2>
                    <div className="space-y-2 text-gray-400">
                      <p>الجنس: {selectedModel.gender === "ذكر" ? "ذكر" : "أنثى"}</p>
                      <p>العمر: {selectedModel.age} سنة</p>
                      <p>الطول: {selectedModel.height} سم</p>
                      {selectedModel.experience && <p>الخبرة: {selectedModel.experience}</p>}
                    </div>
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
