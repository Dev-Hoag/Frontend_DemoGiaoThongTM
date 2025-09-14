import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

const BookingForm = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams(); // Lấy vehicleId từ URL
  const [vehicle, setVehicle] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = React.useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    pickupTime: "",
    returnTime: "",
    pickupArea: "",
    returnArea: "",
  });

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

      }
      catch (error) {
        console.error("Lỗi khi lấy thông tin xe:", error);
        alert("Không thể tải thông tin xe");
        navigate("/dashboard");
      }

      finally {
        setLoading(false);
      }
    }

    if (vehicleId) {  
      fetchVehicle();
    }

    }, [vehicleId, navigate]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị");
      return;
    }

    setGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding để chuyển tọa độ thành địa chỉ
          const address = await reverseGeocode(latitude, longitude);
          
          setFormData(prev => ({
            ...prev,
            pickupArea: address
          }));
          
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ:", error);
          alert("Không thể lấy địa chỉ từ vị trí hiện tại");
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error("Lỗi định vị:", error);
        let message = "Không thể lấy vị trí hiện tại";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = "Bạn đã từ chối quyền truy cập vị trí";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Thông tin vị trí không khả dụng";
            break;
          case error.TIMEOUT:
            message = "Yêu cầu lấy vị trí hết thời gian";
            break;
        }
        
        alert(message);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=vi`
      );
      
      if (!response.ok) {
        throw new Error("Không thể lấy địa chỉ");
      }
      
      const data = await response.json();
      
      // Tạo địa chỉ từ dữ liệu trả về
      const address = data.address;
      let formattedAddress = "";
      
      if (address.house_number) formattedAddress += address.house_number + " ";
      if (address.road) formattedAddress += address.road + ", ";
      if (address.suburb || address.neighbourhood) formattedAddress += (address.suburb || address.neighbourhood) + ", ";
      if (address.city_district || address.county) formattedAddress += (address.city_district || address.county) + ", ";
      if (address.city || address.town) formattedAddress += (address.city || address.town);
      
      return formattedAddress || data.display_name;
      
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `Vĩ độ: ${lat.toFixed(6)}, Kinh độ: ${lng.toFixed(6)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt xe.");
      navigate("/login");
      return;
    }

    try {

      const payload = {
        ...formData,
        vehicleTypeId: vehicleId  // Sửa từ vehicleTypeId thành vehicleId
      };

      const response = await fetch("http://localhost:8080/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),

      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success response:", data);
        
        // Hiển thị message từ backend nếu có
        const message = data.message || "Đặt xe thành công!";
        alert(message);
        
        navigate("/history");
      }
      else {
        try {
          const errorData = await response.json();
          console.log("Error response:", errorData);
          alert(errorData.message || `HTTP ${response.status}: Đặt xe thất bại`);
        } catch {
          // Nếu không parse được JSON, đọc text
          const errorText = await response.text();
          console.log("Error text:", errorText);
          alert(`HTTP ${response.status}: ${errorText || "Đặt xe thất bại"}`);
        }
      }
    } 
    catch (error) {
      console.error("Lỗi khi kết nối backend:", error);
      alert("Lỗi kết nối server");
    };
  }

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
        <div>Không tìm thấy thông tin xe.</div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .back-btn {
          background: #6c757d;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin: 20px 0 0 20px;
          display: block;
          width: fit-content;
        }

        .back-btn:hover {
          background: #5a6268;
        }

        .booking-container {
          display: flex;
          max-width: 1000px;
          margin: 40px auto;
          gap: 30px;
          font-family: Arial, sans-serif;
        }
        .car-summary {
          flex: 1;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
        }
        .car-img {
          width: 100%;
          height: auto; /* giữ tỉ lệ ảnh */
          border-radius: 10px;
          margin-bottom: 15px;
        }
        .car-title { font-size: 22px; margin-bottom: 8px; color: #222; }
        .car-price { color: #e63946; font-size: 18px; margin-bottom: 15px; }
        .car-info { list-style: none; padding: 0; margin: 0; color: #444; }
        .car-info li { margin: 6px 0; font-size: 15px; }
        .booking-form {
          flex: 1;
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: left;
        }
        .booking-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .booking-form-header h2 {
          margin: 0;
          color: #007bff;
        }
        .close-btn {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        .close-btn:hover {
          background: #c82333;
        }
        .booking-form form { display: flex; flex-direction: column; gap: 15px; }
        .booking-form label { display: flex; flex-direction: column; font-weight: bold; color: #333; }
        .booking-form input { padding: 10px; margin-top: 6px; border: 1px solid #ccc; border-radius: 8px; outline: none; transition: border 0.3s; }
        .booking-form input:focus { border: 1px solid #007bff; }
        .form-row { display: flex; gap: 15px; }
        .submit-btn { background: linear-gradient(45deg, #007bff, #00c6ff); color: white; padding: 12px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.3s, transform 0.2s; }
        .submit-btn:hover { background: linear-gradient(45deg, #0056b3, #0099cc); transform: translateY(-2px); }
        @media (max-width: 768px) {
          .booking-container {
            flex-direction: column;
            margin: 10px;
            gap: 20px;
          }
          .form-row {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="booking-container">

        {/* Thông tin xe */}
        <div className="car-summary">

          <img
            src={vehicle.image || '/images/default-car.jpg'}
            alt={vehicle.name}
            className="car-img"
            onError={(e) => {
              e.target.src = '/images/default-car.jpg';
            }}
          />
          <h2 className="car-title">{vehicle.name}</h2>
          <p className="car-price">{vehicle.price} VNĐ / ngày</p>
          <ul className="car-info">
            <li>🚗 {vehicle.type}</li>
            <li>👥 {vehicle.seats}</li>
            <li>⚡ {vehicle.range}</li>
            <li>🧳 Cốp {vehicle.trunk}</li>
            <li>🔑 Số tự động</li>
          </ul>
        </div>

        {/* Form đặt xe */}
        <div className="booking-form">
          <div className="booking-form-header">
            <h2>Đặt xe ngay</h2>
            <button className="close-btn" onClick={() => navigate("/dashboard")}>
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              Họ và tên
              <input name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              type="text" 
              placeholder="Nhập họ tên của bạn" 
              required />
            </label>
            <label>
              Số điện thoại
              <input name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
              type="tel" 
              placeholder="Nhập số điện thoại" 
              required />
            </label>
            <label>
              Email
              <input name="email" 
              value={formData.email} 
              onChange={handleChange} 
              type="email" 
              placeholder="example@email.com" 
              required />
            </label>
            <div className="form-row">
              <label>
                Ngày nhận xe
                <input name="pickupTime" 
                value={formData.pickupTime} 
                onChange={handleChange} 
                type="date" 
                required />
              </label>
              <label>
                Ngày trả xe
                <input name="returnTime" 
                value={formData.returnTime} 
                onChange={handleChange} 
                type="date" 
                required />
              </label>
            </div>
            <label>
              Địa điểm nhận xe
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <input name="pickupArea" 
                value={formData.pickupArea} 
                onChange={handleChange} 
                type="text" 
                placeholder="Nhập địa chỉ hoặc sử dụng vị trí hiện tại" 
                required
                style={{ flex: 1 }}/>

                <button 
                  type="button" 
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {gettingLocation ? 'Đang lấy...' : '📍 Vị trí hiện tại'}
                </button>
              </div>
            </label>
            <label>
              Địa điểm trả xe
              <input name="returnArea" value={formData.returnArea} onChange={handleChange} type="text" placeholder="Hiệp Bình Chánh, Thủ Đức, TP.HCM..." />
            </label>
            <button type="submit" className="submit-btn">
              Xác nhận đặt xe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
