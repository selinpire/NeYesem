# Selin Pire - Frontend Gereksinimleri

## Front-end Test Videosu
https://www.youtube.com/watch?v=C3XNMZiT1GE

---

## 1. Üye Olma (Kayıt) Sayfası
API Endpoint: POST /auth/register  
Görev: Kullanıcı kayıt işlemi için web sayfası tasarımı ve implementasyonu  

### UI Bileşenleri:
- Email input alanı (type="email")
- Şifre input alanı (type="password")
- Şifre tekrar alanı
- "Kayıt Ol" butonu
- "Zaten hesabın var mı? Giriş Yap" linki
- Loading spinner
- Responsive form tasarımı

### Form Validasyonu:
- Email format kontrolü
- Şifre en az 8 karakter olmalı
- Şifreler eşleşmeli
- Tüm alanlar dolu olmalı

### Kullanıcı Deneyimi:
- Hatalar input altında gösterilmeli
- Başarılı kayıt sonrası giriş sayfasına yönlendirme
- Hata mesajları kullanıcı dostu olmalı

---

## 2. Giriş Yapma Sayfası
API Endpoint: POST /auth/login  
Görev: Kullanıcının sisteme giriş yapmasını sağlamak  

### UI Bileşenleri:
- Email input alanı
- Şifre input alanı
- "Giriş Yap" butonu
- "Hesabın yok mu? Kayıt Ol" linki
- Loading indicator

### Kullanıcı Deneyimi:
- Hatalı girişte uyarı mesajı
- Başarılı girişte ana sayfaya yönlendirme
- Token localStorage’da saklanır

---

## 3. Çıkış Yapma (Logout)
API Endpoint: POST /auth/logout  
Görev: Kullanıcının sistemden çıkış yapması  

### UI Bileşenleri:
- Navbar’da "Çıkış Yap" butonu

### Kullanıcı Deneyimi:
- Tıklandığında token silinir
- Kullanıcı login sayfasına yönlendirilir

---

## 4. Profil Görüntüleme Sayfası
API Endpoint: GET /users/{userId}  
Görev: Kullanıcı bilgilerini görüntüleme  

### UI Bileşenleri:
- Kullanıcı adı
- Email
- Profil fotoğrafı (opsiyonel)
- "Profili Güncelle" butonu
- "Hesabı Sil" butonu

### Kullanıcı Deneyimi:
- Veriler yüklenirken loading gösterilir
- Hata durumunda uyarı verilir

---

## 5. Profil Güncelleme Sayfası
API Endpoint: PUT /users/{userId}  
Görev: Kullanıcının bilgilerini güncellemesi  

### UI Bileşenleri:
- Ad input alanı
- Email input alanı
- Şifre değiştirme alanı (opsiyonel)
- "Kaydet" butonu
- "İptal" butonu

### Form Validasyonu:
- Email format kontrolü
- Boş alan kontrolü

### Kullanıcı Deneyimi:
- Başarılı güncelleme sonrası bildirim gösterilir
- Güncellemeden sonra profil sayfasına yönlendirme

---

## 6. Hesap Silme
API Endpoint: DELETE /users/{userId}  
Görev: Kullanıcı hesabını silme  

### UI Bileşenleri:
- "Hesabı Sil" butonu
- Onay modalı (Emin misiniz?)

### Kullanıcı Deneyimi:
- Silme işlemi geri alınamaz uyarısı
- Onay sonrası kullanıcı çıkış yapılır
- Login sayfasına yönlendirilir

---

## 7. Favorilerimi Listeleme
API Endpoint: GET /favorites  
Görev: Kullanıcının favori tariflerini listelemek  

### UI Bileşenleri:
- Tarif kartları (resim, başlık, butonlar)
- "Tarife Git" butonu

### Kullanıcı Deneyimi:
- Boşsa "Favori yok" mesajı gösterilir
- Responsive grid yapı

---

## 8. Yorum Silme
API Endpoint: DELETE /comments/{commentId}  
Görev: Kullanıcının kendi yorumunu silmesi  

### UI Bileşenleri:
- Yorum yanında "Sil" butonu
- Onay popup

### Kullanıcı Deneyimi:
- Sadece kendi yorumunu silebilir
- Silme sonrası yorum listeden kaldırılır

---

## 9. Puanlama Sistemi
API Endpoint: POST /ratings  

Görev: Kullanıcının tariflere puan vermesi  

### UI Bileşenleri:
- Yıldızlı puanlama sistemi (1-5 arası)
- Ortalama puan gösterimi

### Kullanıcı Deneyimi:
- Kullanıcı yalnızca bir kez puan verebilir
- Puan verildiğinde anında güncellenir