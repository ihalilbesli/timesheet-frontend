# 🖥️ Timesheet Frontend

Bu proje, kullanıcıların günlük çalışma saatlerini (timesheet) sisteme girebildiği, geçmiş kayıtlarını görüntüleyebildiği ve yöneticilerin kullanıcıları yönetebildiği bir web arayüzüdür. Angular kullanılarak geliştirilmiştir ve Spring Boot tabanlı backend servisiyle entegre çalışmaktadır.

## 👤 Kullanıcı Özellikleri

- Kayıt olma ve giriş yapma (JWT ile güvenli oturum)
- Timesheet (çalışma saati) oluşturma, güncelleme, silme
- Kayıtları tarih aralığına göre filtreleme
- CSV/Excel formatında dışa aktarma

## 🛡️ Admin Paneli Özellikleri

- Tüm kullanıcıların kayıtlarını listeleme
- Kullanıcılara göre filtreleme ve arama
- Kullanıcı timesheet verilerini dışa aktarma (CSV/Excel)


## 🧰 Kullanılan Teknolojiler

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" width="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="50"/>
</p>

- **Angular 18** – Modern frontend framework
- **TypeScript** – JavaScript'in tip güvenliği olan versiyonu
- **HTML5 & CSS3** – Sayfa yapısı ve stil düzenlemeleri
- **ngx-toastr** – Bildirim (toast) sistemi

## 🔧 Uygulamanın Kurulumu ve Çalıştırılması

Aşağıdaki adımları izleyerek projeyi kendi bilgisayarınızda çalıştırabilirsiniz:

### 1. Angular CLI’yi Global Olarak Yükleyin (Eğer Yüklü Değilse)

```bash
npm install -g @angular/cli
```

### 2. Depoyu Klonlayın

```bash
git clone https://github.com/ihalilbesli/timesheet-frontend.git
cd timesheet-frontend
```

### 3. Proje Bağımlılıklarını Yükleyin

```bash
npm install
```

### 4. Uygulamayı Başlatın

```bash
ng serve
```

Tarayıcıdan şu adrese giderek uygulamayı görüntüleyebilirsiniz:  
📍 `http://localhost:4200`

> Not: Uygulamanın düzgün çalışabilmesi için backend (`http://localhost:8080`) aktif olmalıdır.


## 📁 Proje Klasör Yapısı

Aşağıda `src/app` dizini altındaki klasör yapısı ve görevleri yer almaktadır:

```
src/app
│
├── components               # Uygulama bileşenleri (her role özel bölümler)
│   ├── admin                # Admin paneli (kullanıcı yönetimi, tüm kayıtlar)
│   ├── auth                 # Giriş ve kayıt bileşenleri
│   ├── header               # Navigasyon, üst menü bileşeni
│   ├── user                 # Kullanıcı dashboard ve işlemleri
│   └── welcome              # Hoş geldiniz sayfası
│
├── guards                  # Sayfa güvenliği (yetki kontrolü)
│   ├── auth                # Giriş kontrolü (oturum var mı?)
│   └── role                # Rol tabanlı yönlendirme (USER, ADMIN)
│
├── services                # Tüm API iletişimini yöneten servisler
│   ├── auth                # Giriş, kayıt, token işlemleri
│   ├── export              # CSV/Excel dışa aktarma
│   ├── timesheet           # Timesheet işlemleri
│   └── user                # Kullanıcı bilgileri yönetimi
│
├── app.routes.ts           # Tüm uygulama yönlendirmelerini (routing) içerir
├── app.config.ts           # Ortak yapılandırmalar
├── app.component.ts/html   # Ana uygulama bileşeni
```

Bu yapı, Angular’ın modüler geliştirme yaklaşımına uygun olarak ayrılmıştır. Her klasör, uygulamanın bir parçasını temsil eder ve sorumluluklar net olarak bölünmüştür.

## 🔐 Kimlik Doğrulama ve Yetkilendirme (Auth & Guard Sistemi)

Bu projede JWT (JSON Web Token) kullanılarak güvenli oturum yönetimi yapılmaktadır. Kullanıcı giriş yaptıktan sonra alınan token, `localStorage` içinde saklanır ve tüm API isteklerinde `Authorization` başlığıyla gönderilir.

### 🛡️ Guard Sistemi

Uygulamada iki farklı guard yapısı vardır:

- **Auth Guard (`auth.guard.ts`)**  
  Kullanıcının giriş yapıp yapmadığını kontrol eder. Eğer oturum yoksa `welcome` sayfasına yönlendirir.

- **Role Guard (`role.guard.ts`)**  
  Kullanıcının rolüne göre (örneğin `ROLE_ADMIN`, `ROLE_USER`) belirli sayfalara erişimini sınırlar. Rol uyuşmuyorsa yine `welcome` sayfasına yönlendirir.

### 🧪 Token Kontrolü

Tüm isteklerde token şu şekilde header'a eklenir:

```http
Authorization: Bearer <jwt-token>
```

`AuthService` bu token'ı yönetir, çözümler ve kullanıcı rolünü kontrol etmek için yardımcı metotlar sağlar (`getUserRole()`, `isLoggedIn()` gibi).


## 🧭 Sayfa Yönlendirme (Routing) Mantığı

Uygulama içerisinde yönlendirmeler Angular Router üzerinden yapılır ve `app.routes.ts` dosyasında tanımlanır. Sayfa erişimleri `AuthGuard` ve `RoleGuard` ile korunur.

### 📌 Örnek Routing Yapısı:

| Yol                     | Açıklama                                | Guard |
|-------------------------|------------------------------------------|--------|
| `/login`                | Giriş ekranı                             | ❌     |
| `/register`             | Kayıt ekranı                             | ❌     |
| `/user/dashboard`       | Kullanıcı paneli                         | ✅ Auth + Role (`USER`) |
| `/admin/dashboard`      | Admin paneli                             | ✅ Auth + Role (`ADMIN`) |
| `/welcome`              | Hoş geldiniz sayfası (anonim)           | ❌     |

### 🔐 Guard Kullanımı

Her route tanımında aşağıdaki gibi koruma yapılır:

```ts
 {
        path: 'admin-dashboard',
        loadComponent: () =>
            import('./components/admin/dashboard/dashboard.component')
                .then(m => m.DashboardComponent),
        canActivate: [authGuard, roleGuard(['ADMIN'])]
    }
```

- `AuthGuard` → Oturum açılmış mı kontrol eder.
- `RoleGuard` → Giriş yapan kullanıcının rolü eşleşiyor mu kontrol eder.

---

> Tüm yönlendirmeler, `app.routes.ts` dosyasında merkezi olarak yönetilir.


Her türlü soru ve geri bildirim için iletişime geçebilirsiniz.  
📧 **E-posta:** ihalilbesli@gmail.com
🔗 **LinkedIn:** [linkedin.com/in/ibrahim-halil-beşli-3079ab223](https://www.linkedin.com/in/ibrahim-halil-be%C5%9Fli-3079ab223/)



