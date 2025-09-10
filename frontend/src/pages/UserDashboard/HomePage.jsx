import React from "react";
import { Link } from "react-router-dom";
import { FaCar, FaChargingStation, FaUser } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="homepage">
      <style>{`
        .homepage {
          font-family: 'Segoe UI', sans-serif;
          background: #f8fbfd;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1d7fa3;
          padding: 14px 32px;
          color: white;
          font-weight: bold;
        }
        .navbar a {
          background: transparent;
          border: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          margin-left: 16px;
          text-decoration: none;
        }
        .navbar a:hover {
          text-decoration: underline;
        }
        .hero {
          text-align: center;
          padding: 80px 20px;
          background: linear-gradient(to right, #1d7fa3, #28a9cc);
          color: white;
        }
        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        .hero p {
          font-size: 1.2rem;
          margin-bottom: 30px;
        }
        .hero button {
          padding: 12px 28px;
          font-size: 1.1rem;
          background: white;
          color: #1d7fa3;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          padding: 50px 10%;
        }
        .feature-card {
          background: white;
          padding: 30px 20px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .feature-card h3 {
          margin-top: 16px;
          font-size: 1.2rem;
          color: #1d7fa3;
        }
        .feature-card p {
          font-size: 0.95rem;
          margin-top: 8px;
          color: #333;
        }
        .footer {
          margin-top: auto;
          background: #1d7fa3;
          color: white;
          text-align: center;
          padding: 16px;
        }
      `}</style>

      {/* Navbar */}
      <div className="navbar">
        <div>⚡ Xedienvip </div>
        <div>
          <Link to="/">Trang chủ</Link>
          <Link to="/dashboard">Đặt xe</Link>
          <Link to="/map">Trạm sạc</Link>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </div>

      {/* Hero section */}
      <div className="hero">
        <h1>Chào mừng đến với EV Booking</h1>
        <p>Thuê xe điện và tìm trạm sạc dễ dàng, nhanh chóng và tiện lợi.</p>
        <Link to="/dashboard">
          <button>🚗 Đặt xe ngay</button>
        </Link>
      </div>

      {/* Features */}
      <div className="features">
        <div className="feature-card">
          <FaCar size={40} color="#1d7fa3" />
          <h3>Đặt xe điện</h3>
          <p>Lựa chọn xe máy điện hoặc ô tô điện phù hợp với nhu cầu của bạn.</p>
        </div>
        <div className="feature-card">
          <FaChargingStation size={40} color="#1d7fa3" />
          <h3>Tìm trạm sạc</h3>
          <p>Xem vị trí trạm sạc gần bạn và theo dõi số chỗ trống còn lại.</p>
        </div>
        <div className="feature-card">
          <FaUser size={40} color="#1d7fa3" />
          <h3>Quản lý tài khoản</h3>
          <p>Theo dõi lịch sử đặt xe và cập nhật thông tin cá nhân dễ dàng.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        © 2025 EV Booking. Liên hệ: support@evbooking.com
      </div>
    </div>
  );
};

export default HomePage;
