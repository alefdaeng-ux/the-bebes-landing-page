/**
 * THE BEBES — PIZZA & BOLEN JUMBO
 * Mobile-First Storefront & Direct WhatsApp Ordering
 *
 * Aturan implementasi:
 * - Bebas dari simbol emoji (zero emojis).
 * - Tanpa backend, login, database, atau localStorage.
 * - Desain responsif mobile dengan tab filter kategori.
 */

// -------------------------------------------------------------
// 1. KONSTANTA UTAMA
// -------------------------------------------------------------
const WHATSAPP_NUMBER = '6285299999644';

// -------------------------------------------------------------
// 2. DATA PRODUK (PIZZA & BOLEN TERPISAH)
// -------------------------------------------------------------
const PIZZA_PRODUCTS = [
  {
    id: 'pizza-beef-patties',
    name: 'Pizza Beef Patties',
    category: 'Pizza Homemade',
    price: 35000,
    desc: 'Daging beef patties cincang tebal, saus spesial homemade, dan lelehan keju mozzarella gurih.',
    image: 'assets/pizza_beef_patties.jpg'
  },
  {
    id: 'pizza-sosis-mozarella',
    name: 'Pizza Sosis Mozarella',
    category: 'Pizza Homemade',
    price: 30000,
    desc: 'Potongan sosis sapi melimpah dengan lapisan keju mozzarella lumer dan saus tomat rempah segar.',
    image: 'assets/pizza_sosis_mozarella.jpg'
  },
  {
    id: 'pizza-smoked-beef',
    name: 'Pizza Smoked Beef Supreme',
    category: 'Pizza Homemade',
    price: 35000,
    desc: 'Daging asap pilihan berpadu jagung manis, sosis sapi, dan lelehan mozzarella panggang harum.',
    image: 'assets/pizza_smoked_beef.jpg'
  }
];

const BOLEN_PRODUCTS = [
  {
    id: 'bolen-cokelat',
    name: 'Bolen Pisang Cokelat',
    category: 'Bolen Jumbo',
    price: 16000,
    desc: 'Pisang raja manis legit berbalut pasta cokelat lumer dengan kulit pastry renyah berlapis.',
    image: 'assets/bolen_cokelat.jpg'
  },
  {
    id: 'bolen-keju',
    name: 'Bolen Pisang Keju',
    category: 'Bolen Jumbo',
    price: 16000,
    desc: 'Pisang raja manis dengan isian keju cheddar gurih dan aroma butter panggang harum.',
    image: 'assets/bolen_keju.jpg'
  },
  {
    id: 'bolen-cokelat-keju',
    name: 'Bolen Cokelat Keju Jumbo',
    category: 'Bolen Jumbo',
    price: 20000,
    desc: 'Kombinasi komplit pisang raja manis, cokelat lumer, dan keju cheddar melimpah ukuran jumbo spesial.',
    image: 'assets/bolen_cokelat_keju.jpg'
  }
];

const ALL_PRODUCTS = [...PIZZA_PRODUCTS, ...BOLEN_PRODUCTS];

// -------------------------------------------------------------
// 3. STATE APLIKASI
// -------------------------------------------------------------
const state = {
  cart: {},
  customerName: '',
  serviceMethod: 'pickup', // 'pickup' | 'cod'
  codAddress: '',
  codTime: '16.00 WITA',
  orderNotes: '',
  paymentMethod: 'cash',   // 'cash' | 'qris'
  cashOption: 'Uang pas',  // 'Uang pas' | 'Rp20.000' | 'Rp50.000' | 'Rp100.000' | 'Lainnya'
  customCash: '',
  activeFilter: 'all'      // 'all' | 'pizza' | 'bolen'
};

