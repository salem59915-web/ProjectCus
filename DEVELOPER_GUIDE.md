# دليل المبرمج - REX

دليل شامل لفهم وتطوير مشروع REX.

## 🚀 البدء السريع

### المتطلبات
- Node.js 22+
- pnpm 10+
- Git

### التثبيت والتشغيل

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd digital-services

# 2. تثبيت المتطلبات
pnpm install

# 3. إعداد قاعدة البيانات
pnpm db:push

# 4. تشغيل خادم التطوير
pnpm dev
```

الموقع سيكون متاحاً على: `http://localhost:3000`

## 📚 فهم البنية

### المجلدات الرئيسية

#### `client/src/` - تطبيق React
```
pages/          → صفحات التطبيق (Home, AdminDashboard, إلخ)
components/     → مكونات قابلة لإعادة الاستخدام
hooks/          → منطق مشترك (useAuth, useMobile, إلخ)
lib/            → أدوات ومساعدات (trpc, utils, إلخ)
contexts/       → حالة عامة (ThemeContext)
index.css       → الأنماط العامة والألوان
```

#### `server/` - خادم Node.js
```
_core/          → وظائف أساسية (OAuth, Storage, LLM, إلخ)
routers.ts      → تعريف جميع API endpoints
db.ts           → اتصال قاعدة البيانات
storage.ts      → خدمات التخزين (S3)
```

#### `drizzle/` - قاعدة البيانات
```
schema.ts       → تعريف جميع الجداول
relations.ts    → العلاقات بين الجداول
migrations/     → سجل التغييرات
```

## 🔄 تدفق البيانات

### مثال: إضافة موديل جديد

```
1. المستخدم يملأ النموذج في AdminDashboard
   ↓
2. onClick → useMutation('models.create')
   ↓
3. tRPC يرسل البيانات إلى الخادم
   ↓
4. server/routers.ts → models.create procedure
   ↓
5. Drizzle ORM → INSERT into models table
   ↓
6. Database → حفظ البيانات
   ↓
7. Response → tRPC يعيد البيانات
   ↓
8. Frontend → تحديث الواجهة
```

## 💻 أمثلة عملية

### 1. إضافة صفحة جديدة

```typescript
// client/src/pages/NewPage.tsx
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NewPage() {
  return (
    <>
      <Header />
      <main className="container py-12">
        <h1 className="text-4xl font-bold">صفحة جديدة</h1>
        {/* المحتوى */}
      </main>
      <Footer />
    </>
  );
}
```

ثم أضفها في `App.tsx`:
```typescript
import NewPage from "./pages/NewPage";

<Route path="/new-page" component={NewPage} />
```

### 2. إضافة API endpoint

في `server/routers.ts`:
```typescript
export const appRouter = router({
  // ... endpoints أخرى
  
  newFeature: router({
    getAll: publicProcedure
      .query(async () => {
        return await db.query.newTable.findMany();
      }),
    
    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input }) => {
        return await db.insert(newTable).values(input);
      }),
  }),
});
```

ثم استخدمه في الـ Frontend:
```typescript
const { data } = trpc.newFeature.getAll.useQuery();
const createMutation = trpc.newFeature.create.useMutation();

createMutation.mutate({ name: "test" });
```

### 3. إضافة جدول جديد

في `drizzle/schema.ts`:
```typescript
export const newTable = pgTable('new_table', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

ثم شغّل:
```bash
pnpm db:push
```

## 🎨 الأنماط والألوان

### المتغيرات المتاحة في Tailwind

```css
/* في index.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    /* ... متغيرات أخرى */
  }
}
```

استخدمها في المكونات:
```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    اضغط هنا
  </button>
</div>
```

## 🔐 المصادقة والأمان

### استخدام `useAuth` hook

```typescript
import { useAuth } from "@/_core/hooks/useAuth";

export default function ProtectedComponent() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>جاري التحميل...</div>;
  if (!user) return <div>يجب تسجيل الدخول</div>;
  
  return <div>مرحباً {user.name}</div>;
}
```

### حماية API endpoints

```typescript
// public endpoint
publicProcedure.query(async () => {
  // متاح للجميع
});

// protected endpoint
protectedProcedure.query(async ({ ctx }) => {
  // متاح فقط للمستخدمين المسجلين
  console.log(ctx.user);
});
```

## 📤 رفع الملفات

### استخدام `ImageUpload` component

```typescript
import { ImageUpload } from "@/components/ImageUpload";

export default function MyComponent() {
  const handleUpload = (url: string) => {
    console.log("صورة مرفوعة:", url);
  };
  
  return <ImageUpload onUpload={handleUpload} />;
}
```

### رفع يدوي إلى S3

```typescript
import { storagePut } from "@/server/storage";

const { url } = await storagePut("my-file", fileData);
```

## 🧪 الاختبار

### تشغيل الاختبارات

```bash
pnpm test
```

### كتابة اختبار جديد

```typescript
// server/my-feature.test.ts
import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("My Feature", () => {
  it("should work", async () => {
    const result = await appRouter.createCaller({}).myFeature.getAll();
    expect(result).toBeDefined();
  });
});
```

## 🐛 استكشاف الأخطاء

### أخطاء شائعة

#### 1. "Module not found"
```
❌ import { something } from "../../../shared/types";
✅ import { something } from "@shared/types";
```

#### 2. "Cannot find module 'react'"
```bash
pnpm install
```

#### 3. "Database connection error"
```bash
# تحقق من DATABASE_URL
echo $DATABASE_URL

# أعد محاولة الاتصال
pnpm db:push
```

## 📦 الأوامر المتاحة

```bash
# التطوير
pnpm dev              # تشغيل خادم التطوير

# البناء والإنتاج
pnpm build            # بناء للإنتاج
pnpm start            # تشغيل الإنتاج

# قاعدة البيانات
pnpm db:push          # تطبيق الهجرات
pnpm db:studio        # فتح Drizzle Studio

# الاختبار والفحص
pnpm test             # تشغيل الاختبارات
pnpm check            # فحص TypeScript

# التنسيق
pnpm format           # تنسيق الكود
```

## 🔗 المسارات المهمة

```
@/                    → client/src/
@shared/              → shared/
@/components/ui/      → مكونات shadcn/ui
@/pages/              → صفحات التطبيق
@/lib/                → أدوات ومساعدات
```

## 📚 المراجع

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)
- [Express.js](https://expressjs.com)

## 💡 نصائح مهمة

1. **استخدم TypeScript** - يساعد في اكتشاف الأخطاء مبكراً
2. **اتبع معايير الكود** - استخدم `pnpm format`
3. **أضف اختبارات** - لكل ميزة جديدة
4. **وثّق الكود** - اكتب تعليقات واضحة
5. **استخدم Components** - أعد استخدام المكونات

## 🆘 طلب المساعدة

إذا واجهت مشكلة:

1. تحقق من السجلات: `pnpm dev` (انظر الأخطاء)
2. تحقق من TypeScript: `pnpm check`
3. جرّب إعادة التثبيت: `rm -rf node_modules && pnpm install`
4. ابحث في الملفات الموجودة عن أمثلة مشابهة

---

**آخر تحديث**: ديسمبر 2025
