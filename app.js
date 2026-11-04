/**
 * THE BEBES — PIZZA & BOLEN JUMBO
 * Menu & Pre-Order Mandiri (Minggu 11)
 *
 * Konfigurasi Utama:
 * - Bebas dari simbol emoji (zero emojis).
 * - Tanpa backend, login, database, atau localStorage.
 * - Format pesan seragam #ORDER-BEBES.
 */

// -------------------------------------------------------------
// 1. KONSTANTA UTAMA (Nomor WhatsApp & Slot Jam COD)
// -------------------------------------------------------------
const WHATSAPP_NUMBER = '6285299999644';
const COD_SLOTS = ['16.00 WITA', '17.15 WITA'];

// -------------------------------------------------------------
// 2. DATA PRODUK CONTOH (Untuk Uji Prototype)
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

// -------------------------------------------------------------
// 3. STATE APLIKASI
// -------------------------------------------------------------
const state = {
  cart: {
    'bolen-cokelat-keju': 0,
    'bolen-original': 0,
    'pizza-homemade': 0
  },
  customerName: '',
  serviceMethod: 'pickup', // 'pickup' | 'cod'
  codAddress: '',
  codSlot: COD_SLOTS[0] || '16.00 WITA',
  orderNotes: '',
  paymentMethod: 'cash',   // 'cash' | 'qris'
  cashOption: 'Uang pas',  // 'Uang pas' | 'Rp20.000' | 'Rp50.000' | 'Rp100.000' | 'Lainnya'
  customCash: ''
};

// -------------------------------------------------------------
// 4. FORMATTER RUPIAH
// -------------------------------------------------------------
function formatRupiah(number) {
  return 'Rp' + Number(number).toLocaleString('id-ID');
}

