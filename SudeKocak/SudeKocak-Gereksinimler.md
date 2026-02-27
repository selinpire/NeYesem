## Sude Koçak'ın Gereksinimleri

1. **Tarif Ekleme**
   - **API Metodu:** `POST /recipes`
   - **Açıklama:** Kullanıcıların yeni tarif oluşturmasını sağlar. Tarif başlığı, malzemeler, hazırlanış adımları ve kategori bilgileri kaydedilir.

2. **Tarif Listeleme**
   - **API Metodu:** `GET /recipes`
   - **Açıklama:** Sistemde bulunan tüm tarifleri listeler.

3. **Tarif Detay Görüntüleme**
   - **API Metodu:** `GET /recipes/{recipeId}`
   - **Açıklama:** Seçilen tarifin tüm detaylarını görüntüler.

4. **Tarif Güncelleme**
   - **API Metodu:** `PUT /recipes/{recipeId}`
   - **Açıklama:** Tarif sahibinin mevcut tarif üzerinde düzenleme yapmasını sağlar.

5. **Tarif Silme**
   - **API Metodu:** `DELETE /recipes/{recipeId}`
   - **Açıklama:** Tarif sahibinin tarifini sistemden kaldırmasını sağlar.

6. **Tarif Arama**
   - **API Metodu:** `GET /recipes/search?q=kelime`
   - **Açıklama:** Kullanıcıların başlık veya içerik bazlı arama yapmasını sağlar.

7. **Kategoriye Göre Listeleme**
   - **API Metodu:** `GET /recipes?category={categoryName}`
   - **Açıklama:** Seçilen kategoriye ait tarifleri listeler.

8. **Favorilere Ekleme**
   - **API Metodu:** `POST /favorites/{recipeId}`
   - **Açıklama:** Kullanıcının bir tarifi favorilere eklemesini sağlar.

9. **Yorum Ekleme**
   - **API Metodu:** `POST /comments`
   - **Açıklama:** Tariflere yorum yapılmasını sağlar.

10. **Video Ekleme**
    - **API Metodu:** `POST /videos`
    - **Açıklama:** Tariflere videolu anlatım eklenmesini sağlar.