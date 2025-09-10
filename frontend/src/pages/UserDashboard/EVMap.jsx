import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icon vị trí hiện tại
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

// Icon trạm sạc
const chargerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Component để điều khiển map khi search
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);
  return null;
}

// Hàm tính khoảng cách (chim bay)
function getDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function EVMap() {
  const [userPosition, setUserPosition] = useState(null);
  const [stations, setStations] = useState([]);
  const [route, setRoute] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Lấy vị trí hiện tại
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition([latitude, longitude]);
        fetchStations([latitude, longitude]);
      },
      (err) => {
        console.error("Không thể lấy vị trí:", err);
        // mặc định Hồ Chí Minh
        const lat = 10.7769,
          lon = 106.7009;
        setUserPosition([lat, lon]);
        fetchStations([lat, lon]);
      }
    );
  }, []);

  // Gọi API OpenChargeMap + trạm giả
  const fetchStations = async ([lat, lon]) => {
    let data = [];
    try {
      const res = await fetch(
        `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&maxresults=10&distance=5&distanceunit=KM`
      );
      data = await res.json();
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    }

    const fakeStations = [
      {
        ID: 9991,
        AddressInfo: {
          Title: "Trạm sạc giả A",
          Latitude: 10.7809,
          Longitude: 106.695,
          AddressLine1: "Quận 1, TP.HCM",
        },
        ImageURL: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png",
      },
      {
        ID: 9992,
        AddressInfo: {
          Title: "Trạm sạc giả B",
          Latitude: 10.772,
          Longitude: 106.71,
          AddressLine1: "Quận 3, TP.HCM",
        },
        ImageURL: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png",
      },
    ];

    data = [...data, ...fakeStations];
    setStations(data);

    if (data.length > 0 && userPosition) {
      let minDist = Infinity;
      let nearest = null;
      data.forEach((station) => {
        const sPos = [station.AddressInfo.Latitude, station.AddressInfo.Longitude];
        const dist = getDistance(userPosition, sPos);
        if (dist < minDist) {
          minDist = dist;
          nearest = station;
        }
      });
      setNearestStation(nearest);
    }
  };

  // Tìm đường
  const findRoute = async (station) => {
    if (!userPosition || !station) return;
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userPosition[1]},${userPosition[0]};${station.AddressInfo.Longitude},${station.AddressInfo.Latitude}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(coords);
      }
    } catch (err) {
      console.error("Lỗi khi tìm đường:", err);
    }
  };

  // Tìm kiếm trạm theo tên
  const handleSearch = () => {
    const result = stations.find((s) =>
      s.AddressInfo.Title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (result) {
      setSearchResult([result.AddressInfo.Latitude, result.AddressInfo.Longitude]);
    } else {
      alert("Không tìm thấy trạm!");
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* Thanh tìm kiếm */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "white",
          padding: "8px",
          borderRadius: "8px",
          display: "flex",
          gap: "5px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <input
          type="text"
          placeholder="Tìm trạm sạc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "5px" }}
        />
        <button onClick={handleSearch}>Tìm</button>
      </div>

      <MapContainer
        center={userPosition || [10.7769, 106.7009]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToLocation position={searchResult} />

        {/* Vị trí user */}
        {userPosition && (
          <Marker position={userPosition} icon={userIcon}>
            <Popup>Bạn đang ở đây</Popup>
          </Marker>
        )}

        {/* Trạm sạc */}
        {stations.map((station) => (
          <Marker
            key={station.ID}
            position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]}
            icon={chargerIcon}
          >
            <Popup>
              <b>{station.AddressInfo.Title}</b>
              <br />
              {station.AddressInfo.AddressLine1 && (
                <>
                  <small>{station.AddressInfo.AddressLine1}</small>
                  <br />
                </>
              )}
              {station.ImageURL && (
                <img
                  src={station.ImageURL}
                  alt="charger"
                  style={{ width: "80px", marginTop: "5px" }}
                />
              )}
              <br />
              <button onClick={() => findRoute(station)}>Tìm đường</button>
            </Popup>
          </Marker>
        ))}

        {/* Vẽ đường */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}

        {/* Trạm gần nhất */}
        {nearestStation && (
          <Marker
            position={[
              nearestStation.AddressInfo.Latitude,
              nearestStation.AddressInfo.Longitude,
            ]}
            icon={chargerIcon}
          >
            <Popup>
              Trạm gần nhất: {nearestStation.AddressInfo.Title}
              <br />
              <button onClick={() => findRoute(nearestStation)}>Tìm đường</button>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
