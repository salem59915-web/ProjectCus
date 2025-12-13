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
} from "lucide-react";

type TabType = "overview" | "services" | "orders" | "clients" | "media" | "cms" | "settings" | "reports";
type ServiceType = "models" | "voices" | "creators" | "videos" | "writers" | null;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceType>(null);

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
          return <DataTable title="إدارة الموديلات" data={allModels} columns={["name", "gender", "age"]} onDelete={(id) => deleteModelMutation.mutate({ id })} />;
        case "voices":
          return <DataTable title="إدارة التعليق الصوتي" data={allVoices} columns={["name", "gender", "voiceType"]} onDelete={(id) => deleteVoiceMutation.mutate({ id })} />;
        case "creators":
          return <DataTable title="إدارة صناع المحتوى" data={allCreators} columns={["name", "platforms"]} onDelete={(id) => deleteCreatorMutation.mutate({ id })} />;
        case "videos":
          return <DataTable title="إدارة إنتاج الفيديو" data={allVideos} columns={["title", "productionType"]} onDelete={(id) => deleteVideoMutation.mutate({ id })} />;
        case "writers":
          return <DataTable title="إدارة كتابة المحتوى" data={allWritings} columns={["title", "contentType"]} onDelete={(id) => deleteWritingMutation.mutate({ id })} />;
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
    <div className="flex h-screen bg-gray-900" dir="rtl">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b px-6 py-4 flex items-center justify-between shadow text-white" style={{ borderBottomColor: "#FFBD59" }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-700 rounded text-white">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white" style={{ color: "#FFBD59" }}>
            {activeService ? serviceItems.find((s) => s.id === activeService)?.label : menuItems.find((m) => m.id === activeTab)?.label}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
      </div>

      {/* Sidebar - Right Side */}
      <div className="bg-gray-900 text-white transition-all duration-300 flex flex-col border-r border-gray-700" style={{ width: sidebarOpen ? "256px" : "80px" }}>
        <div className="p-4 flex items-center justify-center border-b border-gray-700">
          <h1 className={`font-bold text-xl ${!sidebarOpen && "hidden"}`} style={{ color: "#FFBD59" }}>REX</h1>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !activeService;
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <div key={item.id}>
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition justify-end ${
                    isActive ? "text-gray-900" : "text-gray-300 hover:bg-gray-800"
                  }`}
                  style={isActive ? { backgroundColor: "#FFBD59" } : {}}
                >
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
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
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition justify-end text-sm ${
                            isSubActive ? "text-gray-900" : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                          }`}
                          style={isSubActive ? { backgroundColor: "#FFBD59" } : {}}
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
    { label: "إجمالي الموديلات", value: models.length, color: "#FFBD59" },
    { label: "إجمالي المعلقين", value: voices.length, color: "#E8A76F" },
    { label: "إجمالي صناع المحتوى", value: creators.length, color: "#D49A5F" },
    { label: "إجمالي الفيديوهات", value: videos.length, color: "#C08D4F" },
    { label: "إجمالي الكتابات", value: writings.length, color: "#A8804F" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" dir="rtl">
      {stats.map((stat, i) => (
        <div key={i} className="text-white p-6 rounded-lg shadow" style={{ backgroundColor: stat.color }}>
          <p className="text-sm opacity-90">{stat.label}</p>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function ServicesOverviewTab({ models, voices, creators, videos, writings, onSelectService }: any) {
  const services = [
    { id: "models", label: "الموديلات", count: models.length, icon: Users },
    { id: "voices", label: "التعليق الصوتي", count: voices.length, icon: Mic },
    { id: "creators", label: "صناع المحتوى", count: creators.length, icon: Film },
    { id: "videos", label: "إنتاج الفيديو", count: videos.length, icon: Film },
    { id: "writers", label: "كتابة المحتوى", count: writings.length, icon: PenTool },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" dir="rtl">
      {services.map((service: any) => {
        const Icon = service.icon;
        return (
          <button
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className="bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition text-right text-white border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <Icon size={32} style={{ color: "#FFBD59" }} />
              <span className="text-2xl font-bold" style={{ color: "#FFBD59" }}>
                {service.count}
              </span>
            </div>
            <p className="font-semibold text-white">{service.label}</p>
            <p className="text-sm text-gray-400 mt-2">اضغط للإدارة</p>
          </button>
        );
      })}
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-gray-700" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <Button className="gap-2" style={{ backgroundColor: "#FFBD59", color: "#1F2937" }}>
          <Plus size={18} /> طلب جديد
        </Button>
        <h3 className="text-xl font-bold text-white">إدارة الطلبات</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-4 py-2 text-right text-white">رقم الطلب</th>
              <th className="px-4 py-2 text-right text-white">العميل</th>
              <th className="px-4 py-2 text-right text-white">الخدمة</th>
              <th className="px-4 py-2 text-right text-white">الحالة</th>
              <th className="px-4 py-2 text-right text-white">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700 hover:bg-gray-700">
              <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                لا توجد طلبات حالياً
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientsTab() {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-gray-700" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <Button className="gap-2" style={{ backgroundColor: "#FFBD59", color: "#1F2937" }}>
          <Plus size={18} /> عميل جديد
        </Button>
        <h3 className="text-xl font-bold text-white">إدارة العملاء</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-4 py-2 text-right text-white">الاسم</th>
              <th className="px-4 py-2 text-right text-white">الإيميل</th>
              <th className="px-4 py-2 text-right text-white">الجوال</th>
              <th className="px-4 py-2 text-right text-white">عدد الطلبات</th>
              <th className="px-4 py-2 text-right text-white">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700 hover:bg-gray-700">
              <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                لا يوجد عملاء حالياً
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MediaTab() {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-gray-700" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <Button className="gap-2" style={{ backgroundColor: "#FFBD59", color: "#1F2937" }}>
          <Plus size={18} /> رفع وسائط
        </Button>
        <h3 className="text-xl font-bold text-white">إدارة الوسائط</h3>
      </div>
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
        <ImageIcon size={48} className="mx-auto mb-4" style={{ color: "#FFBD59" }} />
        <p className="text-gray-400">اسحب الملفات هنا أو انقر للرفع</p>
      </div>
    </div>
  );
}

function CMSTab() {
  const pages = [
    "الصفحة الرئيسية",
    "من نحن",
    "خدماتنا",
    "الأسئلة الشائعة",
    "صفحة المودلز",
    "صفحة التعليق الصوتي",
    "سياسة الخصوصية",
    "الشروط والأحكام",
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-gray-700" dir="rtl">
      <h3 className="text-xl font-bold mb-4">إدارة المحتوى</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pages.map((page, i) => (
          <div key={i} className="border border-gray-700 rounded-lg p-4 hover:shadow-lg transition bg-gray-700">
            <p className="font-semibold mb-3 text-white">{page}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 text-white border-gray-600 hover:bg-gray-600">
                تعديل
              </Button>
              <Button size="sm" variant="outline" className="text-white border-gray-600 hover:bg-gray-600">
                عرض
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-gray-700" dir="rtl">
      <h3 className="text-xl font-bold mb-6 text-white">الإعدادات</h3>
      <div className="space-y-6 max-w-2xl">
        <div className="border-b border-gray-700 pb-4">
          <h4 className="font-semibold mb-3 text-white">إعدادات الموقع</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">اسم الموقع</label>
              <Input defaultValue="REX" className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الشعار</label>
              <Input type="file" className="bg-gray-700 border-gray-600 text-white" />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-700 pb-4">
          <h4 className="font-semibold mb-3 text-white">بوابات الدفع</h4>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" /> Stripe
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" /> Tap
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" /> Paymob
            </label>
          </div>
        </div>

        <div className="border-b border-gray-700 pb-4">
          <h4 className="font-semibold mb-3 text-white">الإشعارات</h4>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" defaultChecked /> إشعارات البريد
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" defaultChecked /> إشعارات النظام
            </label>
          </div>
        </div>

        <Button className="w-full" style={{ backgroundColor: "#FFBD59", color: "#1F2937" }}>
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
}

function ReportsTab() {
  const reports = [
    { title: "الدخل اليومي", icon: "📊" },
    { title: "الدخل الأسبوعي", icon: "📈" },
    { title: "الدخل الشهري", icon: "💰" },
    { title: "أكثر المواهب مبيعاً", icon: "⭐" },
    { title: "معدل إكمال الطلبات", icon: "✅" },
    { title: "أعلى 10 عملاء", icon: "👥" },
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-white border border-gray-700" dir="rtl">
      <h3 className="text-xl font-bold mb-4 text-white">التقارير</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, i) => (
          <button key={i} className="border border-gray-700 rounded-lg p-4 hover:shadow-lg transition text-center hover:bg-gray-700 bg-gray-700">
            <div className="text-3xl mb-2">{report.icon}</div>
            <p className="font-semibold text-white">{report.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

interface DataTableProps {
  title: string;
  data: any[];
  columns: string[];
  onDelete: (id: number) => void;
}

function DataTable({ title, data, columns, onDelete }: DataTableProps) {
  const columnLabels: Record<string, string> = {
    name: "الاسم",
    gender: "الجنس",
    age: "العمر",
    voiceType: "نوع الصوت",
    platforms: "المنصات",
    title: "العنوان",
    productionType: "نوع الإنتاج",
    contentType: "نوع المحتوى",
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow text-white border border-gray-700" dir="rtl">
      <div className="p-6 border-b flex items-center justify-between border-gray-700" style={{ borderBottomColor: "#FFBD59" }}>
        <Button className="gap-2" style={{ backgroundColor: "#FFBD59", color: "#1F2937" }}>
          <Plus size={18} /> إضافة جديد
        </Button>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-4 py-3 text-right text-white">الإجراءات</th>
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-right text-white">
                  {columnLabels[col] || col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button className="p-1 hover:bg-gray-600 rounded" style={{ color: "#FFBD59" }}>
                      <Eye size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-600 rounded" style={{ color: "#FFBD59" }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-1 text-red-500 hover:bg-gray-600 rounded">
                      <Trash2 size={16} />
                    </button>
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-gray-300">
                      {String(item[col] || "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
