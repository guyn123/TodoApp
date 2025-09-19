export const fetchAdministrativeData = async () => {
  const res = await fetch("https://provinces.open-api.vn/api/?depth=3");
  const data = await res.json();

  return data.map((province: any) => ({
    value: province.name,
    label: province.name,
    children: province.districts.map((district: any) => ({
      value: district.name,
      label: district.name,
      children: district.wards.map((ward: any) => ({
        value: ward.name,
        label: ward.name,
      })),
    })),
  }));
};

export const geocodeAddress = async (address: string) => {
  const key = process.env.NEXT_PUBLIC_GOONG_KEY;
  const res = await fetch(
    `https://rsapi.goong.io/geocode?address=${encodeURIComponent(
      address
    )}&api_key=${key}`
  );
  return res.json();
};

export const reverseGeocode = async (lat: number, lng: number) => {
  const key = process.env.NEXT_PUBLIC_GOONG_KEY;
  const res = await fetch(
    `https://rsapi.goong.io/reverse?lat=${lat}&lng=${lng}&api_key=${key}`
  );
  return res.json();
};
