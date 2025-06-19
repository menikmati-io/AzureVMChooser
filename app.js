fetch('merged.json')
  .then(response => response.json())
  .then(data => {
    const table = document.getElementById("data-table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    const searchInput = document.getElementById("search");
    const checkboxContainer = document.getElementById("checkbox-filters");

    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    thead.innerHTML = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';

    // Features qu’on veut filtrer (par checkbox)
    const filterableFeatures = headers.filter(h => {
      const values = data.map(d => (d[h] || "").trim().toLowerCase());
      return values.includes("supported") || values.includes("not supported");
    });

    // Créer les checkbox par feature
    const featureState = {}; // e.g., { "Accelerated Networking": ["Supported"] }
    filterableFeatures.forEach(feature => {
      const group = document.createElement("div");
      group.className = "filter-group";

      const label = document.createElement("strong");
      label.textContent = feature;
      group.appendChild(label);

      ["Supported", "Not Supported"].forEach(value => {
        const id = `${feature}-${value}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.dataset.feature = feature;
        checkbox.dataset.value = value;

        checkbox.addEventListener("change", renderFilteredTable);

        const cbLabel = document.createElement("label");
        cbLabel.htmlFor = id;
        cbLabel.textContent = " " + value;

        group.appendChild(document.createElement("br"));
        group.appendChild(checkbox);
        group.appendChild(cbLabel);
      });

      checkboxContainer.appendChild(group);
    });

    // Fonction principale de rendu
    function renderFilteredTable() {
      const query = searchInput.value.toLowerCase();

      // Lire les états des checkbox
      const activeFilters = {};
      document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
        const f = cb.dataset.feature;
        const v = cb.dataset.value;
        if (!activeFilters[f]) activeFilters[f] = [];
        activeFilters[f].push(v.toLowerCase());
      });

      const filtered = data.filter(item => {
        // Filtre global
        const matchSearch = query === '' || Object.values(item).some(val =>
          (val + '').toLowerCase().includes(query)
        );

        // Filtre par checkbox
        const matchFilters = Object.entries(activeFilters).every(([feature, allowedVals]) => {
          const actual = (item[feature] || '').toLowerCase();
          return allowedVals.includes(actual);
        });

        return matchSearch && matchFilters;
      });

      tbody.innerHTML = '';
      filtered.forEach(item => {
        const row = '<tr>' + headers.map(h => `<td>${item[h] ?? ''}</td>`).join('') + '</tr>';
        tbody.innerHTML += row;
      });
    }

    // Initial render
    searchInput.addEventListener('input', renderFilteredTable);
    renderFilteredTable();
  });

