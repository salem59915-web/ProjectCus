import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  BarChart3,
  Users,
  Mic,
  Film,
  PenTool,
  ShoppingCart,
  Settings,
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  ChevronDown,
  Zap,
} from "lucide-react";

type TabType = "overview" | "services" | "orders" | "clients" | "media" | "cms" | "settings" | "reports";
type ServiceType = "models" | "voices" | "creators" | "videos" | "writers" | null;

const COLORS = {
  primary: "#fbbf24",
  secondary: "#f97316",
  dark: "#0f172a",
  darker: "#020617",
  card: "#1e293b",
  text: "#ffffff",
  textSecondary: "#cbd5e1",
  border: "#334155",
  success: "#22c55e",
  warning: "#ef4444",
  info: "#3b82f6",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceType>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: allModels = [], refetch: refetchModels } = trpc.models.getAll.useQuery();
  const { data: allVoices = [], refetch: refetchVoices } = trpc.voiceArtists.getAll.useQuery();
  const { data: allCreators = [], refetch: refetchCreators } = trpc.contentCreators.getAll.useQuery();
  const { data: allVideos = [], refetch: refetchVideos } = trpc.videoProductions.getAll.useQuery();
  const { data: allWritings = [], refetch: refetchWritings } = trpc.contentWriting.getAll.useQuery();

  const deleteModelMutation = trpc.models.delete.useMutation({ onSuccess: () => refetchModels() });
  const deleteVoiceMutation = trpc.voiceArtists.delete.useMutation({ onSuccess: () => refetchVoices() });
  const deleteCreatorMutation = trpc.contentCreators.delete.useMutation({ onSuccess: () => refetchCreators() });
  const deleteVideoMutation = trpc.videoProductions.delete.useMutation({ onSuccess: () => refetchVideos() });
  const deleteWritingMutation = trpc.contentWriting.delete.useMutation({ onSuccess: () => refetchWritings() });

  const serviceItems = [
    { id: "models", label: "الموديلات", icon: Users },
    { id: "voices", label: "التعليق الصوتي", icon: Mic },
    { id: "creators", label: "صناع المحتوى", icon: Film },
    { id: "videos", label: "إنتاج الفيديو", icon: Film },
    { id: "writers", label: "كتابة المحتوى", icon: PenTool },
  ];

  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: BarChart3 },
    { id: "services", label: "الخدمات", icon: Users, submenu: serviceItems },
    { id: "orders", label: "الطلبات", icon: ShoppingCart },
    { id: "clients", label: "العملاء", icon: Users },
    { id: "media", label: "الوسائط", icon: ImageIcon },
    { id: "cms", label: "المحتوى", icon: FileText },
    { id: "settings", label: "الإعدادات", icon: Settings },
    { id: "reports", label: "التقارير", icon: TrendingUp },
  ];

  const renderContent = () => {
    if (activeTab === "services" && activeService) {
      switch (activeService) {
        case "models":
          return (
            <>
              {showAddForm && <AddModelForm onClose={() => { setShowAddForm(false); refetchModels(); }} />}
              <DataTable title="إدارة الموديلات" data={allModels} columns={["name", "gender", "age"]} onDelete={(id) => deleteModelMutation.mutate({ id })} onAdd={() => setShowAddForm(true)} />
            </>
          );
        case "voices":
          return (
            <>
              {showAddForm && <AddVoiceForm onClose={() => { setShowAddForm(false); refetchVoices(); }} />}
              <DataTable title="إدارة التعليق الصوتي" data={allVoices} columns={["name", "gender", "voiceType"]} onDelete={(id) => deleteVoiceMutation.mutate({ id })} onAdd={() => setShowAddForm(true)} />
            </>
          );
        case "creators":
          return (
            <>
              {showAddForm && <AddCreatorForm onClose={() => { setShowAddForm(false); refetchCreators(); }} />}
              <DataTable title="إدارة صناع المحتوى" data={allCreators} columns={["name", "platforms"]} onDelete={(id) => deleteCreatorMutation.mutate({ id })} onAdd={() => setShowAddForm(true)} />
            </>
          );
        case "videos":
          return (
            <>
              {showAddForm && <AddVideoForm onClose={() => { setShowAddForm(false); refetchVideos(); }} />}
              <DataTable title="إدارة إنتاج الفيديو" data={allVideos} columns={["title", "productionType"]} onDelete={(id) => deleteVideoMutation.mutate({ id })} onAdd={() => setShowAddForm(true)} />
            </>
          );
        case "writers":
          return (
            <>
              {showAddForm && <AddWriterForm onClose={() => { setShowAddForm(false); refetchWritings(); }} />}
              <DataTable title="إدارة كتابة المحتوى" data={allWritings} columns={["title", "contentType"]} onDelete={(id) => deleteWritingMutation.mutate({ id })} onAdd={() => setShowAddForm(true)} />
            </>
          );
      }
    }

    switch (activeTab) {
      case "overview":
        return <OverviewTab models={allModels} voices={allVoices} creators={allCreators} videos={allVideos} writings={allWritings} />;
      case "services":
        return <ServicesOverviewTab models={allModels} voices={allVoices} creators={allCreators} videos={allVideos} writings={allWritings} onSelectService={setActiveService} />;
      default:
        return <div style={{ color: COLORS.textSecondary }}>قيد التطوير...</div>;
    }
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === "services") {
      setActiveTab("services" as TabType);
      setActiveService(null);
      setServicesOpen(!servicesOpen);
    } else {
      setActiveTab(tabId as TabType);
      setServicesOpen(false);
      setActiveService(null);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: COLORS.dark }} dir="rtl">
      <div className="flex-1 flex flex-col">
        <div className="border-b px-6 py-4 flex items-center justify-between shadow-lg" style={{ backgroundColor: COLORS.darker, borderBottomColor: COLORS.primary, borderBottomWidth: "3px" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg transition" style={{ color: COLORS.primary, backgroundColor: COLORS.card }}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            {activeService ? serviceItems.find((s) => s.id === activeService)?.label : menuItems.find((m) => m.id === activeTab)?.label}
          </h2>
        </div>
        <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: COLORS.dark }}>
          {renderContent()}
        </div>
      </div>

      <div className="text-white transition-all duration-300 flex flex-col border-r" style={{ width: sidebarOpen ? "280px" : "80px", backgroundColor: COLORS.darker, borderRightColor: COLORS.primary, borderRightWidth: "2px" }}>
        <div className="p-4 flex items-center justify-center border-b" style={{ borderBottomColor: COLORS.primary, borderBottomWidth: "2px" }}>
          <div className="flex items-center gap-2">
            <Zap size={28} style={{ color: COLORS.primary }} />
            <h1 className={`font-bold text-2xl ${!sidebarOpen && "hidden"}`} style={{ color: COLORS.primary }}>REX</h1>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !activeService;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            return (
              <div key={item.id}>
                <button onClick={() => handleTabClick(item.id)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition justify-end" style={{ backgroundColor: isActive ? COLORS.primary : "transparent", color: isActive ? COLORS.darker : COLORS.textSecondary }}>
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  {hasSubmenu ? <ChevronDown size={18} style={{ transform: servicesOpen ? "rotate(-180deg)" : "rotate(0)" }} /> : <Icon size={18} />}
                </button>
                {hasSubmenu && servicesOpen && sidebarOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subitem: any) => {
                      const SubIcon = subitem.icon;
                      const isSubActive = activeService === subitem.id;
                      return (
                        <button key={subitem.id} onClick={() => { setActiveTab("services"); setActiveService(subitem.id); setShowAddForm(false); }} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition justify-end text-sm" style={{ backgroundColor: isSubActive ? COLORS.secondary : "transparent", color: isSubActive ? COLORS.darker : COLORS.textSecondary }}>
                          {subitem.label}
                          <SubIcon size={16} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function OverviewTab({ models, voices, creators, videos, writings }: any) {
  const stats = [
    { label: "إجمالي الموديلات", value: models.length, color: COLORS.primary },
    { label: "إجمالي المعلقين", value: voices.length, color: COLORS.secondary },
    { label: "إجمالي صناع المحتوى", value: creators.length, color: COLORS.info },
    { label: "إجمالي الفيديوهات", value: videos.length, color: COLORS.warning },
    { label: "إجمالي الكتابات", value: writings.length, color: COLORS.success },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" dir="rtl">
      {stats.map((stat, i) => (
        <div key={i} className="p-6 rounded-xl shadow-lg border-l-4" style={{ backgroundColor: COLORS.card, borderLeftColor: stat.color }}>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>{stat.label}</p>
          <p className="text-4xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function ServicesOverviewTab({ models, voices, creators, videos, writings, onSelectService }: any) {
  const services = [
    { id: "models", label: "الموديلات", count: models.length, color: COLORS.primary },
    { id: "voices", label: "التعليق الصوتي", count: voices.length, color: COLORS.secondary },
    { id: "creators", label: "صناع المحتوى", count: creators.length, color: COLORS.info },
    { id: "videos", label: "إنتاج الفيديو", count: videos.length, color: COLORS.warning },
    { id: "writers", label: "كتابة المحتوى", count: writings.length, color: COLORS.success },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" dir="rtl">
      {services.map((service: any) => (
        <button key={service.id} onClick={() => onSelectService(service.id)} className="rounded-xl shadow-lg p-6 hover:shadow-2xl transition text-right border-t-4" style={{ backgroundColor: COLORS.card, borderTopColor: service.color }}>
          <span className="text-3xl font-bold" style={{ color: service.color }}>{service.count}</span>
          <p className="font-semibold text-white text-lg mt-2">{service.label}</p>
        </button>
      ))}
    </div>
  );
}

function AddModelForm({ onClose }: any) {
  const [formData, setFormData] = useState({ name: "", gender: "female", age: "", videoUrl: "" });
  const [loading, setLoading] = useState(false);
  const createMutation = trpc.models.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age) { alert("يرجى ملء جميع الحقول"); return; }
    setLoading(true);
    try {
      await createMutation.mutateAsync({ name: formData.name, gender: formData.gender as "male" | "female", age: parseInt(formData.age), videoUrl: formData.videoUrl || undefined });
      alert("تم الإضافة بنجاح!");
      onClose();
    } catch (error: any) { alert("خطأ: " + error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>إضافة موديل</h2>
          <button onClick={onClose}><X size={24} style={{ color: COLORS.primary }} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="الاسم" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} required />
          <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }}>
            <option value="female">أنثى</option>
            <option value="male">ذكر</option>
          </select>
          <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} placeholder="العمر" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} required />
          <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="رابط الفيديو (اختياري)" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} />
          <button type="submit" disabled={loading} className="w-full py-2 rounded-lg font-bold" style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}>
            {loading ? "جاري..." : "إضافة"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AddCreatorForm({ onClose }: any) {
  const [formData, setFormData] = useState({ name: "", platforms: "", contentTypes: "", portfolioUrl: "" });
  const [loading, setLoading] = useState(false);
  const createMutation = trpc.contentCreators.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.platforms) { alert("يرجى ملء الحقول المطلوبة"); return; }
    setLoading(true);
    try {
      await createMutation.mutateAsync({ name: formData.name, platforms: formData.platforms, contentTypes: formData.contentTypes || undefined, portfolioUrl: formData.portfolioUrl || undefined });
      alert("تم الإضافة بنجاح!");
      onClose();
    } catch (error: any) { alert("خطأ: " + error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>إضافة صانع محتوى</h2>
          <button onClick={onClose}><X size={24} style={{ color: COLORS.primary }} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="الاسم" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} required />
          <input type="text" value={formData.platforms} onChange={(e) => setFormData({ ...formData, platforms: e.target.value })} placeholder="المنصات" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} required />
          <input type="text" value={formData.contentTypes} onChange={(e) => setFormData({ ...formData, contentTypes: e.target.value })} placeholder="نوع المحتوى" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} />
          <input type="url" value={formData.portfolioUrl} onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })} placeholder="رابط فيمو" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} />
          <button type="submit" disabled={loading} className="w-full py-2 rounded-lg font-bold" style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}>
            {loading ? "جاري..." : "إضافة"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AddVoiceForm({ onClose }: any) {
  const [formData, setFormData] = useState({ name: "", gender: "female", voiceType: "neutral", languages: "ar", sampleAudios: "" });
  const [loading, setLoading] = useState(false);
  const createMutation = trpc.voiceArtists.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { alert("يرجى ملء الحقول المطلوبة"); return; }
    setLoading(true);
    try {
      await createMutation.mutateAsync({ name: formData.name, gender: formData.gender as "male" | "female", voiceType: formData.voiceType || undefined, languages: formData.languages || undefined, sampleAudios: formData.sampleAudios || undefined });
      alert("تم الإضافة بنجاح!");
      onClose();
    } catch (error: any) { alert("خطأ: " + error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>إضافة معلق صوتي</h2>
          <button onClick={onClose}><X size={24} style={{ color: COLORS.primary }} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="الاسم" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} required />
          <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }}>
            <option value="female">أنثى</option>
            <option value="male">ذكر</option>
          </select>
          <select value={formData.voiceType} onChange={(e) => setFormData({ ...formData, voiceType: e.target.value })} className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }}>
            <option value="neutral">محايد</option>
            <option value="deep">عميق</option>
            <option value="high">حاد</option>
          </select>
          <select value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }}>
            <option value="ar">العربية</option>
            <option value="en">الإنجليزية</option>
          </select>
          <input type="url" value={formData.sampleAudios} onChange={(e) => setFormData({ ...formData, sampleAudios: e.target.value })} placeholder="رابط نموذج صوتي" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} />
          <button type="submit" disabled={loading} className="w-full py-2 rounded-lg font-bold" style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}>
            {loading ? "جاري..." : "إضافة"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AddVideoForm({ onClose }: any) {
  const [formData, setFormData] = useState({ title: "", productionType: "commercial", duration: "", videoUrl: "" });
  const [loading, setLoading] = useState(false);
  const createMutation = trpc.videoProductions.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl) { alert("يرجى ملء الحقول المطلوبة"); return; }
    setLoading(true);
    try {
      await createMutation.mutateAsync({ title: formData.title, productionType: formData.productionType || undefined, duration: formData.duration ? parseInt(formData.duration) : undefined, videoUrl: formData.videoUrl });
      alert("تم الإضافة بنجاح!");
      onClose();
    } catch (error: any) { alert("خطأ: " + error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>إضافة فيديو</h2>
          <button onClick={onClose}><X size={24} style={{ color: COLORS.primary }} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="العنوان" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} required />
          <select value={formData.productionType} onChange={(e) => setFormData({ ...formData, productionType: e.target.value })} className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }}>
            <option value="commercial">إعلان</option>
            <option value="documentary">وثائقي</option>
            <option value="music_video">موسيقى</option>
          </select>
          <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="المدة (دقائق)" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} />
          <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="رابط الفيديو" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} required />
          <button type="submit" disabled={loading} className="w-full py-2 rounded-lg font-bold" style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}>
            {loading ? "جاري..." : "إضافة"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AddWriterForm({ onClose }: any) {
  const [formData, setFormData] = useState({ title: "", contentType: "blog", description: "" });
  const [loading, setLoading] = useState(false);
  const createMutation = trpc.contentWriting.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) { alert("يرجى ملء الحقول المطلوبة"); return; }
    setLoading(true);
    try {
      await createMutation.mutateAsync({ title: formData.title, contentType: formData.contentType || undefined, description: formData.description || undefined });
      alert("تم الإضافة بنجاح!");
      onClose();
    } catch (error: any) { alert("خطأ: " + error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>إضافة كاتب</h2>
          <button onClick={onClose}><X size={24} style={{ color: COLORS.primary }} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="العنوان" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} required />
          <select value={formData.contentType} onChange={(e) => setFormData({ ...formData, contentType: e.target.value })} className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }}>
            <option value="blog">مدونة</option>
            <option value="social_media">وسائل</option>
            <option value="seo">SEO</option>
          </select>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="الوصف" className="w-full px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.dark, color: COLORS.text }} rows={3} />
          <button type="submit" disabled={loading} className="w-full py-2 rounded-lg font-bold" style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}>
            {loading ? "جاري..." : "إضافة"}
          </button>
        </form>
      </div>
    </div>
  );
}

function DataTable({ title, data, columns, onDelete, onAdd }: any) {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.card }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>{title}</h3>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}>
          <Plus size={18} />
          إضافة جديد
        </button>
      </div>
      {data.length === 0 ? (
        <p style={{ color: COLORS.textSecondary }}>لا توجد بيانات</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottomColor: COLORS.border, borderBottomWidth: "1px" }}>
                {columns.map((col: string) => (
                  <th key={col} className="px-4 py-3 text-right" style={{ color: COLORS.primary }}>{col}</th>
                ))}
                <th className="px-4 py-3 text-right" style={{ color: COLORS.primary }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any, idx: number) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? COLORS.dark : "transparent", borderBottomColor: COLORS.border, borderBottomWidth: "1px" }}>
                  {columns.map((col: string) => (
                    <td key={col} className="px-4 py-3" style={{ color: COLORS.text }}>{item[col]}</td>
                  ))}
                  <td className="px-4 py-3 flex gap-2">
                    <button className="p-2 rounded-lg" style={{ backgroundColor: COLORS.info }}><Edit2 size={16} /></button>
                    <button className="p-2 rounded-lg" style={{ backgroundColor: COLORS.warning }} onClick={() => onDelete(item.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
