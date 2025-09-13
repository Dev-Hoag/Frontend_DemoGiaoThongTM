import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RentPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error("Không thể lấy thông tin xe");
        }
        
        const data = await response.json();
        setVehicle(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin xe:", error);
        alert("Không thể tải thông tin xe");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId, navigate]);

  const handleBookingClick = () => {
    navigate(`/booking-form/${vehicleId}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Đang tải thông tin xe...</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Không tìm thấy xe!</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .rent-container {
          max-width: 1100px;
          margin: auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .back-btn {
          background: #6c757d;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 20px;
          display: block;
          width: fit-content;
        }
        .back-btn:hover {
          background: #5a6268;
        }

        /* --- Layout Desktop --- */
        .rent-top {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .rent-images {
          flex: 1;
          min-width: 300px;
        }
        .main-img {
          width: 100%;
          border-radius: 10px;
        }
        .rent-info {
          flex: 1;
          min-width: 280px;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 10px;
        }
        .car-name {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .price {
          font-size: 18px;
          color: red;
          margin-bottom: 10px;
        }
        .car-specs {
          list-style: none;
          padding: 0;
          margin-bottom: 15px;
        }
        .car-specs li {
          padding: 5px 0;
          border-bottom: 1px solid #ddd;
        }
        .rent-btn {
          background: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }
        .rent-btn:hover {
          background: #0056b3;
        }
        .rent-section {
          margin-top: 20px;
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0px 2px 8px rgba(0,0,0,0.1);
        }
        .rent-section h3 {
          margin-bottom: 10px;
        }
        .rent-section h4 {
          margin-top: 10px;
        }
        .rent-section ul {
          list-style: none;
          padding: 0;
        }
        .rent-section li {
          padding: 4px 0;
        }

        /* --- Responsive cho Mobile --- */
        @media (max-width: 768px) {
          .rent-top {
            flex-direction: column;
          }
          .thumbnail-list {
            justify-content: center;
          }
          .rent-info {
            margin-top: 20px;
          }
          .car-name {
            font-size: 20px;
          }
          .price {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="rent-container">

        <button className="back-btn" onClick={() => navigate("/dashboard")}>← Quay lại</button>

        <div className="rent-top">
          <div className="rent-images">
            <img src={vehicle.image || '/images/default-car.jpg'} 
              alt={vehicle.name} 
              className="main-img"
              onError={(e) => {
                e.target.src = '/images/default-car.jpg';
              }} 
            />
          </div>

          <div className="rent-info">
            <h2 className="car-name">{vehicle.name}</h2>
            <p className="price">{vehicle.price} VNĐ/Ngày</p>
            <ul className="car-specs">
              <li>🚗 <strong>Loại xe:</strong> {vehicle.type}</li>
              <li>👥 <strong>Số chỗ:</strong> {vehicle.seats}</li>
              <li>⚡ <strong>Quãng đường:</strong> {vehicle.range}</li>
              <li>🧳 <strong>Dung tích cốp:</strong> {vehicle.trunk}</li>
              <li>🔑 <strong>Hộp số:</strong> Số tự động</li>
              <li>🔋 <strong>Miễn phí sạc</strong></li>
              <li>📏 <strong>Giới hạn:</strong> 300 km/ngày</li>
            </ul>
            <button 
              className="rent-btn" 
              onClick={handleBookingClick}
            >
              Đặt xe
            </button>
          </div>
        </div>

        <div className="rent-section">
          <h3>Các tiện nghi khác</h3>
          <ul>
            <li>📱 Màn hình giải trí cảm ứng</li>
            <li>🛞 La-zăng hợp kim</li>
            <li>❄️ Điều hòa không khí</li>
            <li>🔒 Khóa cửa tự động</li>
            <li>📡 Kết nối Bluetooth</li>
          </ul>
        </div>

        <div className="rent-section">
          <h3>Điều kiện thuê xe</h3>
          <h4>Thông tin cần có khi nhận xe</h4>
          <ul>
            <li>✓ CCCD hoặc hộ chiếu còn thời hạn</li>
            <li>✓ Bằng lái hợp lệ, còn thời hạn</li>
          </ul>
          <h4>Hình thức thanh toán</h4>
          <ul>
            <li>💳 Trả trước</li>
            <li>💰 Đặt cọc giữ xe thanh toán 100% khi kí hợp đồng và nhận xe</li>
          </ul>
          <h4>Chính sách đặt cọc</h4>
          <p>💵 Khách hàng phải thanh toán số tiền cọc là 5.000.000đ</p>
        </div>
      </div>
    </>
  );
};

export default RentPage;
