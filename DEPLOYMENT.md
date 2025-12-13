# دليل النشر على Render

## المتطلبات

- حساب GitHub
- حساب Render
- مستودع المشروع على GitHub

## خطوات النشر

### 1. رفع المشروع على GitHub

```bash
# إذا لم يكن المشروع على GitHub بعد
git remote add origin https://github.com/YOUR_USERNAME/digital-services.git
git branch -M main
git push -u origin main

# أو إذا كان موجوداً بالفعل
git add .
git commit -m "تحديث المشروع"
git push origin main
```

### 2. إنشاء خدمة على Render

#### الخطوة 1: تسجيل الدخول
1. اذهب إلى [render.com](https://render.com)
2. سجل الدخول أو أنشئ حساباً جديداً

#### الخطوة 2: ربط GitHub
1. انقر على **Dashboard**
2. انقر على **+ New**
3. اختر **Web Service**
4. اختر **Connect a repository**
5. اختر **digital-services**

#### الخطوة 3: إعدادات الخدمة

| الإعداد | القيمة |
|--------|--------|
| **Name** | digital-services |
| **Environment** | Node |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `node dist/index.js` |
| **Node Version** | 22 |

#### الخطوة 4: متغيرات البيئة

أضف المتغيرات التالية في **Environment**:

```env
# قاعدة البيانات
DATABASE_URL=postgresql://user:password@host:5432/dbname

# المصادقة
JWT_SECRET=your_jwt_secret_here

# OAuth
OAUTH_SERVER_URL=https://api.manus.im
OWNER_OPEN_ID=your_owner_id

# API Keys
BUILT_IN_FORGE_API_KEY=your_api_key
BUILT_IN_FORGE_API_URL=https://api.example.com

# Frontend
VITE_APP_TITLE=REX
VITE_APP_LOGO=https://example.com/logo.png
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.example.com
VITE_OAUTH_PORTAL_URL=https://oauth.example.com

# Analytics (اختياري)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### 3. تفعيل Auto-Deploy

1. في صفحة الخدمة على Render
2. انقر على **Settings**
3. تحت **Auto-Deploy**، اختر **Yes**
4. اختر الفرع: **main**

الآن، أي تحديث على GitHub سيؤدي إلى نشر تلقائي على Render!

## إدارة قاعدة البيانات

### إنشاء قاعدة بيانات PostgreSQL على Render

1. من Dashboard، انقر على **+ New**
2. اختر **PostgreSQL**
3. أدخل الاسم: `digital-services-db`
4. اختر المنطقة
5. انقر على **Create Database**

### الحصول على معلومات الاتصال

1. انسخ **Internal Database URL**
2. استخدمها في `DATABASE_URL`

### تطبيق الهجرات

```bash
# محلياً
DATABASE_URL=your_render_db_url pnpm db:push
```

## المراقبة والصيانة

### عرض السجلات

1. اذهب إلى صفحة الخدمة
2. انقر على **Logs**
3. شاهد السجلات الحية

### إعادة التشغيل

1. انقر على **Settings**
2. انقر على **Restart Service**

### التحديثات

```bash
# محلياً
git add .
git commit -m "تحديث جديد"
git push origin main

# Render سيقوم بالنشر تلقائياً
```

## استكشاف الأخطاء

### الخدمة لا تبدأ

1. تحقق من السجلات
2. تأكد من متغيرات البيئة
3. تأكد من أن `pnpm build` ينجح محلياً

### مشاكل قاعدة البيانات

```bash
# اختبر الاتصال محلياً
DATABASE_URL=your_url pnpm db:push
```

### أخطاء الإنشاء

```bash
# تحقق من السجلات على Render
# تأكد من أن package.json صحيح
# تأكد من أن build command صحيح
```

## الأمان

### نصائح أمان مهمة

1. **لا تضع Secrets في الكود**
   - استخدم متغيرات البيئة فقط

2. **استخدم HTTPS**
   - Render يوفره تلقائياً

3. **حماية البيانات الحساسة**
   - استخدم JWT للمصادقة
   - قم بتشفير كلمات المرور

4. **تحديثات منتظمة**
   - حدّث المتطلبات بانتظام
   - طبّق الإصلاحات الأمنية

## الأداء

### تحسينات الأداء

1. **استخدم CDN**
   - للملفات الثابتة

2. **ضغط البيانات**
   - استخدم gzip

3. **Caching**
   - استخدم Redis (اختياري)

4. **Database Indexing**
   - أضف فهارس للأعمدة المهمة

## النسخ الاحتياطية

### نسخ احتياطية من قاعدة البيانات

```bash
# تنزيل نسخة احتياطية
pg_dump $DATABASE_URL > backup.sql

# استعادة من نسخة احتياطية
psql $DATABASE_URL < backup.sql
```

## الدعم

للمساعدة:
- [Render Docs](https://render.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Node.js Docs](https://nodejs.org/docs/)

---

**آخر تحديث**: ديسمبر 2025