// Inisialisasi cart
ALL_PRODUCTS.forEach(p => {
  state.cart[p.id] = 0;
});

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

  // Elemen DOM
  const pizzaGrid = document.getElementById('pizzaGrid');
  const bolenGrid = document.getElementById('bolenGrid');
  const pizzaSection = document.getElementById('pizzaSection');
  const bolenSection = document.getElementById('bolenSection');
  const categoryPills = document.querySelectorAll('.category-pill');

  const summaryItemsBox = document.getElementById('summaryItemsBox');
  const cartItemCountBadge = document.getElementById('cartItemCountBadge');
  const totalPriceDisplay = document.getElementById('totalPriceDisplay');

  const customerNameInput = document.getElementById('customerName');
  const serviceMethodRadios = document.querySelectorAll('input[name="serviceMethod"]');
  const codFieldsContainer = document.getElementById('codFieldsContainer');
  const codAddressInput = document.getElementById('codAddress');
  const codTimeSelect = document.getElementById('codTimeSelect');

  const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const cashPecahanSection = document.getElementById('cashPecahanSection');
  const cashOptionRadios = document.querySelectorAll('input[name="cashOption"]');
  const customCashContainer = document.getElementById('customCashContainer');
  const customCashAmount = document.getElementById('customCashAmount');
  const qrisInfoBanner = document.getElementById('qrisInfoBanner');

  const orderNotesInput = document.getElementById('orderNotes');
  const btnDirectWhatsapp = document.getElementById('btnDirectWhatsapp');
  const btnDirectWhatsappLabel = document.getElementById('btnDirectWhatsappLabel');

  const mobileStickyBar = document.getElementById('mobileStickyBar');
  const stickyCountText = document.getElementById('stickyCountText');
  const stickyPriceText = document.getElementById('stickyPriceText');
  const btnStickyScroll = document.getElementById('btnStickyScroll');

  // Render Kartu Produk
  function renderProductCard(prod) {
    const qty = state.cart[prod.id] || 0;
    const isSelected = qty > 0;

    return `
      <article class="product-item-card ${isSelected ? 'is-active' : ''}" data-id="${prod.id}">
        <div class="product-media">
          <img src="${prod.image}" alt="${prod.name}" class="product-image" loading="lazy" onerror="this.style.display='none';">
          <span class="product-tag">${prod.category}</span>
        </div>
        <div class="product-content">
          <div class="product-heading-group">
            <h3 class="product-name">${prod.name}</h3>
            <p class="product-desc">${prod.desc}</p>
          </div>
          <div class="product-action-bar">
            <div class="price-box">
              <span class="price-text">${formatRupiah(prod.price)}</span>
            </div>
            <div class="quantity-stepper" aria-label="Jumlah ${prod.name}">
              <button type="button" class="stepper-btn btn-dec" data-id="${prod.id}" ${qty === 0 ? 'disabled' : ''} aria-label="Kurangi">
                <svg class="icon icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="stepper-count" id="count-${prod.id}">${qty}</span>
              <button type="button" class="stepper-btn btn-inc" data-id="${prod.id}" aria-label="Tambah">
                <svg class="icon icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderGrids() {
    pizzaGrid.innerHTML = PIZZA_PRODUCTS.map(renderProductCard).join('');
    bolenGrid.innerHTML = BOLEN_PRODUCTS.map(renderProductCard).join('');
    attachStepperEvents();
  }

  function attachStepperEvents() {
    document.querySelectorAll('.btn-inc').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        state.cart[id] = (state.cart[id] || 0) + 1;
        updateUI();
      });
    });

    document.querySelectorAll('.btn-dec').forEach(btn => {
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

    ALL_PRODUCTS.forEach(p => {
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

  // Generator Pesan WhatsApp (Langsung dikirim ke URL, tanpa raw preview box)
  function generateWhatsAppMessage(totalPrice, items) {
    const lines = [];
    lines.push('#ORDER-BEBES');
    lines.push(`Nama: ${state.customerName.trim()}`);

    if (state.serviceMethod === 'cod') {
      lines.push('Layanan: Antar COD FM2');
      lines.push(`Alamat: ${state.codAddress.trim()}`);
      lines.push(`Jam: ${state.codTime}`);
    } else {
      lines.push('Layanan: Ambil di gerai');
    }

    lines.push('Pesanan:');
    items.forEach(it => {
      lines.push(`- ${it.name} x${it.qty} = ${formatRupiah(it.subtotal)}`);
    });

    lines.push(`Total: ${formatRupiah(totalPrice)}`);

    if (state.paymentMethod === 'cash') {
      lines.push('Bayar: Tunai');
      let pecahan = state.cashOption;
      if (state.cashOption === 'Lainnya' && state.customCash.trim()) {
        pecahan = `${formatRupiah(state.customCash)}`;
      }
      lines.push(`Pecahan dibawa: ${pecahan}`);
    } else {
      lines.push('Bayar: QRIS statis');
    }

    if (state.orderNotes.trim()) {
      lines.push(`Catatan: ${state.orderNotes.trim()}`);
    }

    lines.push('Mohon konfirmasi stok & jam. Terima kasih.');

    return lines.join('\n');
  }

  // Update UI Keseluruhan
  function updateUI() {
    const { totalItems, totalPrice, items } = calculateTotals();

    // 1. Update Stepper & Kartu Produk
    ALL_PRODUCTS.forEach(p => {
      const qty = state.cart[p.id] || 0;
      const countEl = document.getElementById(`count-${p.id}`);
      if (countEl) countEl.textContent = qty;

      const cardEl = document.querySelector(`.product-item-card[data-id="${p.id}"]`);
      if (cardEl) {
        if (qty > 0) {
          cardEl.classList.add('is-active');
        } else {
          cardEl.classList.remove('is-active');
        }
        const decBtn = cardEl.querySelector('.btn-dec');
        if (decBtn) decBtn.disabled = qty === 0;
      }
    });

    // 2. Update Ringkasan Belanja
    cartItemCountBadge.textContent = `${totalItems} Menu`;
    totalPriceDisplay.textContent = formatRupiah(totalPrice);

    if (items.length === 0) {
      summaryItemsBox.innerHTML = '<p class="empty-cart-message">Pilih menu di atas dengan menekan tombol tambah (+) untuk mulai berbelanja.</p>';
    } else {
      summaryItemsBox.innerHTML = items.map(it => `
        <div class="summary-item-row">
          <span class="item-row-left"><strong>${it.qty}x</strong> ${it.name}</span>
          <span class="item-row-price">${formatRupiah(it.subtotal)}</span>
        </div>
      `).join('');
    }

    // 3. Mobile Sticky Bottom Bar
    if (totalItems > 0) {
      mobileStickyBar.classList.add('is-visible');
      stickyCountText.textContent = `${totalItems} Menu Dipilih`;
      stickyPriceText.textContent = formatRupiah(totalPrice);
    } else {
      mobileStickyBar.classList.remove('is-visible');
    }

    // 4. Validasi Tombol WhatsApp
    const hasItems = totalItems > 0;
    const hasName = state.customerName.trim().length > 0;

    let isCodValid = true;
    if (state.serviceMethod === 'cod') {
      isCodValid = state.codAddress.trim().length > 0;
    }

    let isCashValid = true;
    if (state.paymentMethod === 'cash' && state.cashOption === 'Lainnya') {
      isCashValid = state.customCash.trim().length > 0 && Number(state.customCash) > 0;
    }

    const isValid = hasItems && hasName && isCodValid && isCashValid;

    btnDirectWhatsapp.disabled = !isValid;

    if (!hasItems) {
      btnDirectWhatsappLabel.textContent = 'Pilih Minimal 1 Menu Terlebih Dahulu';
    } else if (!hasName) {
      btnDirectWhatsappLabel.textContent = 'Isi Nama Pemesan';
    } else if (state.serviceMethod === 'cod' && !state.codAddress.trim()) {
      btnDirectWhatsappLabel.textContent = 'Isi Alamat Rumah untuk Pengantaran COD';
    } else if (state.paymentMethod === 'cash' && state.cashOption === 'Lainnya' && !isCashValid) {
      btnDirectWhatsappLabel.textContent = 'Isi Nominal Pecahan Uang';
    } else {
      btnDirectWhatsappLabel.textContent = 'Pesan Sekarang via WhatsApp';
    }
  }

  // -------------------------------------------------------------
  // 6. EVENT HANDLERS
  // -------------------------------------------------------------

  // Category Filter Tab
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      state.activeFilter = filter;

      if (filter === 'all') {
        pizzaSection.classList.remove('is-hidden');
        bolenSection.classList.remove('is-hidden');
      } else if (filter === 'pizza') {
        pizzaSection.classList.remove('is-hidden');
        bolenSection.classList.add('is-hidden');
        pizzaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (filter === 'bolen') {
        pizzaSection.classList.add('is-hidden');
        bolenSection.classList.remove('is-hidden');
        bolenSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Nama Pemesan
  customerNameInput.addEventListener('input', (e) => {
    state.customerName = e.target.value;
    updateUI();
  });

  // Metode Layanan (Ambil vs COD)
  serviceMethodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.serviceMethod = e.target.value;
      if (state.serviceMethod === 'cod') {
        codFieldsContainer.classList.remove('is-hidden');
      } else {
        codFieldsContainer.classList.add('is-hidden');
      }
      updateUI();
    });
  });

  // Alamat COD
  codAddressInput.addEventListener('input', (e) => {
    state.codAddress = e.target.value;
    updateUI();
  });

  // Dropdown Jam COD (08.00 - 17.00 WITA)
  codTimeSelect.addEventListener('change', (e) => {
    state.codTime = e.target.value;
    updateUI();
  });

  // Pembayaran (Tunai vs QRIS)
  paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.paymentMethod = e.target.value;
      if (state.paymentMethod === 'cash') {
        cashPecahanSection.classList.remove('is-hidden');
        qrisInfoBanner.classList.add('is-hidden');
      } else {
        cashPecahanSection.classList.add('is-hidden');
        qrisInfoBanner.classList.remove('is-hidden');
      }
      updateUI();
    });
  });

  // Pecahan Tunai
  cashOptionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.cashOption = e.target.value;
      if (state.cashOption === 'Lainnya') {
        customCashContainer.classList.remove('is-hidden');
        customCashAmount.focus();
      } else {
        customCashContainer.classList.add('is-hidden');
      }
      updateUI();
    });
  });

  // Nominal Tunai Lainnya
  customCashAmount.addEventListener('input', (e) => {
    state.customCash = e.target.value;
    updateUI();
  });

  // Catatan Tambahan
  orderNotesInput.addEventListener('input', (e) => {
    state.orderNotes = e.target.value;
  });

  // Sticky Bar Scroll to Checkout Form
  btnStickyScroll.addEventListener('click', () => {
    const checkoutEl = document.getElementById('checkoutSection');
    if (checkoutEl) {
      checkoutEl.scrollIntoView({ behavior: 'smooth' });
      customerNameInput.focus();
    }
  });

  // Aksi Langsung Kirim WhatsApp
  btnDirectWhatsapp.addEventListener('click', () => {
    const { items, totalPrice } = calculateTotals();
    if (items.length === 0 || !state.customerName.trim()) return;
    if (state.serviceMethod === 'cod' && !state.codAddress.trim()) return;

    const message = generateWhatsAppMessage(totalPrice, items);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(url, '_blank');
  });

  // Render Pertama
  renderGrids();
  updateUI();

});
