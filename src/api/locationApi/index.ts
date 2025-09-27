const GOONG_KEY = process.env.NEXT_PUBLIC_GOONG_KEY;

// Lấy danh sách tỉnh
export const fetchProvinces = async () => {
  const res = await fetch("https://provinces.open-api.vn/api/?depth=1");
  const data = await res.json();
  return data.map((p: any) => ({ value: p.code, label: p.name }));
};

// Lấy danh sách huyện theo tỉnh
export const fetchDistricts = async (provinceCode: string) => {
  const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
  const data = await res.json();
  return data.districts.map((d: any) => ({ value: d.code, label: d.name }));
};

// Lấy danh sách phường theo uyện
export const fetchWards = async (districtCode: string) => {
  const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
  const data = await res.json();
  return data.wards.map((w: any) => ({ value: w.code, label: w.name }));
};

// Geocode địa chỉ
export const geocodeAddress = async (address: string) => {
  const res = await fetch(
    `https://rsapi.goong.io/geocode?address=${encodeURIComponent(address)}&api_key=${GOONG_KEY}`
  );
  return res.json();
};

// Reverse geocode
export const reverseGeocode = async (lat: number, lng: number) => {
  const res = await fetch(
    `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_KEY}`
  );
  return res.json();
};
