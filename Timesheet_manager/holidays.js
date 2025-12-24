// Holidays editor (localStorage.fms_holidays)

(function () {
  const KEY = 'fms_holidays';

  const tbody = document.getElementById('tbody');
  const hDate = document.getElementById('h_date');
  const hName = document.getElementById('h_name');

  const btnAdd = document.getElementById('btnAdd');
  const btnClear = document.getElementById('btnClear');
  const btnRefresh = document.getElementById('btnRefresh');

  function safeJsonParse(str, fallback) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  }

  function loadHolidays() {
    const raw = safeJsonParse(localStorage.getItem(KEY) || '[]', []);
    return Array.isArray(raw) ? raw : [];
  }

  function saveHolidays(list) {
    localStorage.setItem(KEY, JSON.stringify(Array.isArray(list) ? list : []));
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function render() {
    const list = loadHolidays()
      .filter((h) => h && h.date)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));

    tbody.innerHTML = list
      .map((h) => {
        return `
          <tr>
            <td class="mono">${escapeHtml(h.date)}</td>
            <td>${escapeHtml(h.name || '')}</td>
            <td><button class="link-btn" data-date="${escapeHtml(h.date)}">Remove</button></td>
          </tr>
        `;
      })
      .join('');

    tbody.querySelectorAll('button.link-btn[data-date]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const date = btn.getAttribute('data-date');
        if (!date) return;
        if (!confirm(`Remove holiday on ${date}?`)) return;
        const next = loadHolidays().filter((h) => String(h?.date) !== String(date));
        saveHolidays(next);
        render();
      });
    });
  }

  function addHoliday() {
    const date = String(hDate.value || '').trim();
    const name = String(hName.value || '').trim();

    if (!date) {
      alert('Please select a date.');
      return;
    }

    const list = loadHolidays();
    const existingIdx = list.findIndex((h) => String(h?.date) === date);
    const item = { date, name };

    if (existingIdx >= 0) {
      list[existingIdx] = item;
    } else {
      list.push(item);
    }

    saveHolidays(list);
    hName.value = '';
    render();
  }

  btnAdd.addEventListener('click', addHoliday);
  btnClear.addEventListener('click', () => {
    hDate.value = '';
    hName.value = '';
  });
  btnRefresh.addEventListener('click', render);

  // Init
  render();
})();

