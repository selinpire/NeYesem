import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const avatarLetter = user?.username
    ? user.username[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "K";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo-link">
          <img src={logo} alt="NeYesem Logo" className="logo" />
        </Link>
      </div>

      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menüyü Aç"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`navbar-right${menuOpen ? " open" : ""}`}>
        <Link
          to="/"
          className={isActive("/") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Ana Sayfa
        </Link>
        <Link
          to="/recipes"
          className={isActive("/recipes") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Tarifler
        </Link>
        <Link
          to="/favorites"
          className={isActive("/favorites") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Favoriler
        </Link>
        <Link
          to="/add-recipe"
          className={isActive("/add-recipe") ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Tarif Ekle
        </Link>

        {user ? (
          <div className="profile-wrapper" ref={dropdownRef}>
            <button
              className="profile-trigger"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <div className="profile-avatar">{avatarLetter}</div>
              <div className="profile-info">
                <span className="profile-name">
                  {user.username || user.email}
                </span>
                <span className="profile-sub">Hesabım</span>
              </div>
              <svg
                className={`profile-chevron${dropdownOpen ? " open" : ""}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profilim
                </Link>
                <Link
                  to="/favorites"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Favorilerim
                </Link>
                <Link
                  to="/my-recipes"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Tariflerim
                </Link>
                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className={isActive("/login") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Giriş Yap
            </Link>
            <Link
              to="/register"
              className="register-btn"
              onClick={() => setMenuOpen(false)}
            >
              Kayıt Ol
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
