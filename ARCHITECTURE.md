# معمارية المشروع

## نظرة عامة

المشروع مبني على معمارية **Full-Stack** مع فصل واضح بين الأمام والخلف:

```
┌─────────────────────────────────────────────────────────────┐
│                    المتصفح (Browser)                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            React Frontend (client/)                  │  │
│  │  - Pages (صفحات)                                    │  │
│  │  - Components (مكونات)                              │  │
│  │  - Hooks (خطافات)                                   │  │
│  │  - Styles (أنماط)                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    Node.js Server                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Express API (server/)                      │  │
│  │  - Routes (المسارات)                                │  │
│  │  - Controllers (المتحكمات)                          │  │
│  │  - Middleware (البرامج الوسيطة)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Drizzle ORM (drizzle/)                          │  │
│  │  - Schema (تعريف الجداول)                           │  │
│  │  - Migrations (الهجرات)                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ SQL
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
│  - models (الموديلات)                                      │
│  - voiceArtists (المعلقون الصوتيون)                         │
│  - contentCreators (صناع المحتوى)                           │
│  - videoProductions (إنتاج الفيديو)                         │
│  - contentWriting (كتابة المحتوى)                           │
└─────────────────────────────────────────────────────────────┘
```

## 1. الطبقة الأمامية (Frontend Layer)

### المسار: `client/src/`

#### الصفحات (`pages/`)
- **Home.tsx** - الصفحة الرئيسية
- **AdminDashboard.tsx** - لوحة التحكم الإدارية

#### المكونات (`components/`)
- **Header.tsx** - رأس الصفحة
- **Footer.tsx** - تذييل الصفحة
- **DashboardLayout.tsx** - تخطيط لوحة التحكم
- **ui/** - مكونات shadcn/ui الأساسية

#### الخطافات (`hooks/`)
- **useAuth.ts** - إدارة المصادقة
- **useQuery** - استدعاء البيانات

#### المساعدات (`lib/`)
- **trpc.ts** - عميل tRPC للاتصال بالخادم
- **utils.ts** - دوال مساعدة عامة

#### الأنماط
- **index.css** - الأنماط العامة والمتغيرات

### التدفق

```
User Input
    ↓
React Component
    ↓
useQuery/useMutation (tRPC)
    ↓
API Call to Server
    ↓
Response
    ↓
UI Update
```

## 2. الطبقة الخلفية (Backend Layer)

### المسار: `server/`

#### الموجهات (`routers.ts`)
```typescript
// تعريف جميع API endpoints
trpc.router()
  .query('models.getAll', ...)
  .mutation('models.create', ...)
  .mutation('models.delete', ...)
  // ... وهكذا لكل الخدمات
```

#### الخادم (`index.ts`)
- إعدادات Express
- Middleware
- معالجة الأخطاء

#### المكتبات الأساسية (`_core/`)
- الدوال المساعدة
- التكوينات

### التدفق

```
HTTP Request
    ↓
Express Router
    ↓
tRPC Procedure
    ↓
Database Query (Drizzle)
    ↓
Response
    ↓
HTTP Response
```

## 3. طبقة قاعدة البيانات (Database Layer)

### المسار: `drizzle/`

#### التعريفات (`schema.ts`)
```typescript
// تعريف جميع الجداول
export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  gender: varchar('gender'),
  age: integer('age'),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// ... وهكذا لكل جدول
```

#### الهجرات (`migrations/`)
- ملفات SQL للتغييرات على قاعدة البيانات
- تسجيل تاريخ كل تغيير

### الجداول الرئيسية

| الجدول | الوصف | الحقول الرئيسية |
|--------|-------|-----------------|
| models | الموديلات | id, name, gender, age, isActive |
| voiceArtists | المعلقون | id, name, gender, voiceType, isActive |
| contentCreators | صناع المحتوى | id, name, platforms, isActive |
| videoProductions | الفيديوهات | id, title, productionType, isActive |
| contentWriting | الكتابات | id, title, contentType, isActive |

## 4. الملفات المشتركة (Shared)

### المسار: `shared/`

#### الثوابت (`const.ts`)
- الثوابت المستخدمة في كل من الأمام والخلف
- رسائل الخطأ
- رموز الحالات

## 5. التكوينات

### `vite.config.ts`
- إعدادات بناء Vite
- معالجة الملفات
- تحسين الأداء

### `drizzle.config.ts`
- إعدادات قاعدة البيانات
- معلومات الاتصال

### `tsconfig.json`
- إعدادات TypeScript
- مسارات الاستيراد

## 6. تدفق البيانات

### إضافة موديل جديد

```
1. المستخدم يملأ النموذج في AdminDashboard
   ↓
2. onClick → useMutation('models.create')
   ↓
3. tRPC يرسل البيانات إلى الخادم
   ↓
4. Server → models.create procedure
   ↓
5. Drizzle ORM → INSERT into models table
   ↓
6. Database → حفظ البيانات
   ↓
7. Response → tRPC يعيد البيانات
   ↓
8. Frontend → تحديث الواجهة
```

## 7. معايير الكود

### تسمية الملفات
- **Components**: PascalCase (e.g., `AdminDashboard.tsx`)
- **Utilities**: camelCase (e.g., `useAuth.ts`)
- **Styles**: lowercase (e.g., `index.css`)

### هيكل المكون
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function MyComponent() {
  const [state, setState] = useState('');
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### معالجة الأخطاء
```typescript
try {
  const result = await mutation.mutate(data);
} catch (error) {
  console.error('Error:', error);
  // عرض رسالة خطأ للمستخدم
}
```

## 8. الأداء والتحسينات

### Code Splitting
- استخدام `React.lazy()` للصفحات الثقيلة
- تحميل المكونات عند الحاجة

### Caching
- استخدام React Query للتخزين المؤقت
- تقليل الطلبات غير الضرورية

### Database Optimization
- استخدام الفهارس على الأعمدة المهمة
- تحسين الاستعلامات

## 9. الأمان

### المصادقة
- JWT tokens
- Session management

### التحقق من الصحة
- Server-side validation
- Input sanitization

### CORS
- تكوين CORS للطلبات الآمنة

---

**آخر تحديث**: ديسمبر 2025
