import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setMessage("Kayıt sırasında hata oluştu.");
    }
  };

  return (
    <main className="page auth-page">
      <div className="auth-card">
        <h1>Kayıt Ol</h1>
        <p>Yeni hesap oluştur ve tarif dünyasına katıl.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Kullanıcı Adı"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Kayıt Ol</button>
        </form>

        {message && <p style={{ marginTop: "16px" }}>{message}</p>}
      </div>
    </main>
  );
}

export default Register;
