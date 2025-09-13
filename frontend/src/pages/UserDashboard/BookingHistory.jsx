import React, { useEffect, useState } from "react";
import { FaBolt, FaBicycle, FaClock, FaEdit, FaTrash, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./BookingHistory.css";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/bookings/get-all-user-booking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setBookings(data.result || []);
        } else {
          console.error("Lỗi lấy dữ liệu:", data.message);
        }
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem("adminInfo") || localStorage.getItem("userInfo");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUsername(parsed?.name || "User");
    }

    fetchBookingHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCancel = (bookingId) => {
    // Handle cancel booking
    console.log("Cancel booking:", bookingId);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã huỷ";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "badge-pending";
      case "CONFIRMED":
        return "badge-confirmed";
      case "CANCELLED":
        return "badge-cancelled";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: 0 }}>
        <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #14452F;
          padding: 12px 24px;
          color: white;
          border-radius: 0 0 12px 12px;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .navbar-menu {
          display: flex;
          gap: 12px;
        }
        .navbar-menu button {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.5);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        .navbar-menu button:hover {
          background: rgba(255,255,255,0.2);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .navbar-right span {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
        }
        .navbar-right button {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.6);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          cursor: pointer;
        }

        .booking-table-container {
          padding: 24px;
        }

        table.booking-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 24px;
        }

        table.booking-table th,
        table.booking-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
        }

        table.booking-table th {
          background-color: #14452F;
          color: white;
        }

        .vehicle-info {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }

        .duration {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: bold;
        }

        .badge-pending {
          background-color: #ffc107;
          color: #000;
        }

        .badge-confirmed {
          background-color: #28a745;
          color: #fff;
        }

        .badge-cancelled {
          background-color: #dc3545;
          color: #fff;
        }

        .action-btn {
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          margin: 0 4px;
          font-weight: bold;
        }

        .edit-btn {
          background-color: #17a2b8;
          color: white;
        }

        .cancel-btn {
          background-color: #dc3545;
          color: white;
        }

        .no-data-container {
          padding: 40px;
          text-align: center;
          color: #666;
        }

        .no-data-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }
      `}</style>

      <div className="navbar">
        <div className="navbar-left">
          <FaBolt style={{ marginRight: '8px', color: '#fbc02d' }} />EcoMove
        </div>
        <div className="navbar-menu">
          <button onClick={() => navigate("/")}>Trang chủ</button>
          <button onClick={() => navigate("/dashboard")}>Xe Điện</button>
          <button onClick={() => navigate("/map")}>Trạm sạc</button>
          <button onClick={() => navigate("/history")}>Lịch sử thuê xe</button>
        </div>
        <div className="navbar-right">
          <span><FaUser /> {username || "BIKE User"}</span>
          <button onClick={handleLogout}>Đăng Xuất</button>
        </div>
      </div>

      {loading ? (
        <div className="no-data-container">Đang tải dữ liệu...</div>
      ) : bookings.length === 0 ? (
        <div className="no-data-container">
          <FaBicycle className="no-data-icon" />
          <p>Bạn chưa có lượt thuê nào.</p>
        </div>
      ) : (
        <div className="booking-table-container">
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên xe</th>
                <th>Ngày thuê</th>
                <th>Ngày trả</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.bookingId}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="vehicle-info">
                      <FaBicycle />
                      {booking.vehicle?.name || "N/A"}
                    </div>
                  </td>
                  <td>{booking.pickupTime}</td>
                  <td>{booking.returnTime}</td>
                  <td className="duration">
                    <FaClock /> {booking.durationDays} ngày
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit-btn" onClick={() => handleEdit(booking.bookingId)}>
                      <FaEdit /> Sửa
                    </button>
                    {booking.status === "PENDING" && (
                      <button className="action-btn cancel-btn" onClick={() => handleCancel(booking.bookingId)}>
                        <FaTrash /> Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
// const getStatusClass = (status) => {
//   switch (status) {
//     case "PENDING": return "status-pending";
//     case "CONFIRMED": return "status-confirmed";
//     case "CANCELLED": return "status-cancelled";
//     default: return "status-default";
//   }
// };

// const getStatusText = (status) => {
//   switch (status) {
//     case "PENDING": return "Chờ xác nhận";
//     case "CONFIRMED": return "Hoàn thành";
//     case "CANCELLED": return "Đã huỷ";
//     default: return status;
//   }
// };

export default BookingHistory;