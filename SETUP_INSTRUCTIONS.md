# خطوات الإعداد - REX

دليل شامل لإعداد بيئة التطوير.

## 🖥️ متطلبات النظام

### الحد الأدنى
- **OS**: Windows, macOS, Linux
- **Node.js**: 22.0.0 أو أحدث
- **npm/pnpm**: pnpm 10.0.0 أو أحدث
- **Git**: 2.30.0 أو أحدث
- **RAM**: 4GB على الأقل
- **Disk**: 2GB مساحة فارغة

### التحقق من الإصدارات

```bash
node --version      # v22.0.0+
pnpm --version      # 10.0.0+
git --version       # 2.30.0+
```

---

## 📥 خطوات التثبيت

### 1. استنساخ المشروع

```bash
# استخدم HTTPS
git clone https://github.com/YOUR_USERNAME/digital-services.git
cd digital-services

# أو استخدم SSH
git clone git@github.com:YOUR_USERNAME/digital-services.git
cd digital-services
```

### 2. تثبيت المتطلبات

```bash
# تثبيت جميع المتطلبات
pnpm install

# أو إذا واجهت مشاكل
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3. إعداد متغيرات البيئة

**أنشئ ملف `.env.local`**:

```bash
# في جذر المشروع
touch .env.local
```

**أضف المتغيرات التالية**:

```env
# قاعدة البيانات
DATABASE_URL=postgresql://user:password@localhost:5432/digital_services

# المصادقة
JWT_SECRET=your_secret_key_here_min_32_chars_long

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

### 4. إعداد قاعدة البيانات

#### الخيار 1: استخدام قاعدة بيانات محلية

**تثبيت PostgreSQL**:

```bash
# على macOS
brew install postgresql

# على Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# على Windows
# حمّل من: https://www.postgresql.org/download/windows/
```

**إنشاء قاعدة البيانات**:

```bash
# تسجيل الدخول إلى PostgreSQL
psql -U postgres

# أنشئ قاعدة بيانات جديدة
CREATE DATABASE digital_services;

# أنشئ مستخدم
CREATE USER dev_user WITH PASSWORD 'dev_password';

# امنح الصلاحيات
GRANT ALL PRIVILEGES ON DATABASE digital_services TO dev_user;

# اخرج
\q
```

**حدّث `.env.local`**:

```env
DATABASE_URL=postgresql://dev_user:dev_password@localhost:5432/digital_services
```

#### الخيار 2: استخدام قاعدة بيانات سحابية

**استخدم Render أو Supabase**:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### 5. تطبيق الهجرات

```bash
# إنشاء الجداول
pnpm db:push
```

### 6. تشغيل خادم التطوير

```bash
pnpm dev
```

**النتيجة المتوقعة**:

```
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

---

## ✅ التحقق من الإعداد

### 1. فحص التثبيت

```bash
# تحقق من عدم وجود أخطاء
pnpm check
```

### 2. فحص قاعدة البيانات

```bash
# افتح Drizzle Studio
pnpm db:studio
```

### 3. اختبر الموقع

افتح المتصفح وانتقل إلى:
```
http://localhost:3000
```

يجب أن ترى الصفحة الرئيسية.

---

## 🔧 الأوامر الأساسية

### التطوير

```bash
# تشغيل خادم التطوير
pnpm dev

# فحص الأخطاء
pnpm check

# تنسيق الكود
pnpm format
```

### البناء والإنتاج

```bash
# بناء للإنتاج
pnpm build

# تشغيل الإنتاج محلياً
pnpm start
```

### قاعدة البيانات

```bash
# تطبيق الهجرات
pnpm db:push

# فتح Drizzle Studio
pnpm db:studio
```

### الاختبار

```bash
# تشغيل الاختبارات
pnpm test

# الاختبارات المراقبة
pnpm test:watch
```

---

## 🐛 استكشاف الأخطاء الشائعة

### خطأ: "Module not found"

```
❌ Error: Cannot find module '@/components/Header'
```

**الحل**:
```bash
# تأكد من أن المسارات صحيحة في tsconfig.json
# ثم أعد تشغيل الخادم
pnpm dev
```

### خطأ: "Database connection error"

```
❌ Error: connect ECONNREFUSED 127.0.0.1:5432
```

**الحل**:
```bash
# تحقق من أن PostgreSQL يعمل
psql -U postgres

# تحقق من DATABASE_URL في .env.local
echo $DATABASE_URL

# أعد تشغيل PostgreSQL
# على macOS
brew services restart postgresql

# على Ubuntu
sudo systemctl restart postgresql
```

### خطأ: "Port 3000 is already in use"

```
❌ Error: listen EADDRINUSE :::3000
```

**الحل**:
```bash
# ابحث عن العملية التي تستخدم المنفذ
lsof -i :3000

# أوقفها
kill -9 <PID>

# أو استخدم منفذ مختلف
PORT=3001 pnpm dev
```

### خطأ: "pnpm: command not found"

```
❌ bash: pnpm: command not found
```

**الحل**:
```bash
# ثبّت pnpm عالمياً
npm install -g pnpm

# تحقق من الإصدار
pnpm --version
```

---

## 📁 هيكل المشروع بعد الإعداد

```
digital-services/
├── client/              # تطبيق React
├── server/              # خادم Node.js
├── drizzle/             # قاعدة البيانات
├── shared/              # ملفات مشتركة
├── node_modules/        # المتطلبات
├── dist/                # ملفات البناء
├── .env.local           # متغيرات البيئة
├── package.json
├── pnpm-lock.yaml
└── ... (ملفات أخرى)
```

---

## 🚀 الخطوات التالية

بعد الإعداد الناجح:

1. **اقرأ الدليل**: ابدأ بـ `DEVELOPER_GUIDE.md`
2. **استكشف الكود**: افتح `client/src/pages/Home.tsx`
3. **أضف ميزة**: جرّب إضافة صفحة جديدة
4. **اختبر**: شغّل `pnpm test`

---

## 💡 نصائح مهمة

1. **استخدم VS Code**: يوفر أفضل دعم TypeScript
2. **ثبّت الإضافات**:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Drizzle ORM
3. **احفظ الملفات تلقائياً**: في VS Code
4. **استخدم Git**: التزم بـ conventional commits

---

## 📞 طلب المساعدة

إذا واجهت مشكلة:

1. **تحقق من السجلات**: انظر رسائل الخطأ بعناية
2. **ابحث في الملفات**: قد تجد حلاً في ملف مشابه
3. **اسأل في المجتمع**: Stack Overflow, GitHub Discussions
4. **أعد التثبيت**: في بعض الأحيان يحل المشكلة

---

## ✨ الإعداد الكامل

بعد اتباع جميع الخطوات، يجب أن:

- ✅ يعمل `pnpm dev` بدون أخطاء
- ✅ يفتح الموقع على `http://localhost:3000`
- ✅ تعمل قاعدة البيانات بدون مشاكل
- ✅ لا توجد أخطاء TypeScript

---

**آخر تحديث**: ديسمبر 2025
