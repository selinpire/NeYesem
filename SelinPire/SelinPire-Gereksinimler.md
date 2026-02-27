1. **Giriş Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kullanıcıların email ve şifre bilgileri ile sisteme giriş yapmasını sağlar. Doğrulama başarılı olduğunda kullanıcıya oturum (JWT) oluşturulur.

2. **Üye Olma**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Kullanıcıların yeni hesap oluşturmasını sağlar. Email ve şifre bilgileri güvenli şekilde kaydedilir.

3. **Çıkış Yapma**
   - **API Metodu:** `POST /auth/logout`
   - **Açıklama:** Kullanıcının aktif oturumunu sonlandırır ve token geçersiz hale getirilir.

4. **Profil Görüntüleme**
   - **API Metodu:** `GET /users/{userId}`
   - **Açıklama:** Kullanıcının profil bilgilerini görüntülemesini sağlar. Giriş yapılmış olması gerekir.

5. **Profil Güncelleme**
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcının profil bilgilerini güncellemesini sağlar. Kullanıcı yalnızca kendi bilgilerini güncelleyebilir.

6. **Favorilere Listeleme**
   - **API Metodu:** `GET /favorites`
   - **Açıklama:** Kullanıcının favorilere eklediği tarifleri listeler.

7. **Yorum Silme**
   - **API Metodu:** `DELETE /comments/{commentId}`
   - **Açıklama:** Kullanıcının kendi yaptığı yorumu silmesini sağlar.

8. **Video Silme**
   - **API Metodu:** `DELETE /videos/{videoId}`
   - **Açıklama:** Tariflere eklenen videoların silinmesini sağlar.

9. **Puanlama Sistemi**
   - **API Metodu:** `POST /ratings`
   - **Açıklama:** Kullanıcıların tariflere 1–5 arası puan vermesini sağlar. Her kullanıcı bir tarif için yalnızca bir kez puan verebilir.

10. **Kalori Hesabı (Yapay Zeka)**
    - **API Metodu:** `POST /ai/calorie-calculation`
    - **Açıklama:** Yapay zekâ destekli sistem, tarif içeriğini analiz ederek tahmini kalori hesabı yapar.