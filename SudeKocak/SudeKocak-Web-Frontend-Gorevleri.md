#  NeYesem Web Frontend Görevleri

##  Proje Tanımı
React ile geliştirilen frontend uygulaması, NeYesem REST API ile entegre çalışarak kullanıcıların tarif eklemesini, görüntülemesini ve etkileşimde bulunmasını sağlar.

---

##  Frontend Test Videosu
https://www.youtube.com/watch?v=A2F3yeHNIfs

---

#  SAYFALAR VE GÖREVLER

##  1. Ana Sayfa (Home.jsx)

### Amaç
Tüm tarifleri listelemek

### Kullanılan Componentler
- RecipeCard.jsx
- SearchBar.jsx
- Sidebar.jsx

### Yapılacaklar
- GET /api/recipes isteği atılır
- Tarifler kart şeklinde gösterilir
- Arama ve filtreleme çalışır

---

##  2. Tarifler Sayfası (Recipes.jsx)

### Amaç
Tarifleri listeleme ve filtreleme

### Yapılacaklar
- GET /api/recipes
- GET /api/recipes/search?q=
- GET /api/recipes?category=
- Arama ve kategori filtreleme yapılır

---

##  3. Tarif Detay Sayfası (RecipeDetail.jsx)

### Amaç
Tarifin tüm detaylarını göstermek

### Kullanılan Componentler
- RecipeDetailVideo.jsx
- RecipeCommentsSection.jsx
- RecipeRatingSection.jsx
- RecipeAiCalorieSection.jsx
- FavoriteHeartButton.jsx

### Yapılacaklar
- GET /api/recipes/{recipeId}
- Tarif bilgileri gösterilir
- Video gösterilir
- Yorumlar listelenir
- Favori ekleme yapılır

---

##  4. Tarif Ekleme (AddRecipe.jsx)

### Amaç
Yeni tarif eklemek

### Kullanılan Component
- RecipeEditor.jsx

### Yapılacaklar
- Form doldurulur
- POST /api/recipes isteği atılır
- Başarılıysa yönlendirme yapılır

---

##  5. Tarif Güncelleme (EditRecipe.jsx)

### Amaç
Tarifi düzenlemek

### Yapılacaklar
- GET /api/recipes/{recipeId}
- PUT /api/recipes/{recipeId}
- Form önceden doldurulur
- Güncelleme yapılır

---

##  6. Tarif Silme

### Kullanılan Component
- DeleteRecipeModal.jsx

### Yapılacaklar
- DELETE /api/recipes/{recipeId}
- Onay modalı açılır
- Silme işlemi yapılır

---

##  7. Favoriler (Favorites.jsx)

### Amaç
Favori tarifleri göstermek

### Kullanılan Component
- FavoriteHeartButton.jsx

### Yapılacaklar
- POST /api/favorites/{recipeId}
- Favoriler listelenir

---

##  8. Yorum Ekleme

### Kullanılan Component
- RecipeCommentsSection.jsx

### Yapılacaklar
- POST /api/comments
- Yorum eklenir
- Liste güncellenir

---

##  9. Video Gösterme / Ekleme

### Kullanılan Component
- RecipeDetailVideo.jsx

### Yapılacaklar
- POST /api/videos
- Video gösterilir



---

##  GENEL COMPONENTLER

- Navbar.jsx → Menü
- Hero.jsx → Ana sayfa üst alan
- Sidebar.jsx → Kategori filtreleme
- SearchBar.jsx → Arama
- RecipeCard.jsx → Tarif kartı
- StarRatingDisplay.jsx → Puan gösterimi

---

##  API İŞLEVLERİ

- Tarif ekleme
- Tarif listeleme
- Tarif detay
- Tarif güncelleme
- Tarif silme
- Arama
- Kategori filtreleme
- Favori ekleme
- Yorum ekleme
- Video ekleme

---

##  SONUÇ

Frontend tamamlandığında kullanıcı:

- Tarif ekleyebilir
- Tarifleri görüntüleyebilir
- Tarif detayına bakabilir
- Tarif düzenleyebilir
- Tarif silebilir
- Arama yapabilir
- Kategoriye göre filtreleyebilir
- Favorilere ekleyebilir
- Yorum yapabilir
- Video izleyebilir