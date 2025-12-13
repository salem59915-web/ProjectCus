# توثيق قاعدة البيانات - REX

شرح شامل لهيكل قاعدة البيانات والجداول.

## 📊 نظرة عامة

المشروع يستخدم **PostgreSQL** مع **Drizzle ORM** لإدارة قاعدة البيانات.

### الملف الرئيسي: `drizzle/schema.ts`

جميع تعريفات الجداول موجودة في ملف واحد لسهولة الإدارة.

---

## 🗂️ الجداول الرئيسية

### 1. جدول `models` (الموديلات)

**الوصف**: يحتوي على معلومات الموديلات.

```typescript
export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  gender: varchar('gender').notNull(),
  age: integer('age'),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

| الحقل | النوع | الوصف |
|------|-------|-------|
| `id` | serial | معرّف فريد (مفتاح أساسي) |
| `name` | varchar | اسم الموديل |
| `gender` | varchar | الجنس (male/female) |
| `age` | integer | العمر |
| `isActive` | boolean | حالة التفعيل (افتراضي: true) |
| `createdAt` | timestamp | تاريخ الإنشاء |

**أمثلة الاستخدام**:

```typescript
// إضافة موديل
await db.insert(models).values({
  name: "فاطمة",
  gender: "female",
  age: 22,
});

// الحصول على جميع الموديلات
const allModels = await db.query.models.findMany();

// البحث عن موديل
const model = await db.query.models.findFirst({
  where: eq(models.id, 1),
});

// تحديث موديل
await db.update(models)
  .set({ age: 23 })
  .where(eq(models.id, 1));

// حذف موديل
await db.delete(models)
  .where(eq(models.id, 1));
```

---

### 2. جدول `voiceArtists` (المعلقون الصوتيون)

**الوصف**: معلومات المعلقين الصوتيين.

```typescript
export const voiceArtists = pgTable('voice_artists', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  gender: varchar('gender').notNull(),
  voiceType: varchar('voice_type'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

| الحقل | النوع | الوصف |
|------|-------|-------|
| `id` | serial | معرّف فريد |
| `name` | varchar | اسم المعلق |
| `gender` | varchar | الجنس |
| `voiceType` | varchar | نوع الصوت (deep, soft, إلخ) |
| `isActive` | boolean | حالة التفعيل |
| `createdAt` | timestamp | تاريخ الإنشاء |

---

### 3. جدول `contentCreators` (صناع المحتوى)

**الوصف**: معلومات صناع المحتوى.

```typescript
export const contentCreators = pgTable('content_creators', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  platforms: varchar('platforms'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

| الحقل | النوع | الوصف |
|------|-------|-------|
| `id` | serial | معرّف فريد |
| `name` | varchar | اسم صانع المحتوى |
| `platforms` | varchar | المنصات (Instagram, TikTok, إلخ) |
| `isActive` | boolean | حالة التفعيل |
| `createdAt` | timestamp | تاريخ الإنشاء |

---

### 4. جدول `videoProductions` (إنتاج الفيديو)

**الوصف**: معلومات الفيديوهات المُنتجة.

```typescript
export const videoProductions = pgTable('video_productions', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  productionType: varchar('production_type'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

| الحقل | النوع | الوصف |
|------|-------|-------|
| `id` | serial | معرّف فريد |
| `title` | varchar | عنوان الفيديو |
| `productionType` | varchar | نوع الإنتاج (commercial, documentary, إلخ) |
| `isActive` | boolean | حالة التفعيل |
| `createdAt` | timestamp | تاريخ الإنشاء |

---

### 5. جدول `contentWriting` (كتابة المحتوى)

**الوصف**: معلومات الكتابات والمقالات.

```typescript
export const contentWriting = pgTable('content_writing', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  contentType: varchar('content_type'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

| الحقل | النوع | الوصف |
|------|-------|-------|
| `id` | serial | معرّف فريد |
| `title` | varchar | عنوان الكتابة |
| `contentType` | varchar | نوع المحتوى (article, blog, إلخ) |
| `isActive` | boolean | حالة التفعيل |
| `createdAt` | timestamp | تاريخ الإنشاء |

---

## 🔗 العلاقات

حالياً، الجداول مستقلة عن بعضها. يمكن إضافة علاقات في المستقبل:

```typescript
// مثال: علاقة بين الموديلات والطلبات
export const ordersRelations = relations(orders, ({ one }) => ({
  model: one(models, {
    fields: [orders.modelId],
    references: [models.id],
  }),
}));
```

---

## 📝 العمليات الشائعة

### 1. إضافة جدول جديد

**الخطوة 1**: عرّف الجدول في `drizzle/schema.ts`

```typescript
export const newTable = pgTable('new_table', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**الخطوة 2**: طبّق الهجرة

```bash
pnpm db:push
```

### 2. إضافة حقل جديد

**الخطوة 1**: عدّل الجدول

```typescript
export const models = pgTable('models', {
  // ... الحقول الموجودة
  email: varchar('email'),  // حقل جديد
});
```

**الخطوة 2**: طبّق الهجرة

```bash
pnpm db:push
```

### 3. حذف حقل

```typescript
// احذف الحقل من التعريف
export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  // email تم حذفه
});

// ثم طبّق الهجرة
pnpm db:push
```

---

## 🔍 الاستعلامات الشائعة

### البحث والفلترة

```typescript
import { eq, like, and } from "drizzle-orm";

// البحث بالمعرّف
const model = await db.query.models.findFirst({
  where: eq(models.id, 1),
});

// البحث بالاسم (يحتوي على)
const results = await db.query.models.findMany({
  where: like(models.name, "%فاطمة%"),
});

// شروط متعددة
const active = await db.query.models.findMany({
  where: and(
    eq(models.isActive, true),
    eq(models.gender, "female"),
  ),
});
```

### الترتيب والحد

```typescript
import { desc, asc } from "drizzle-orm";

// ترتيب تنازلي
const newest = await db.query.models.findMany({
  orderBy: desc(models.createdAt),
  limit: 10,
});

// ترتيب تصاعدي
const oldest = await db.query.models.findMany({
  orderBy: asc(models.createdAt),
});
```

### العد والإحصائيات

```typescript
import { count } from "drizzle-orm";

// عد الموديلات النشطة
const activeCount = await db
  .select({ count: count() })
  .from(models)
  .where(eq(models.isActive, true));
```

---

## 🛠️ أدوات مفيدة

### Drizzle Studio

عرض وتعديل البيانات بصرياً:

```bash
pnpm db:studio
```

### عرض الهجرات

```bash
ls drizzle/migrations/
```

### التحقق من الاتصال

```typescript
// في server/db.ts
import { db } from "./db";

try {
  await db.query.models.findMany();
  console.log("✅ قاعدة البيانات تعمل");
} catch (error) {
  console.error("❌ خطأ في الاتصال:", error);
}
```

---

## 📚 مراجع إضافية

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

---

**آخر تحديث**: ديسمبر 2025
