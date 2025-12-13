# توثيق API - REX

شرح شامل لجميع API endpoints المتاحة.

## 📋 نظرة عامة

المشروع يستخدم **tRPC** للاتصال بين الـ Frontend والـ Backend.

### كيفية استخدام API

#### من الـ Frontend (React)

```typescript
import { trpc } from "@/lib/trpc";

// استعلام بيانات
const { data, isLoading } = trpc.models.getAll.useQuery();

// إرسال بيانات
const mutation = trpc.models.create.useMutation();
mutation.mutate({ name: "أحمد", age: 25 });
```

#### من الـ Backend (Server)

```typescript
// في server/routers.ts
export const appRouter = router({
  models: router({
    getAll: publicProcedure.query(async () => {
      // الكود هنا
    }),
  }),
});
```

## 🎯 Endpoints الرئيسية

### Models (الموديلات)

#### `models.getAll`
**النوع**: Query (استعلام)  
**الحماية**: عام

احصل على قائمة جميع الموديلات.

```typescript
const { data } = trpc.models.getAll.useQuery();
// data: Array<Model>
```

#### `models.create`
**النوع**: Mutation (تعديل)  
**الحماية**: محمي

أنشئ موديل جديد.

```typescript
const mutation = trpc.models.create.useMutation();
mutation.mutate({
  name: "فاطمة",
  gender: "female",
  age: 22,
});
```

#### `models.delete`
**النوع**: Mutation  
**الحماية**: محمي

احذف موديل.

```typescript
const mutation = trpc.models.delete.useMutation();
mutation.mutate({ id: 1 });
```

---

### Voice Artists (المعلقون الصوتيون)

#### `voiceArtists.getAll`
احصل على قائمة المعلقين.

```typescript
const { data } = trpc.voiceArtists.getAll.useQuery();
```

#### `voiceArtists.create`
أنشئ معلق جديد.

```typescript
mutation.mutate({
  name: "محمد",
  gender: "male",
  voiceType: "deep",
});
```

#### `voiceArtists.delete`
احذف معلق.

```typescript
mutation.mutate({ id: 1 });
```

---

### Content Creators (صناع المحتوى)

#### `contentCreators.getAll`
احصل على قائمة صناع المحتوى.

```typescript
const { data } = trpc.contentCreators.getAll.useQuery();
```

#### `contentCreators.create`
أنشئ صانع محتوى جديد.

```typescript
mutation.mutate({
  name: "سارة",
  platforms: "Instagram, TikTok",
});
```

#### `contentCreators.delete`
احذف صانع محتوى.

```typescript
mutation.mutate({ id: 1 });
```

---

### Video Productions (إنتاج الفيديو)

#### `videoProductions.getAll`
احصل على قائمة الفيديوهات.

```typescript
const { data } = trpc.videoProductions.getAll.useQuery();
```

#### `videoProductions.create`
أنشئ فيديو جديد.

```typescript
mutation.mutate({
  title: "فيديو تسويقي",
  productionType: "commercial",
});
```

#### `videoProductions.delete`
احذف فيديو.

```typescript
mutation.mutate({ id: 1 });
```

---

### Content Writing (كتابة المحتوى)

#### `contentWriting.getAll`
احصل على قائمة الكتابات.

```typescript
const { data } = trpc.contentWriting.getAll.useQuery();
```

#### `contentWriting.create`
أنشئ كتابة جديدة.

```typescript
mutation.mutate({
  title: "مقالة عن التسويق",
  contentType: "article",
});
```

#### `contentWriting.delete`
احذف كتابة.

```typescript
mutation.mutate({ id: 1 });
```

---

## 🔐 أنواع الحماية

### `publicProcedure` - عام
متاح للجميع بدون تسجيل دخول.

```typescript
publicProcedure.query(async () => {
  // متاح للجميع
});
```

### `protectedProcedure` - محمي
متاح فقط للمستخدمين المسجلين.

```typescript
protectedProcedure.query(async ({ ctx }) => {
  // ctx.user يحتوي على بيانات المستخدم
  console.log(ctx.user.id);
});
```

---

## 📊 أنواع البيانات

### Model (الموديل)

```typescript
interface Model {
  id: number;
  name: string;
  gender: "male" | "female";
  age: number;
  isActive: boolean;
  createdAt: Date;
}
```

### VoiceArtist (المعلق)

```typescript
interface VoiceArtist {
  id: number;
  name: string;
  gender: "male" | "female";
  voiceType: string;
  isActive: boolean;
  createdAt: Date;
}
```

### ContentCreator (صانع محتوى)

```typescript
interface ContentCreator {
  id: number;
  name: string;
  platforms: string;
  isActive: boolean;
  createdAt: Date;
}
```

### VideoProduction (فيديو)

```typescript
interface VideoProduction {
  id: number;
  title: string;
  productionType: string;
  isActive: boolean;
  createdAt: Date;
}
```

### ContentWriting (كتابة)

```typescript
interface ContentWriting {
  id: number;
  title: string;
  contentType: string;
  isActive: boolean;
  createdAt: Date;
}
```

---

## 🔄 أمثلة عملية

### مثال 1: عرض قائمة الموديلات

```typescript
import { trpc } from "@/lib/trpc";

export default function ModelsPage() {
  const { data: models, isLoading } = trpc.models.getAll.useQuery();
  
  if (isLoading) return <div>جاري التحميل...</div>;
  
  return (
    <div>
      {models?.map((model) => (
        <div key={model.id}>
          <h3>{model.name}</h3>
          <p>العمر: {model.age}</p>
        </div>
      ))}
    </div>
  );
}
```

### مثال 2: إضافة موديل جديد

```typescript
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AddModel() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  
  const createMutation = trpc.models.create.useMutation();
  
  const handleSubmit = () => {
    createMutation.mutate({
      name,
      age,
      gender: "female",
    });
  };
  
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="الاسم"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="العمر"
      />
      <button onClick={handleSubmit}>
        {createMutation.isPending ? "جاري الإضافة..." : "إضافة"}
      </button>
    </div>
  );
}
```

### مثال 3: حذف عنصر

```typescript
const deleteMutation = trpc.models.delete.useMutation();

const handleDelete = (id: number) => {
  deleteMutation.mutate({ id });
};
```

---

## ⚠️ معالجة الأخطاء

```typescript
const mutation = trpc.models.create.useMutation({
  onSuccess: (data) => {
    console.log("نجح:", data);
  },
  onError: (error) => {
    console.error("خطأ:", error.message);
  },
});
```

---

## 🔄 إضافة Endpoint جديد

### الخطوة 1: تعريف الـ Endpoint

في `server/routers.ts`:

```typescript
myNewFeature: router({
  getAll: publicProcedure
    .query(async () => {
      return await db.query.myTable.findMany();
    }),
  
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await db.insert(myTable).values(input);
    }),
}),
```

### الخطوة 2: استخدام الـ Endpoint

في الـ Frontend:

```typescript
const { data } = trpc.myNewFeature.getAll.useQuery();
const mutation = trpc.myNewFeature.create.useMutation();
```

---

## 📚 مراجع إضافية

- [tRPC Documentation](https://trpc.io/docs)
- [Zod Validation](https://zod.dev)
- [React Query](https://tanstack.com/query)

---

**آخر تحديث**: ديسمبر 2025
