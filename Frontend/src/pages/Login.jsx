import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      login(data.user || { email: formData.email }, data.token || "");
      navigate("/");
    } catch (error) {
      console.error(error);
      setMessage("Giriş sırasında hata oluştu.");
    }
  };

  return (
    <main className="page auth-page">
      <div className="auth-card">
        <h1>Giriş Yap</h1>
        <p>NeYesem hesabına giriş yap ve favori tariflerine ulaş.</p>

        <form onSubmit={handleSubmit} className="auth-form">
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
          <button type="submit">Giriş Yap</button>
        </form>

        {message && <p style={{ marginTop: "16px" }}>{message}</p>}
      </div>
    </main>
  );
}

export default Login;
