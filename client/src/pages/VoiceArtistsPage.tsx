import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, Volume2, Zap } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

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

export default function VoiceArtistsPage() {
  // جلب البيانات من قاعدة البيانات
  const { data: voiceArtistsData = [], isLoading } = trpc.voiceArtists.list.useQuery({});
  const voiceArtists = voiceArtistsData.filter((artist: any) => artist.isActive);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");

  const handleInstantMode = () => {
    toast.success("تم تفعيل الوضع الفوري");
  };

  const handleRequestNow = (artistName: string) => {
    toast.success(`تم إرسال طلبك للمعلق: ${artistName}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container">
          {/* Instant Mode Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleInstantMode}
              size="lg"
              className="bg-card hover:bg-card/80 text-foreground border-2 border-border px-8 py-6 text-lg"
            >
              <Zap className="ml-2" size={24} />
              تفعيل الوضع الفوري
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-card border-2 border-border rounded-lg px-6 py-4 text-foreground text-lg focus:outline-none focus:border-primary"
            >
              <option value="all">كل المناطق</option>
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام">الدمام</option>
              <option value="الطائف">الطائف</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-card border-2 border-border rounded-lg px-6 py-4 text-foreground text-lg focus:outline-none focus:border-primary"
            >
              <option value="all">كل الفئات</option>
              <option value="إعلانات">إعلانات</option>
              <option value="دوبلاج">دوبلاج</option>
              <option value="وثائقي">وثائقي</option>
              <option value="تعليمي">تعليمي</option>
            </select>

            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-card border-2 border-border rounded-lg px-6 py-4 text-foreground text-lg focus:outline-none focus:border-primary"
            >
              <option value="all">كل الأحباس</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>
          </div>

          {/* Voice Artists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {voiceArtists.map((artist) => (
              <Card key={artist.id} className="bg-card border-2 border-border overflow-hidden">
                <CardContent className="p-6">
                  {/* Name and Rating */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-foreground">{artist.name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                      <span className="text-muted-foreground mr-2">(5.0)</span>
                    </div>
                  </div>

                  {/* Custom Audio Player */}
                  <div className="bg-primary/10 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Volume2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        {artist.sampleAudios ? (() => {
                          try {
                            const audios = safeParse(artist.sampleAudios);
                            const audioUrl = audios[0];
                            return audioUrl ? (
                              <audio 
                                controls 
                                className="w-full"
                                style={{
                                  height: '40px',
                                }}
                              >
                                <source src={audioUrl} type="audio/mpeg" />
                                <source src={audioUrl} type="audio/wav" />
                                <source src={audioUrl} type="audio/mp4" />
                                <source src={audioUrl} type="audio/ogg" />
                                <source src={audioUrl} type="audio/webm" />
                                <source src={audioUrl} />
                                متصفحك لا يدعم تشغيل الملفات الصوتية
                              </audio>
                            ) : (
                              <p className="text-muted-foreground text-sm">لا توجد عينة صوتية</p>
                            );
                          } catch (error) {
                            console.error("Error parsing audio:", error, artist.sampleAudios);
                            return <p className="text-muted-foreground text-sm">خطأ في تحميل الملف الصوتي</p>;
                          }
                        })() : (
                          <p className="text-muted-foreground text-sm">لا توجد عينة صوتية</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Request Button */}
                  <Button
                    onClick={() => handleRequestNow(artist.name)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-lg"
                  >
                    اطلب الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
