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
  X as CloseIcon,
} from "lucide-react";

type TabType = "overview" | "services" | "orders" | "clients" | "media" | "cms" | "settings" | "reports";
type ServiceType = "models" | "voices" | "creators" | "videos" | "writers" | null;

// Color Palette - Matching Rex Website
const COLORS = {
  primary: "#fbbf24", // Golden Yellow
  secondary: "#f97316", // Orange
  dark: "#0f172a", // Very Dark Blue
  darker: "#020617", // Almost Black
  card: "#1e293b", // Dark Blue-Gray
  text: "#ffffff", // White
  textSecondary: "#cbd5e1", // Light Gray
  border: "#334155", // Medium Gray
  success: "#22c55e", // Green
  warning: "#ef4444", // Red
  info: "#3b82f6", // Blue
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceType>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch all data
  const { data: allModels = [] } = trpc.models.getAll.useQuery();
  const { data: allVoices = [] } = trpc.voiceArtists.getAll.useQuery();
  const { data: allCreators = [] } = trpc.contentCreators.getAll.useQuery();
  const { data: allVideos = [] } = trpc.videoProductions.getAll.useQuery();
  const { data: allWritings = [] } = trpc.contentWriting.getAll.useQuery();

  // Mutations
  const deleteModelMutation = trpc.models.delete.useMutation();
  const deleteVoiceMutation = trpc.voiceArtists.delete.useMutation();
  const deleteCreatorMutation = trpc.contentCreators.delete.useMutation();
  const deleteVideoMutation = trpc.videoProductions.delete.useMutation();
  const deleteWritingMutation = trpc.contentWriting.delete.useMutation();

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
              {showAddForm && <AddModelForm onClose={() => setShowAddForm(false)} />}
              <DataTable
                title="إدارة الموديلات"
                data={allModels}
                columns={["name", "gender", "age"]}
                onDelete={(id) => deleteModelMutation.mutate({ id })}
                onAdd={() => setShowAddForm(true)}
              />
            </>
          );
        case "voices":
          return (
            <>
              {showAddForm && <AddVoiceForm onClose={() => setShowAddForm(false)} />}
              <DataTable
                title="إدارة التعليق الصوتي"
                data={allVoices}
                columns={["name", "gender", "voiceType"]}
                onDelete={(id) => deleteVoiceMutation.mutate({ id })}
                onAdd={() => setShowAddForm(true)}
              />
            </>
          );
        case "creators":
          return (
            <>
              {showAddForm && <AddCreatorForm onClose={() => setShowAddForm(false)} />}
              <DataTable
                title="إدارة صناع المحتوى"
                data={allCreators}
                columns={["name", "platforms"]}
                onDelete={(id) => deleteCreatorMutation.mutate({ id })}
                onAdd={() => setShowAddForm(true)}
              />
            </>
          );
        case "videos":
          return (
            <>
              {showAddForm && <AddVideoForm onClose={() => setShowAddForm(false)} />}
              <DataTable
                title="إدارة إنتاج الفيديو"
                data={allVideos}
                columns={["title", "productionType"]}
                onDelete={(id) => deleteVideoMutation.mutate({ id })}
                onAdd={() => setShowAddForm(true)}
              />
            </>
          );
        case "writers":
          return (
            <>
              {showAddForm && <AddWriterForm onClose={() => setShowAddForm(false)} />}
              <DataTable
                title="إدارة كتابة المحتوى"
                data={allWritings}
                columns={["title", "contentType"]}
                onDelete={(id) => deleteWritingMutation.mutate({ id })}
                onAdd={() => setShowAddForm(true)}
              />
            </>
          );
      }
    }

    switch (activeTab) {
      case "overview":
        return <OverviewTab models={allModels} voices={allVoices} creators={allCreators} videos={allVideos} writings={allWritings} />;
      case "services":
        return <ServicesOverviewTab models={allModels} voices={allVoices} creators={allCreators} videos={allVideos} writings={allWritings} onSelectService={setActiveService} />;
      case "orders":
        return <OrdersTab />;
      case "clients":
        return <ClientsTab />;
      case "media":
        return <MediaTab />;
      case "cms":
        return <CMSTab />;
      case "settings":
        return <SettingsTab />;
      case "reports":
        return <ReportsTab />;
      default:
        return null;
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
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className="border-b px-6 py-4 flex items-center justify-between shadow-lg"
          style={{
            backgroundColor: COLORS.darker,
            borderBottomColor: COLORS.primary,
            borderBottomWidth: "3px",
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg transition"
              style={{
                color: COLORS.primary,
                backgroundColor: COLORS.card,
              }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            {activeService ? serviceItems.find((s) => s.id === activeService)?.label : menuItems.find((m) => m.id === activeTab)?.label}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: COLORS.dark }}>
          {renderContent()}
        </div>
      </div>

      {/* Sidebar - Right Side */}
      <div
        className="text-white transition-all duration-300 flex flex-col border-r"
        style={{
          width: sidebarOpen ? "280px" : "80px",
          backgroundColor: COLORS.darker,
          borderRightColor: COLORS.primary,
          borderRightWidth: "2px",
        }}
      >
        <div
          className="p-4 flex items-center justify-center border-b"
          style={{
            borderBottomColor: COLORS.primary,
            borderBottomWidth: "2px",
          }}
        >
          <div className="flex items-center gap-2">
            <Zap size={28} style={{ color: COLORS.primary }} />
            <h1 className={`font-bold text-2xl ${!sidebarOpen && "hidden"}`} style={{ color: COLORS.primary }}>
              REX
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !activeService;
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <div key={item.id}>
                <button
                  onClick={() => handleTabClick(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition justify-end"
                  style={{
                    backgroundColor: isActive ? COLORS.primary : "transparent",
                    color: isActive ? COLORS.darker : COLORS.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = COLORS.card;
                      e.currentTarget.style.color = COLORS.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = COLORS.textSecondary;
                    }
                  }}
                >
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  {hasSubmenu ? (
                    <ChevronDown size={18} style={{ transform: servicesOpen ? "rotate(-180deg)" : "rotate(0)" }} className="transition" />
                  ) : (
                    <Icon size={18} />
                  )}
                </button>

                {/* Submenu */}
                {hasSubmenu && servicesOpen && sidebarOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subitem: any) => {
                      const SubIcon = subitem.icon;
                      const isSubActive = activeService === subitem.id;
                      return (
                        <button
                          key={subitem.id}
                          onClick={() => {
                            setActiveTab("services");
                            setActiveService(subitem.id);
                            setShowAddForm(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition justify-end text-sm"
                          style={{
                            backgroundColor: isSubActive ? COLORS.secondary : "transparent",
                            color: isSubActive ? COLORS.darker : COLORS.textSecondary,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = COLORS.card;
                              e.currentTarget.style.color = COLORS.secondary;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = COLORS.textSecondary;
                            }
                          }}
                        >
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
    { label: "إجمالي الموديلات", value: models.length, color: COLORS.primary, icon: Users },
    { label: "إجمالي المعلقين", value: voices.length, color: COLORS.secondary, icon: Mic },
    { label: "إجمالي صناع المحتوى", value: creators.length, color: COLORS.info, icon: Film },
    { label: "إجمالي الفيديوهات", value: videos.length, color: COLORS.warning, icon: Film },
    { label: "إجمالي الكتابات", value: writings.length, color: COLORS.success, icon: PenTool },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" dir="rtl">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="p-6 rounded-xl shadow-lg border-l-4 transition hover:shadow-xl hover:scale-105"
            style={{
              backgroundColor: COLORS.card,
              borderLeftColor: stat.color,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon size={32} style={{ color: stat.color }} />
            </div>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              {stat.label}
            </p>
            <p className="text-4xl font-bold mt-2" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ServicesOverviewTab({ models, voices, creators, videos, writings, onSelectService }: any) {
  const services = [
    { id: "models", label: "الموديلات", count: models.length, icon: Users, color: COLORS.primary },
    { id: "voices", label: "التعليق الصوتي", count: voices.length, icon: Mic, color: COLORS.secondary },
    { id: "creators", label: "صناع المحتوى", count: creators.length, icon: Film, color: COLORS.info },
    { id: "videos", label: "إنتاج الفيديو", count: videos.length, icon: Film, color: COLORS.warning },
    { id: "writers", label: "كتابة المحتوى", count: writings.length, icon: PenTool, color: COLORS.success },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" dir="rtl">
      {services.map((service: any) => {
        const Icon = service.icon;
        return (
          <button
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className="rounded-xl shadow-lg p-6 hover:shadow-2xl transition text-right border-t-4 hover:scale-105"
            style={{
              backgroundColor: COLORS.card,
              borderTopColor: service.color,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon size={32} style={{ color: service.color }} />
              <span className="text-3xl font-bold" style={{ color: service.color }}>
                {service.count}
              </span>
            </div>
            <p className="font-semibold text-white text-lg">{service.label}</p>
            <p className="text-sm mt-2" style={{ color: COLORS.textSecondary }}>
              اضغط للإدارة
            </p>
          </button>
        );
      })}
    </div>
  );
}

// Add Forms
function AddModelForm({ onClose }: any) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "female",
    age: "",
    vimeoUrl: "",
  });

  const createMutation = trpc.models.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        name: formData.name,
        gender: formData.gender,
        age: parseInt(formData.age),
        vimeoUrl: formData.vimeoUrl,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({ name: "", gender: "female", age: "", vimeoUrl: "" });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            إضافة مودل جديد
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded">
            <X size={24} style={{ color: COLORS.primary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              الاسم
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text, borderColor: COLORS.border }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              الجنس
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
            >
              <option value="female">أنثى</option>
              <option value="male">ذكر</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              العمر
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              رابط عمل عينة (VIMEO)
            </label>
            <input
              type="url"
              value={formData.sampleWorks}
              onChange={(e) => setFormData({ ...formData, sampleWorks: e.target.value })}
              placeholder="https://vimeo.com/..."
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-bold transition"
            style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}
          >
            إضافة
          </button>
        </form>
      </div>
    </div>
  );
}

function AddCreatorForm({ onClose }: any) {
  const [formData, setFormData] = useState({
    name: "",
    platforms: "",
    contentTypes: "",
    sampleWorks: "",
  });

  const createMutation = trpc.contentCreators.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        name: formData.name,
        platforms: formData.platforms,
        contentTypes: formData.contentTypes,
        sampleWorks: formData.sampleWorks,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({ name: "", platforms: "", contentTypes: "", sampleWorks: "" });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            إضافة صانع محتوى جديد
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded">
            <X size={24} style={{ color: COLORS.primary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              الاسم
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              المنصات (مثال: Instagram, TikTok, YouTube)
            </label>
            <input
              type="text"
              value={formData.platforms}
              onChange={(e) => setFormData({ ...formData, platforms: e.target.value })}
              placeholder="Instagram, TikTok"
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              نوع المحتوى
            </label>
            <select
              value={formData.contentTypes}
              onChange={(e) => setFormData({ ...formData, contentTypes: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
            >
              <option value="">اختر التخصص</option>
              <option value="beauty">جمال</option>
              <option value="fashion">أزياء</option>
              <option value="lifestyle">نمط حياة</option>
              <option value="fitness">لياقة بدنية</option>
              <option value="food">طعام</option>
              <option value="travel">سفر</option>
              <option value="education">تعليم</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              رابط عمل عينة (VIMEO)
            </label>
            <input
              type="url"
              value={formData.sampleWorks}
              onChange={(e) => setFormData({ ...formData, sampleWorks: e.target.value })}
              placeholder="https://vimeo.com/..."
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-bold transition"
            style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}
          >
            إضافة
          </button>
        </form>
      </div>
    </div>
  );
}

function AddVoiceForm({ onClose }: any) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "female",
    voiceType: "neutral",
    language: "ar",
    audioFile: null as File | null,
  });

  const createMutation = trpc.voiceArtists.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.audioFile) {
      alert("يرجى تحميل ملف صوتي");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("voiceType", formData.voiceType);
    formDataToSend.append("language", formData.language);
    formDataToSend.append("audioFile", formData.audioFile);

    createMutation.mutate(formDataToSend as any,
      {
        onSuccess: () => {
          onClose();
          setFormData({ name: "", gender: "female", voiceType: "neutral", language: "ar", audioFile: null });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            إضافة معلق صوتي جديد
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded">
            <X size={24} style={{ color: COLORS.primary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              الاسم
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              الجنس
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
            >
              <option value="female">أنثى</option>
              <option value="male">ذكر</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              نوع الصوت
            </label>
            <select
              value={formData.voiceType}
              onChange={(e) => setFormData({ ...formData, voiceType: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
            >
              <option value="neutral">محايد</option>
              <option value="deep">عميق</option>
              <option value="high">حاد</option>
              <option value="soft">ناعم</option>
              <option value="energetic">نشيط</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              اللغة
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
            >
              <option value="ar">العربية</option>
              <option value="en">الإنجليزية</option>
              <option value="fr">الفرنسية</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              تحميل ملف صوتي
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFormData({ ...formData, audioFile: e.target.files?.[0] || null })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-bold transition"
            style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}
          >
            إضافة
          </button>
        </form>
      </div>
    </div>
  );
}

function AddVideoForm({ onClose }: any) {
  const [formData, setFormData] = useState({
    title: "",
    productionType: "commercial",
    duration: "",
    vimeoUrl: "",
  });

  const createMutation = trpc.videoProductions.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        title: formData.title,
        productionType: formData.productionType,
        duration: formData.duration,
        vimeoUrl: formData.vimeoUrl,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({ title: "", productionType: "commercial", duration: "", vimeoUrl: "" });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            إضافة فيديو جديد
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded">
            <X size={24} style={{ color: COLORS.primary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              العنوان
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              نوع الإنتاج
            </label>
            <select
              value={formData.productionType}
              onChange={(e) => setFormData({ ...formData, productionType: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
            >
              <option value="commercial">إعلان تجاري</option>
              <option value="documentary">وثائقي</option>
              <option value="music_video">فيديو موسيقي</option>
              <option value="tutorial">درس تعليمي</option>
              <option value="promotional">ترويجي</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              المدة (بالدقائق)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              رابط VIMEO
            </label>
            <input
              type="url"
              value={formData.vimeoUrl}
              onChange={(e) => setFormData({ ...formData, vimeoUrl: e.target.value })}
              placeholder="https://vimeo.com/..."
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-bold transition"
            style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}
          >
            إضافة
          </button>
        </form>
      </div>
    </div>
  );
}

function AddWriterForm({ onClose }: any) {
  const [formData, setFormData] = useState({
    title: "",
    contentType: "blog",
    specialization: "",
  });

  const createMutation = trpc.contentWriting.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        title: formData.title,
        contentType: formData.contentType,
        specialization: formData.specialization,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({ title: "", contentType: "blog", specialization: "" });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="p-8 rounded-xl w-full max-w-md" style={{ backgroundColor: COLORS.card }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            إضافة كاتب محتوى جديد
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded">
            <X size={24} style={{ color: COLORS.primary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              العنوان
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              نوع المحتوى
            </label>
            <select
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
            >
              <option value="blog">مدونة</option>
              <option value="social_media">وسائل اجتماعية</option>
              <option value="seo">SEO</option>
              <option value="copywriting">كتابة إعلانية</option>
              <option value="technical">تقنية</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: COLORS.textSecondary }}>
              التخصص
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="مثال: تكنولوجيا، صحة، تجارة"
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.dark, color: COLORS.text }}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-bold transition"
            style={{ backgroundColor: COLORS.primary, color: COLORS.darker }}
          >
            إضافة
          </button>
        </form>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.card }}>
      <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
        الطلبات
      </h3>
      <p style={{ color: COLORS.textSecondary }}>قسم الطلبات قيد التطوير...</p>
    </div>
  );
}

function ClientsTab() {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.card }}>
      <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
        العملاء
      </h3>
      <p style={{ color: COLORS.textSecondary }}>قسم العملاء قيد التطوير...</p>
    </div>
  );
}

function MediaTab() {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.card }}>
      <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
        الوسائط
      </h3>
      <p style={{ color: COLORS.textSecondary }}>قسم الوسائط قيد التطوير...</p>
    </div>
  );
}

function CMSTab() {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.card }}>
      <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
        المحتوى
      </h3>
      <p style={{ color: COLORS.textSecondary }}>قسم المحتوى قيد التطوير...</p>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.card }}>
      <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
        الإعدادات
      </h3>
      <p style={{ color: COLORS.textSecondary }}>قسم الإعدادات قيد التطوير...</p>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.card }}>
      <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
        التقارير
      </h3>
      <p style={{ color: COLORS.textSecondary }}>قسم التقارير قيد التطوير...</p>
    </div>
  );
}

function DataTable({ title, data, columns, onDelete, onAdd }: any) {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.card }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
          {title}
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition"
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.darker,
          }}
        >
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
                  <th
                    key={col}
                    className="px-4 py-3 text-right font-semibold"
                    style={{ color: COLORS.primary }}
                  >
                    {col}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold" style={{ color: COLORS.primary }}>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any, idx: number) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? COLORS.dark : "transparent",
                    borderBottomColor: COLORS.border,
                    borderBottomWidth: "1px",
                  }}
                >
                  {columns.map((col: string) => (
                    <td key={col} className="px-4 py-3" style={{ color: COLORS.text }}>
                      {item[col]}
                    </td>
                  ))}
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-2 rounded-lg transition"
                      style={{
                        backgroundColor: COLORS.info,
                        color: COLORS.text,
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-2 rounded-lg transition"
                      style={{
                        backgroundColor: COLORS.warning,
                        color: COLORS.text,
                      }}
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
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
