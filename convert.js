const fs = require('fs');

async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.length > 0) {
    return {
      lat: parseFloat(json[0].lat),
      lon: parseFloat(json[0].lon)
    };
  }

  return { lat: null, lon: null };
}

async function run() {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    console.log(`Обработка ${i + 1}/${data.length}`);

    const coords = await geocode(item['Адрес предоставления услуги']);

    item.lat = coords.lat;
    item.lon = coords.lon;

    // чтобы не забанили API
    await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync('data_with_coords.json', JSON.stringify(data, null, 2));
}

run();
