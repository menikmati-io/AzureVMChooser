// Charger les données JSON
fetch('merged.json')
  .then(response => response.json())
  .then(data => {
    const table = document.getElementById("data-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    if (data.length === 0) return;

    // Générer les en-têtes du tableau
    const headers = Object.keys(data[0]);
    thead.innerHTML = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';

    // Fonction pour ajouter les lignes
    function renderTable(filteredData) {
      tbody.innerHTML = '';
      filteredData.forEach(item => {
        const row = '<tr>' + headers.map(h => `<td>${item[h] ?? ''}</td>`).join('') + '</tr>';
        tbody.innerHTML += row;
      });
    }

    // Afficher le tableau initial
    renderTable(data);

    // Recherche dynamique
    document.getElementById('search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = data.filter(item =>
        headers.some(h => (item[h] + '').toLowerCase().includes(q))
      );
      renderTable(filtered);
    });
  });
