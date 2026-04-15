    let allGempaData = [];
    let map;
    let markersLayer = L.layerGroup();

    // Inisialisasi Peta
    function initMap() {
        map = L.map('map').setView([-2.5, 118], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        markersLayer.addTo(map);
    }

    async function loadGempaData() {
        const loader = document.getElementById('loader');
        loader.style.display = 'flex';

        try {
            // Fetch Gempa Terbaru (Single)
            const resLatest = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
            const dataLatest = await resLatest.json();
            displayLatestGempa(dataLatest.Infogempa.gempa);
            console.log(dataLatest.Infogempa.gempa);
            

            // // Fetch 15 Gempa Terkini (List)
            const resList = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json');
            const dataList = await resList.json();
            allGempaData = dataList.Infogempa.gempa;

            updateStats(allGempaData);
            displayData(allGempaData);
            updateMarkers(allGempaData, dataLatest.Infogempa.gempa);
        } catch (error) {
            console.error("Error fetching data:", error);
            document.getElementById('gempa-container').innerHTML = `
                <div class="col-12"><div class="alert alert-danger">Gagal mengambil data dari BMKG. Silakan coba lagi.</div></div>
            `;
        } finally {
            loader.style.display = 'none';
        }
    }

    function displayLatestGempa(gempa) {
        const container = document.getElementById('latest-gempa-container');
        const shakemapUrl = `https://static.bmkg.go.id/${gempa.Shakemap}`;
        console.log(shakemapUrl);
        

        container.innerHTML = `
            <div class="card card-latest shadow-lg">
                <div class="row g-0">
                    <div class="col-lg-4 p-4 d-flex align-items-center justify-content-center bg-white">
                        <img src="${shakemapUrl}" class="shakemap-img shadow-sm" alt="Peta Guncangan" onerror="this.src='https://placehold.co/400x400?text=Peta+Guncangan+Tidak+Tersedia'">
                    </div>
                    <div class="col-lg-8 p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge bg-danger px-3 py-2 fs-5">M ${gempa.Magnitude}</span>
                            <div class="text-end">
                                <span class="d-block fw-bold">${gempa.Jam} WIB</span>
                                <small class="text-muted">${gempa.Tanggal}</small>
                            </div>
                        </div>
                        <h2 class="fw-bold mb-3">${gempa.Wilayah}</h2>
                        <div class="row g-3">
                            <div class="col-6 col-md-3 border-start ps-3">
                                <small class="text-muted d-block text-uppercase">Kedalaman</small>
                                <span class="fw-bold">${gempa.Kedalaman}</span>
                            </div>
                            <div class="col-6 col-md-3 border-start ps-3">
                                <small class="text-muted d-block text-uppercase">Koordinat</small>
                                <span class="fw-bold">${gempa.Coordinates}</span>
                            </div>
                            <div class="col-12 col-md-6 border-start ps-3">
                                <small class="text-muted d-block text-uppercase">Potensi</small>
                                <span class="fw-bold text-warning">⚠️ ${gempa.Potensi}</span>
                            </div>
                        </div>
                        <div class="mt-4 p-3 rounded bg-white bg-opacity-10 border border-white border-opacity-25">
                            <p class="mb-0 small">Dirasakan (MMI): <br><strong>${gempa.Dirasakan}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
 
 

function displayData(data) {
        const container = document.getElementById('gempa-container');
        container.innerHTML = '';

        if(data.length === 0) {
            container.innerHTML = '<div class="col-12 text-center p-5"><p class="text-muted">Wilayah tidak ditemukan.</p></div>';
            return;
        }

        data.forEach(gempa => {
            const mag = parseFloat(gempa.Magnitude);
            const magClass = mag >= 6.0 ? 'bg-danger text-white' : (mag >= 5.5 ? 'bg-warning text-dark' : 'bg-info text-white');

            const cardHtml = `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-recent h-100 shadow-sm" onclick="focusOnMap('${gempa.Coordinates}')">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-start justify-content-between mb-3">
                                <div class="badge-magnitude ${magClass}">
                                    ${gempa.Magnitude}
                                </div>
                                <div class="text-end">
                                    <div class="fw-bold">${gempa.Jam}</div>
                                    <small class="text-muted">${gempa.Tanggal}</small>
                                </div>
                            </div>
                            <h5 class="fw-bold text-primary mb-3">${gempa.Wilayah}</h5>
                            <div class="small">
                                <div class="d-flex justify-content-between mb-1">
                                    <span class="text-muted">Kedalaman</span>
                                    <span class="fw-semibold text-dark">${gempa.Kedalaman}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-1">
                                    <span class="text-muted">Koordinat</span>
                                    <span class="fw-semibold text-dark">${gempa.Coordinates}</span>
                                </div>
                                <div class="mt-3 p-2 rounded-3 bg-light text-center">
                                    <small class="text-danger fw-bold">⚠️ ${gempa.Potensi}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });
}

function updateStats(data) {
    document.getElementById('stat-total').innerText = data.length;
    const avg = data.reduce((acc, curr) => acc + parseFloat(curr.Magnitude), 0) / data.length;
    document.getElementById('stat-avg').innerText = avg.toFixed(1);
    document.getElementById('stat-time').innerText = data[0].Tanggal + ' ' + data[0].Jam;
}

function updateMarkers(listData, latestGempa) {
    markersLayer.clearLayers();

    // Gabungkan data untuk ditampilkan di peta (pastikan tidak duplikat jika latest ada di list)
    const combinedData = [...listData];

    combinedData.forEach(gempa => {
        const coords = gempa.Coordinates.split(',');
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);
        const isLatest = gempa.Wilayah === latestGempa.Wilayah && gempa.Jam === latestGempa.Jam;

        const marker = L.circleMarker([lat, lng], {
            radius: isLatest ? 15 : parseFloat(gempa.Magnitude) * 2,
            fillColor: isLatest ? "#ff0000" : (parseFloat(gempa.Magnitude) >= 6 ? "#ff4d4d" : "#ffcc00"),
            color: isLatest ? "#000" : "#fff",
            weight: isLatest ? 3 : 2,
            opacity: 1,
            fillOpacity: isLatest ? 0.9 : 0.7
        }).bindPopup(`
            <div style="font-family:sans-serif">
                ${isLatest ? '<span class="badge bg-danger mb-1 text-white">TERBARU</span><br>' : ''}
                <strong style="color: #003366">${gempa.Wilayah}</strong><br>
                Magnitude: <b>${gempa.Magnitude}</b><br>
                Kedalaman: ${gempa.Kedalaman}<br>
                <small>${gempa.Tanggal} | ${gempa.Jam}</small>
            </div>
        `);

        if (isLatest) marker.addTo(map); // Pastikan yang terbaru selalu terlihat
        markersLayer.addLayer(marker);
    });

    // Fokus ke gempa terbaru saat pertama kali load
    const latestCoords = latestGempa.Coordinates.split(',');
    map.setView([parseFloat(latestCoords[0]), parseFloat(latestCoords[1])], 6);
}

function filterData() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allGempaData.filter(g => g.Wilayah.toLowerCase().includes(query));
    displayData(filtered);
    // Tidak mengupdate marker agar peta tetap menampilkan semua titik yang ada di filter
}

function focusOnMap(coordsStr) {
    const coords = coordsStr.split(',');
    map.flyTo([parseFloat(coords[0]), parseFloat(coords[1])], 8);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// Jalankan saat load
window.onload = () => {
    initMap();
    loadGempaData();
};