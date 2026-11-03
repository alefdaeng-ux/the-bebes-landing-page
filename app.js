/**
 * THE BEBES — PIZZA & BOLEN JUMBO
 * Katalog & Pre-Order Mandiri (Minggu 11)
 *
 * Aturan implementasi:
 * - Bebas dari simbol emoji (zero emojis).
 * - Warna netral dan hangat, tanpa warna neon.
 * - Menggunakan icon SVG berbasis stroke.
 * - Format pesan terstruktur #ORDER-BEBES sesuai wireframe laporan.
 */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------
  // 1. DATA PRODUK (Sesuai Dokumen & Wireframe Gambar 1)
  // -------------------------------------------------------------
  const PRODUCTS = [
    {
      id: 'bolen-cokelat-keju',
      name: 'Bolen Cokelat Keju Jumbo',
      category: 'Bolen Jumbo Spesial',
      price: 20000,
      desc: 'Isi pisang raja pilihan, lelehan cokelat manis, dan keju cheddar gurih berukuran jumbo.',
      image: 'assets/bolen_crop.jpg'
    },
    {
      id: 'bolen-original',
      name: 'Bolen Pisang Cokelat / Keju',
      category: 'Bolen Jumbo Original',
      price: 16000,
      desc: 'Varian original ukuran jumbo dengan pilihan isian pisang cokelat atau keju manis.',
      image: 'assets/bolen_tiktok.jpg'
    },
    {
      id: 'pizza-homemade',
      name: 'Pizza Homemade Spesial',
      category: 'Pizza Fresh Panggang',
      price: 30000,
      desc: 'Base pizza fresh harian, racikan saus spesial homemade, topping sosis sapi dan mozzarella gurih.',
      image: 'assets/pizza_spesial.jpg'
    }
  ];

  const STORE_CONFIG = {
    whatsappNumber: '6285299999644', // 0852-9999-9644
    storeName: 'Pizza & Bolen Jumbo The Bebes',
    location: 'Jl. Poros Moncongloe, Maros'
  };

  // -------------------------------------------------------------
  // 2. STATE APLIKASI
  // -------------------------------------------------------------
  const state = {
    cart: {
      'bolen-cokelat-keju': 0,
      'bolen-original': 0,
      'pizza-homemade': 0
    },
    customerName: '',
    serviceMethod: 'pickup', // 'pickup' | 'cod'
    codSlot: '16.00 WITA',   // '16.00 WITA' | '17.00 WITA'
    orderNotes: '',
    paymentMethod: 'cash',   // 'cash' | 'qris'
    cashAmount: 0,
    isExactCash: false
  };

  // -------------------------------------------------------------
  // 3. ELEMEN DOM
  // -------------------------------------------------------------
  const productGrid = document.getElementById('productGrid');
  const customerNameInput = document.getElementById('customerName');
  const serviceMethodRadios = document.querySelectorAll('input[name="serviceMethod"]');
  const codSlotContainer = document.getElementById('codSlotContainer');
  const codSlotRadios = document.querySelectorAll('input[name="codSlot"]');
  const orderNotesInput = document.getElementById('orderNotes');

  const orderItemsList = document.getElementById('orderItemsList');
  const totalAmountDisplay = document.getElementById('totalAmountDisplay');
  const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const cashCalcBlock = document.getElementById('cashCalcBlock');
  const qrisInfoBlock = document.getElementById('qrisInfoBlock');
  const cashAmountInput = document.getElementById('cashAmountInput');
  const quickCashChips = document.querySelectorAll('.cash-chip');
  const changeResultBox = document.getElementById('changeResultBox');
  const changeAmountDisplay = document.getElementById('changeAmountDisplay');
  const changeDescText = document.getElementById('changeDescText');

  const messagePreview = document.getElementById('messagePreview');
  const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');
  const btnWhatsappText = document.getElementById('btnWhatsappText');

  const stickyMobileBar = document.getElementById('stickyMobileBar');
  const stickyQtyDisplay = document.getElementById('stickyQtyDisplay');
  const stickyTotalDisplay = document.getElementById('stickyTotalDisplay');
  const btnStickyCheckout = document.getElementById('btnStickyCheckout');

  const btnToggleHistory = document.getElementById('btnToggleHistory');
  const historyPanel = document.getElementById('historyPanel');
  const historyListContainer = document.getElementById('historyListContainer');
  const btnClearHistory = document.getElementById('btnClearHistory');

  // -------------------------------------------------------------
  // 4. FORMATTER RUPIAH
  // -------------------------------------------------------------
  function formatRupiah(number) {
    return 'Rp ' + Number(number).toLocaleString('id-ID');
  }

  // -------------------------------------------------------------
  // 5. RENDER KATALOG MENU
  // -------------------------------------------------------------
  function renderProducts() {
    productGrid.innerHTML = PRODUCTS.map(prod => {
      const qty = state.cart[prod.id] || 0;
      const isSelected = qty > 0;

      return `
        <article class="product-card ${isSelected ? 'has-selected' : ''}" data-product-id="${prod.id}">
          <div class="product-media-wrap">
            <img src="${prod.image}" alt="${prod.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="product-img-fallback is-hidden" style="width:100%; height:100%; display:none; align-items:center; justify-content:center; background-color:#f1ede5; color:#78716c;">
              <svg class="icon icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
              </svg>
            </div>
            <span class="product-badge-category">${prod.category}</span>
          </div>

          <div class="product-body">
            <div class="product-info-group">
              <h3 class="product-title">${prod.name}</h3>
              <p class="product-desc">${prod.desc}</p>
            </div>

            <div class="product-footer-row">
              <div class="product-price-col">
                <span class="price-label">Harga</span>
                <span class="product-price">${formatRupiah(prod.price)}</span>
              </div>

              <div class="stepper-control" aria-label="Jumlah pesanan ${prod.name}">
                <button type="button" class="stepper-btn btn-decrease" data-id="${prod.id}" ${qty === 0 ? 'disabled' : ''} aria-label="Kurangi 1">
                  <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <span class="stepper-value" id="qty-${prod.id}">${qty}</span>
                <button type="button" class="stepper-btn btn-increase" data-id="${prod.id}" aria-label="Tambah 1">
                  <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach event listeners to steppers
    productGrid.querySelectorAll('.btn-increase').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        state.cart[id] = (state.cart[id] || 0) + 1;
        updateUI();
      });
    });

    productGrid.querySelectorAll('.btn-decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (state.cart[id] > 0) {
          state.cart[id] -= 1;
          updateUI();
        }
      });
    });
  }

  // -------------------------------------------------------------
  // 6. PERHITUNGAN TOTAL DAN KEMBALIAN
  // -------------------------------------------------------------
  function calculateTotals() {
    let totalItems = 0;
    let totalPrice = 0;
    const items = [];

    PRODUCTS.forEach(p => {
      const qty = state.cart[p.id] || 0;
      if (qty > 0) {
        const subtotal = qty * p.price;
        totalItems += qty;
        totalPrice += subtotal;
        items.push({
          id: p.id,
          name: p.name,
          price: p.price,
          qty: qty,
          subtotal: subtotal
        });
      }
    });

    return { totalItems, totalPrice, items };
  }

  // -------------------------------------------------------------
  // 7. SINKRONISASI TAMPILAN (UPDATE UI)
  // -------------------------------------------------------------
  function updateUI() {
    const { totalItems, totalPrice, items } = calculateTotals();

    // 1. Update product card active classes & counter values
    PRODUCTS.forEach(p => {
      const qty = state.cart[p.id] || 0;
      const card = productGrid.querySelector(`[data-product-id="${p.id}"]`);
      const qtyElem = document.getElementById(`qty-${p.id}`);
      if (qtyElem) qtyElem.textContent = qty;

      if (card) {
        if (qty > 0) {
          card.classList.add('has-selected');
        } else {
          card.classList.remove('has-selected');
        }
        const decBtn = card.querySelector('.btn-decrease');
        if (decBtn) decBtn.disabled = qty === 0;
      }
    });

    // 2. Render Order Items Breakdown
    if (items.length === 0) {
      orderItemsList.innerHTML = '<p class="empty-cart-text">Belum ada menu yang dipilih. Silakan tekan tombol (+) pada katalog menu di atas.</p>';
    } else {
      orderItemsList.innerHTML = items.map(item => `
        <div class="order-item-row">
          <div class="order-item-meta">
            <strong>${item.qty}x</strong> ${item.name}
          </div>
          <div class="order-item-subtotal">${formatRupiah(item.subtotal)}</div>
        </div>
      `).join('');
    }

    totalAmountDisplay.textContent = formatRupiah(totalPrice);

    // 3. Update Sticky Bar on Mobile
    if (totalItems > 0) {
      stickyMobileBar.classList.add('is-visible');
      stickyQtyDisplay.textContent = `${totalItems} Menu Dipilih`;
      stickyTotalDisplay.textContent = formatRupiah(totalPrice);
    } else {
      stickyMobileBar.classList.remove('is-visible');
    }

    // 4. Update Cash Kembalian Calculation
    updateChangeCalculation(totalPrice);

    // 5. Update WhatsApp Message Preview & Button State
    updateMessagePreview(totalPrice, items);
  }

  // -------------------------------------------------------------
  // 8. LOGIKA KALKULATOR UANG KEMBALIAN
  // -------------------------------------------------------------
  function updateChangeCalculation(totalPrice) {
    if (state.paymentMethod !== 'cash') {
      cashCalcBlock.classList.add('is-hidden');
      qrisInfoBlock.classList.remove('is-hidden');
      return;
    }

    cashCalcBlock.classList.remove('is-hidden');
    qrisInfoBlock.classList.add('is-hidden');

    if (totalPrice === 0) {
      changeResultBox.className = 'change-result-box neutral-state';
      changeAmountDisplay.textContent = 'Pilih menu terlebih dahulu';
      changeDescText.textContent = 'Nominal kembalian akan otomatis dihitung setelah Anda memilih menu.';
      return;
    }

    let cash = state.cashAmount;

    if (state.isExactCash) {
      cash = totalPrice;
      cashAmountInput.value = totalPrice;
    }

    if (!cash || cash <= 0) {
      changeResultBox.className = 'change-result-box neutral-state';
      changeAmountDisplay.textContent = 'Masukkan pecahan uang';
      changeDescText.textContent = 'Pilih tombol pecahan cepat atau ketik nominal uang tunai yang dibawa pembeli.';
      return;
    }

    const difference = cash - totalPrice;

    if (difference > 0) {
      // Uang lebih -> Ada kembalian
      changeResultBox.className = 'change-result-box valid-change';
      changeAmountDisplay.textContent = `Kembalian: ${formatRupiah(difference)}`;
      changeDescText.textContent = `Penjual / kasir di gerai harus menyiapkan uang kembalian sebesar ${formatRupiah(difference)}.`;
    } else if (difference === 0) {
      // Uang pas
      changeResultBox.className = 'change-result-box valid-change';
      changeAmountDisplay.textContent = 'Uang Pas (Tanpa Kembalian)';
      changeDescText.textContent = 'Pembeli membayar dengan uang pas. Penjual tidak perlu mencari uang kembalian.';
    } else {
      // Uang kurang
      changeResultBox.className = 'change-result-box insufficient';
      changeAmountDisplay.textContent = `Kurang ${formatRupiah(Math.abs(difference))}`;
      changeDescText.textContent = `Nominal uang tunai yang dimasukkan masih kurang ${formatRupiah(Math.abs(difference))} dari total belanja.`;
    }
  }

  // -------------------------------------------------------------
  // 9. GENERATOR FORMAT PESAN WHATSAPP (#ORDER-BEBES)
  // -------------------------------------------------------------
  function buildOrderText(totalPrice, items) {
    const nameStr = state.customerName.trim() || '(Nama belum diisi)';

    const itemsText = items.length > 0
      ? items.map(it => `• ${it.qty}x ${it.name} (${formatRupiah(it.subtotal)})`).join('\n')
      : '(Belum ada menu dipilih)';

    let serviceText = 'Ambil Langsung di Gerai';
    if (state.serviceMethod === 'cod') {
      serviceText = `Antar COD FM2 (Slot ${state.codSlot})`;
    }

    let paymentText = 'Tunai (Cash)';
    let changeText = 'Tidak butuh kembalian';

    if (state.paymentMethod === 'qris') {
      paymentText = 'QRIS Statis (Scan di Gerai / Transfer)';
      changeText = '-';
    } else {
      const cash = state.isExactCash ? totalPrice : state.cashAmount;
      if (cash > 0) {
        paymentText = `Tunai (Uang Dibawa: ${formatRupiah(cash)})`;
        const diff = cash - totalPrice;
        if (diff > 0) {
          changeText = `${formatRupiah(diff)}`;
        } else if (diff === 0) {
          changeText = 'Rp 0 (Uang Pas)';
        } else {
          changeText = `Kurang ${formatRupiah(Math.abs(diff))}`;
        }
      } else {
        paymentText = 'Tunai (Nominal uang belum ditentukan)';
        changeText = 'Belum dihitung';
      }
    }

    let message = `#ORDER-BEBES (PRE-ORDER WEB)
----------------------------------------
Nama: ${nameStr}
Pesanan:
${itemsText}
----------------------------------------
Total Bayar: ${formatRupiah(totalPrice)}
Layanan: ${serviceText}
Pembayaran: ${paymentText}`;

    if (state.paymentMethod === 'cash') {
      message += `\nSiapkan Kembalian: ${changeText}`;
    }

    if (state.orderNotes.trim()) {
      message += `\nCatatan: ${state.orderNotes.trim()}`;
    }

    return message;
  }

  function updateMessagePreview(totalPrice, items) {
    const message = buildOrderText(totalPrice, items);
    messagePreview.textContent = message;

    // Validasi form untuk aktivasi tombol WhatsApp
    const hasItems = items.length > 0;
    const hasName = state.customerName.trim().length > 0;

    let isCashValid = true;
    if (state.paymentMethod === 'cash') {
      const cash = state.isExactCash ? totalPrice : state.cashAmount;
      isCashValid = cash >= totalPrice && cash > 0;
    }

    const isValid = hasItems && hasName && isCashValid;

    btnSendWhatsapp.disabled = !isValid;

    if (!hasItems) {
      btnWhatsappText.textContent = 'Pilih Minimal 1 Menu Terlebih Dahulu';
    } else if (!hasName) {
      btnWhatsappText.textContent = 'Isi Nama Pemesan di Formulir';
    } else if (!isCashValid) {
      btnWhatsappText.textContent = 'Tentukan Pecahan Uang Tunai yang Cukup';
    } else {
      btnWhatsappText.textContent = 'Pesan Sekarang via WhatsApp (1-Klik)';
    }
  }

  // -------------------------------------------------------------
  // 10. EVENT HANDLERS: FORMULIR & INTERAKSI
  // -------------------------------------------------------------

  // Input Nama
  customerNameInput.addEventListener('input', (e) => {
    state.customerName = e.target.value;
    updateUI();
  });

  // Catatan Tambahan
  orderNotesInput.addEventListener('input', (e) => {
    state.orderNotes = e.target.value;
    updateUI();
  });

  // Metode Layanan (Ambil di Gerai vs Antar COD FM2)
  serviceMethodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.serviceMethod = e.target.value;
      if (state.serviceMethod === 'cod') {
        codSlotContainer.classList.remove('is-hidden');
      } else {
        codSlotContainer.classList.add('is-hidden');
      }
      updateUI();
    });
  });

  // Slot Jam COD
  codSlotRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.codSlot = e.target.value;
      updateUI();
    });
  });

  // Pilihan Metode Pembayaran (Tunai vs QRIS)
  paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.paymentMethod = e.target.value;
      updateUI();
    });
  });

  // Quick Cash Chips
  quickCashChips.forEach(chip => {
    chip.addEventListener('click', () => {
      quickCashChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const cashVal = chip.getAttribute('data-cash');
      const { totalPrice } = calculateTotals();

      if (cashVal === 'exact') {
        state.isExactCash = true;
        state.cashAmount = totalPrice;
        cashAmountInput.value = totalPrice > 0 ? totalPrice : '';
      } else {
        state.isExactCash = false;
        const parsed = parseInt(cashVal, 10);
        state.cashAmount = parsed;
        cashAmountInput.value = parsed;
      }

      updateUI();
    });
  });

  // Manual Cash Input
  cashAmountInput.addEventListener('input', (e) => {
    quickCashChips.forEach(c => c.classList.remove('is-active'));
    state.isExactCash = false;
    const val = parseInt(e.target.value, 10);
    state.cashAmount = isNaN(val) ? 0 : val;
    updateUI();
  });

  // Sticky Bar Button (scroll to form)
  btnStickyCheckout.addEventListener('click', () => {
    const targetSection = document.getElementById('layanan-section');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
      customerNameInput.focus();
    }
  });

  // -------------------------------------------------------------
  // 11. AKSI FINAL: KIRIM KE WHATSAPP (CLICK-TO-CHAT API)
  // -------------------------------------------------------------
  btnSendWhatsapp.addEventListener('click', () => {
    const { totalPrice, items } = calculateTotals();
    if (items.length === 0 || !state.customerName.trim()) {
      return;
    }

    const orderText = buildOrderText(totalPrice, items);
    const encodedText = encodeURIComponent(orderText);
    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedText}`;

    // Simpan pesanan ke riwayat lokal di browser
    saveOrderToLocalHistory({
      id: 'BEBES-' + Date.now().toString().slice(-4),
      timestamp: new Date().toLocaleString('id-ID'),
      customerName: state.customerName.trim(),
      total: totalPrice,
      service: state.serviceMethod === 'cod' ? `COD FM2 (${state.codSlot})` : 'Ambil di Gerai',
      payment: state.paymentMethod === 'cash' ? 'Tunai' : 'QRIS',
      itemsCount: items.reduce((acc, curr) => acc + curr.qty, 0)
    });

    // Buka aplikasi WhatsApp
    window.open(waUrl, '_blank');
  });

  // -------------------------------------------------------------
  // 12. LOG PESANAN LOKAL (BANTUAN KASIR & PEMILIK)
  // -------------------------------------------------------------
  const STORAGE_KEY = 'the_bebes_order_logs';

  function getLocalHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveOrderToLocalHistory(entry) {
    const history = getLocalHistory();
    history.unshift(entry);
    if (history.length > 20) history.pop(); // simpan maksimal 20 pesanan terakhir
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      renderLocalHistory();
    } catch (e) {
      console.warn('Gagal menyimpan log lokal:', e);
    }
  }

  function renderLocalHistory() {
    const history = getLocalHistory();
    if (history.length === 0) {
      historyListContainer.innerHTML = '<p class="empty-history-text">Belum ada pesanan yang tercatat di perangkat ini.</p>';
      return;
    }

    historyListContainer.innerHTML = history.map(item => `
      <div class="history-entry">
        <div class="history-entry-top">
          <span>${item.id} — ${item.customerName}</span>
          <span>${formatRupiah(item.total)}</span>
        </div>
        <div class="history-entry-details">
          ${item.timestamp} | ${item.itemsCount} menu | ${item.service} | ${item.payment}
        </div>
      </div>
    `).join('');
  }

  btnToggleHistory.addEventListener('click', () => {
    historyPanel.classList.toggle('is-hidden');
    if (!historyPanel.classList.contains('is-hidden')) {
      renderLocalHistory();
    }
  });

  btnClearHistory.addEventListener('click', () => {
    if (confirm('Hapus seluruh riwayat pesanan lokal di perangkat ini?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderLocalHistory();
    }
  });

  // -------------------------------------------------------------
  // 13. INISIALISASI
  // -------------------------------------------------------------
  renderProducts();
  updateUI();

});