// -------------------------------------------------------------
// 5. INISIALISASI SETELAH DOM SIAP
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  // Referensi Elemen DOM
  const productGrid = document.getElementById('productGrid');
  const inquiryLink = document.getElementById('inquiryLink');

  const customerNameInput = document.getElementById('customerName');
  const serviceMethodRadios = document.querySelectorAll('input[name="serviceMethod"]');
  const codAddressGroup = document.getElementById('codAddressGroup');
  const codAddressInput = document.getElementById('codAddress');
  const codSlotGroup = document.getElementById('codSlotGroup');
  const codSlotsGrid = document.getElementById('codSlotsGrid');
  const orderNotesInput = document.getElementById('orderNotes');

  const orderItemsList = document.getElementById('orderItemsList');
  const totalAmountDisplay = document.getElementById('totalAmountDisplay');

  const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const cashDetailsBlock = document.getElementById('cashDetailsBlock');
  const qrisDetailsBlock = document.getElementById('qrisDetailsBlock');
  const cashOptionRadios = document.querySelectorAll('input[name="cashOption"]');
  const customCashGroup = document.getElementById('customCashGroup');
  const customCashInput = document.getElementById('customCashInput');

  const messagePreview = document.getElementById('messagePreview');
  const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');
  const btnWhatsappText = document.getElementById('btnWhatsappText');

  const stickyMobileBar = document.getElementById('stickyMobileBar');
  const stickyQtyDisplay = document.getElementById('stickyQtyDisplay');
  const stickyTotalDisplay = document.getElementById('stickyTotalDisplay');
  const btnStickyCheckout = document.getElementById('btnStickyCheckout');

  // Set URL Tautan Tanya Ketersediaan WhatsApp
  if (inquiryLink) {
    const inquiryText = encodeURIComponent('Halo, apakah menu hari ini tersedia?');
    inquiryLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${inquiryText}`;
  }

  // Render Slot COD Dinamis dari Konstanta
  function renderCodSlots() {
    codSlotsGrid.innerHTML = COD_SLOTS.map((slot, idx) => `
      <label class="slot-chip" for="slot-${idx}">
        <input type="radio" name="codSlot" id="slot-${idx}" value="${slot}" ${idx === 0 ? 'checked' : ''}>
        <div class="slot-chip-content">
          <span class="slot-time">${slot}</span>
        </div>
      </label>
    `).join('');

    codSlotsGrid.querySelectorAll('input[name="codSlot"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.codSlot = e.target.value;
        updateUI();
      });
    });
  }

  // Render Produk
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

    // Listener Counter
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

  // Hitung Total Belanja
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

  // Generator Format Pesan WhatsApp Sesuai Instruksi
  function buildOrderText(totalPrice, items) {
    const lines = [];
    lines.push('#ORDER-BEBES');
    lines.push(`Nama: ${state.customerName.trim() || '...'}`);

    if (state.serviceMethod === 'cod') {
      lines.push('Layanan: Antar COD FM2');
      lines.push(`Alamat: ${state.codAddress.trim() || '...'}`);
      lines.push(`Jam: ${state.codSlot}`);
    } else {
      lines.push('Layanan: Ambil di gerai');
    }

    lines.push('Pesanan:');
    if (items.length > 0) {
      items.forEach(it => {
        lines.push(`- ${it.name} x${it.qty} = ${formatRupiah(it.subtotal)}`);
      });
    } else {
      lines.push('(Belum ada menu dipilih)');
    }

    lines.push(`Total: ${formatRupiah(totalPrice)}`);

    if (state.paymentMethod === 'cash') {
      lines.push('Bayar: Tunai');
      let pecahanText = state.cashOption;
      if (state.cashOption === 'Lainnya') {
        pecahanText = state.customCash.trim() ? `${formatRupiah(state.customCash)}` : 'Lainnya (belum diisi)';
      }
      lines.push(`Pecahan dibawa: ${pecahanText}`);
    } else {
      lines.push('Bayar: QRIS statis');
    }

    if (state.orderNotes.trim()) {
      lines.push(`Catatan: ${state.orderNotes.trim()}`);
    }

    lines.push('Mohon konfirmasi stok & jam. Terima kasih.');

    return lines.join('\n');
  }

  // Update UI & Validasi Tombol
  function updateUI() {
    const { totalItems, totalPrice, items } = calculateTotals();

    // 1. Update Card Kuantitas
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

    // 2. Render Rincian Belanja
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

    // 3. Sticky Bottom Bar pada Layar HP
    if (totalItems > 0) {
      stickyMobileBar.classList.add('is-visible');
      stickyQtyDisplay.textContent = `${totalItems} Menu Dipilih`;
      stickyTotalDisplay.textContent = formatRupiah(totalPrice);
    } else {
      stickyMobileBar.classList.remove('is-visible');
    }

    // 4. Update Format Pesan Pratinjau
    const message = buildOrderText(totalPrice, items);
    messagePreview.textContent = message;

    // 5. Validasi Tombol WhatsApp
    const hasItems = items.length > 0;
    const hasName = state.customerName.trim().length > 0;

    let isCodValid = true;
    if (state.serviceMethod === 'cod') {
      isCodValid = state.codAddress.trim().length > 0 && state.codSlot.length > 0;
    }

    let isCashValid = true;
    if (state.paymentMethod === 'cash' && state.cashOption === 'Lainnya') {
      isCashValid = state.customCash.trim().length > 0 && Number(state.customCash) > 0;
    }

    const isValid = hasItems && hasName && isCodValid && isCashValid;

    btnSendWhatsapp.disabled = !isValid;

    if (!hasItems) {
      btnWhatsappText.textContent = 'Pilih Minimal 1 Menu Terlebih Dahulu';
    } else if (!hasName) {
      btnWhatsappText.textContent = 'Isi Nama Pemesan di Formulir';
    } else if (state.serviceMethod === 'cod' && !state.codAddress.trim()) {
      btnWhatsappText.textContent = 'Isi Alamat (Blok/No. Rumah) untuk COD';
    } else if (state.paymentMethod === 'cash' && state.cashOption === 'Lainnya' && !isCashValid) {
      btnWhatsappText.textContent = 'Isi Nominal Pecahan Uang';
    } else {
      btnWhatsappText.textContent = 'Pesan Sekarang via WhatsApp';
    }
  }

  // -------------------------------------------------------------
  // 6. EVENT HANDLERS
  // -------------------------------------------------------------

  // Input Nama
  customerNameInput.addEventListener('input', (e) => {
    state.customerName = e.target.value;
    updateUI();
  });

  // Metode Layanan
  serviceMethodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.serviceMethod = e.target.value;
      if (state.serviceMethod === 'cod') {
        codAddressGroup.classList.remove('is-hidden');
        codSlotGroup.classList.remove('is-hidden');
      } else {
        codAddressGroup.classList.add('is-hidden');
        codSlotGroup.classList.add('is-hidden');
      }
      updateUI();
    });
  });

  // Input Alamat COD
  codAddressInput.addEventListener('input', (e) => {
    state.codAddress = e.target.value;
    updateUI();
  });

  // Catatan
  orderNotesInput.addEventListener('input', (e) => {
    state.orderNotes = e.target.value;
    updateUI();
  });

  // Pilihan Pembayaran (Tunai vs QRIS statis)
  paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.paymentMethod = e.target.value;
      if (state.paymentMethod === 'cash') {
        cashDetailsBlock.classList.remove('is-hidden');
        qrisDetailsBlock.classList.add('is-hidden');
      } else {
        cashDetailsBlock.classList.add('is-hidden');
        qrisDetailsBlock.classList.remove('is-hidden');
      }
      updateUI();
    });
  });

  // Pilihan Pecahan Uang Tunai
  cashOptionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.cashOption = e.target.value;
      if (state.cashOption === 'Lainnya') {
        customCashGroup.classList.remove('is-hidden');
        customCashInput.focus();
      } else {
        customCashGroup.classList.add('is-hidden');
      }
      updateUI();
    });
  });

  // Input Manual Pecahan Lainnya
  customCashInput.addEventListener('input', (e) => {
    state.customCash = e.target.value;
    updateUI();
  });

  // Tombol Sticky Mobile
  btnStickyCheckout.addEventListener('click', () => {
    const formSection = document.getElementById('layanan-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
      customerNameInput.focus();
    }
  });

  // Tombol Kirim WhatsApp
  btnSendWhatsapp.addEventListener('click', () => {
    const { items, totalPrice } = calculateTotals();
    if (items.length === 0 || !state.customerName.trim()) return;
    if (state.serviceMethod === 'cod' && !state.codAddress.trim()) return;

    const message = buildOrderText(totalPrice, items);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(url, '_blank');
  });

  // Eksekusi Render Awal
  renderCodSlots();
  renderProducts();
  updateUI();

});
