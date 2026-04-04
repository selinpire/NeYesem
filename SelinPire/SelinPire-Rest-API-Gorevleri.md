
API Test Videosu: https://www.youtube.com/watch?v=05HSQJs5NOI

Selin Pire'nin REST API Metotları
1. Giriş Yapma

Endpoint: POST /auth/login

Request Body:
{
    
"email": "kullanici@example.com",
"password": "Guvenli123!"
}

Response:
200 OK - Giriş başarılı, JWT token oluşturuldu

2. Üye Olma

Endpoint: POST /auth/register

Request Body:
{ 
"username:" selin,
"email": "kullanici@example.com
",
"password": "Guvenli123!"
}

Response:
201 Created - Kullanıcı başarıyla oluşturuldu

3. Çıkış Yapma

Endpoint: POST /auth/logout

Authentication: Bearer Token gerekli

Response:
200 OK - Kullanıcı başarıyla çıkış yaptı

4. Profil Görüntüleme

Endpoint: GET /users/{userId}

Path Parameters:

userId (string, required) - Kullanıcı ID'si

Authentication: Bearer Token gerekli

Response:
200 OK - Kullanıcı bilgileri başarıyla getirildi

5. Profil Güncelleme

Endpoint: PUT /users/{userId}

Path Parameters:

userId (string, required) - Kullanıcı ID'si

Request Body:
{
"email": "yeniemail@example.com
",
"name": "Selin Pire",
"bio": "Kullanıcı hakkında bilgi",
"profileImage": "url"
}

Authentication: Bearer Token gerekli

Response:
200 OK - Kullanıcı başarıyla güncellendi

6. Favorileri Listeleme

Endpoint: GET /favorites

Authentication: Bearer Token gerekli

Response:
200 OK - Favori tarifler başarıyla listelendi

7. Yorum Silme

Endpoint: DELETE /recipes/TARIF_ID/comments/YORUM_ID

Path Parameters:

commentId (string, required) - Yorum ID'si

Authentication: Bearer Token gerekli

Response:
204 No Content - Yorum başarıyla silindi



8. Puanlama Sistemi

Endpoint: POST /recipes/TARIF_ID/rating

Request Body:
{
"score": 5
}

Authentication: Bearer Token gerekli

Response:
201 Created - Puan başarıyla eklendi

