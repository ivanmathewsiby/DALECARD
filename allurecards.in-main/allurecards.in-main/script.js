document.addEventListener("DOMContentLoaded", () => {

    // 0. Custom Cursor Logic
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isMobile = window.innerWidth <= 768;

    if(!isMobile) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
        });

        const renderCursor = () => {
            // Smooth follow physics for the outer ring
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        // Add hover states to all targets dynamically
        const attachHoverTargets = () => {
            document.querySelectorAll('.hover-target, button, a').forEach(el => {
                if(el.dataset.hoverAttached) return;
                el.dataset.hoverAttached = true;
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        };
        attachHoverTargets();
    }

    // 1. Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 1200);
    });

    // 1.5 Sticky Navbar Glassmorphism
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 1.6 Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Data
    const whatsappNumber = "919526577999";
    const designCategories = ["Minimal", "Floral", "Heritage", "Modern"];

    const rawData = [
        { id: "DIGITAL 140", price: "Rs. 55", images: ["1141.gif"] },
        { id: "VELLUM 106", price: "Rs. 48", images: ["gree.gif"] },
        { id: "VELLUM 105", price: "Rs. 50", images: ["merrr.gif"] },
        { id: "VELLUM 104", price: "Rs. 48", images: ["vio.gif"] },
        { id: "VELLUM 103", price: "Rs. 45", images: ["GREY4.gif"] },
        { id: "VELLUM 102", price: "Rs. 47", images: ["blue3.gif"] },
        { id: "VELLUM 101", price: "Rs. 55", images: ["coffeee.gif"] },
        { id: "PASTEL 209", price: "Rs. 50", images: ["PI-3.gif"] },
        { id: "PASTEL 208", price: "Rs. 50", images: ["LI-2.gif"] },
        { id: "PASTEL 207", price: "Rs. 50", images: ["GR-2.gif"] },
        { id: "PASTEL 206", price: "Rs. 50", images: ["123.gif"] },
        { id: "PASTEL 205", price: "Rs. 50", images: ["CREA-3.gif"] },
        { id: "PASTEL 204", price: "Rs. 50", images: ["GREY-2.gif"] },
        { id: "PASTEL 203", price: "Rs. 50", images: ["PU-5.gif"] }
    ];

    const products = rawData.map(item => {
        const randomCat = designCategories[Math.floor(Math.random() * designCategories.length)];
        return { ...item, category: randomCat };
    });

    // DOM elements
    const productContainer = document.getElementById('product-container');
    const showMoreBtn = document.getElementById('show-more-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Modal elements
    const modal = document.getElementById('quick-view-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalImg = document.getElementById('modal-main-img');
    const thumbnailContainer = document.getElementById('modal-thumbnails');
    const modalTitle = document.getElementById('modal-title');
    const modalUnitPrice = document.getElementById('modal-unit-price');
    const modalCategoryLabel = document.getElementById('modal-category-label');
    const qtyInput = document.getElementById('modal-qty');
    const calcBaseTotal = document.getElementById('calc-base-total');
    const calcDiscountPct = document.getElementById('calc-discount-pct');
    const calcDiscountAmt = document.getElementById('calc-discount-amt');
    const calcFinalTotal = document.getElementById('calc-final-total');
    const whatsappBtn = document.getElementById('modal-whatsapp-btn');

    const ITEMS_PER_PAGE = 12;
    let currentFilter = 'All';
    let filteredProducts = [];
    let visibleCount = 0;

    // 3. 3D HTML Builder
    function createCardHTML(product) {
        const productJson = encodeURIComponent(JSON.stringify(product));
        return `
            <div class="card-3d-wrapper reveal hover-target">
                <div class="card-3d-inner">
                    <div class="card-glare"></div>
                    <div class="product-img-layer">
                        <img src="wedding_cards/${product.images[0]}" alt="${product.id}" loading="lazy" onerror="this.src='https://placehold.co/400x500/ffffff/c5a059?text=Design'">
                    </div>
                    <div class="product-info-layer">
                        <h4 class="product-id">${product.id}</h4>
                        <p class="product-price">${product.price}</p>
                    </div>
                </div>
                <div class="quick-view-overlay">
                    <button class="quick-view-btn hover-target" data-product="${productJson}">View Suite</button>
                </div>
            </div>
        `;
    }

    // 4. Initialize 3D Mouse Parallax
    function init3DTilt() {
        const cards = document.querySelectorAll('.card-3d-wrapper:not(.tilt-initialized)');
        cards.forEach(card => {
            card.classList.add('tilt-initialized');
            const inner = card.querySelector('.card-3d-inner');
            const glare = card.querySelector('.card-glare');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.7) 0%, transparent 60%)`;
            });
            
            card.addEventListener('mouseleave', () => {
                inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
                glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, transparent 70%)`;
            });
        });
    }

    function applyFilter(filterCat) {
        currentFilter = filterCat;
        filteredProducts = filterCat === 'All' ? products : products.filter(p => p.category === filterCat);
        visibleCount = Math.min(ITEMS_PER_PAGE, filteredProducts.length);
        productContainer.innerHTML = '';

        if (filteredProducts.length === 0) {
            productContainer.innerHTML = '<p class="no-products" style="grid-column:1/-1; text-align:center; color: var(--text-muted); font-weight:300; letter-spacing: 2px; padding: 60px;">No designs found in this exclusive collection.</p>';
        } else {
            const initialItems = filteredProducts.slice(0, visibleCount);
            productContainer.innerHTML = initialItems.map(product => createCardHTML(product)).join('');
            
            setTimeout(() => {
                const newCards = productContainer.querySelectorAll('.reveal:not(.active)');
                newCards.forEach(el => revealObserver.observe(el));
                init3DTilt();
                if(typeof attachHoverTargets !== 'undefined') attachHoverTargets();
            }, 50);
        }
        updateShowMoreButton();
    }

    function showMoreItems() {
        const nextCount = Math.min(visibleCount + ITEMS_PER_PAGE, filteredProducts.length);
        const newItems = filteredProducts.slice(visibleCount, nextCount);
        if (newItems.length > 0) {
            const cardsHTML = newItems.map(product => createCardHTML(product)).join('');
            productContainer.insertAdjacentHTML('beforeend', cardsHTML);

            setTimeout(() => {
                const newCards = productContainer.querySelectorAll('.reveal:not(.active)');
                newCards.forEach(el => revealObserver.observe(el));
                init3DTilt();
                if(typeof attachHoverTargets !== 'undefined') attachHoverTargets();
            }, 50);
        }
        visibleCount = nextCount;
        updateShowMoreButton();
    }

    function updateShowMoreButton() {
        showMoreBtn.style.display = (visibleCount < filteredProducts.length) ? 'inline-block' : 'none';
    }

    productContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-view-btn');
        if (!btn) return;
        const product = JSON.parse(decodeURIComponent(btn.getAttribute('data-product')));
        openProductModal(product);
    });

    let currentUnitPrice = 0;
    let currentProductName = "";
    let currentProductCategory = "";

    function openProductModal(product) {
        currentProductName = product.id;
        currentProductCategory = product.category;
        modalTitle.textContent = currentProductName;
        modalCategoryLabel.textContent = `Allure ${currentProductCategory} Collection`;
        modalUnitPrice.textContent = `${product.price} / unit`;

        modalImg.src = `wedding_cards/${product.images[0]}`;
        thumbnailContainer.innerHTML = '';

        if (product.images.length > 1) {
            product.images.forEach((imgSrc, index) => {
                const thumbDiv = document.createElement('div');
                thumbDiv.className = `thumb hover-target ${index === 0 ? 'active' : ''}`;
                thumbDiv.innerHTML = `<img src="wedding_cards/${imgSrc}" alt="Thumbnail ${index + 1}" onerror="this.src='https://placehold.co/70x70/ffffff/c5a059?text=Thumb'">`;

                thumbDiv.addEventListener('click', () => {
                    modalImg.style.transform = 'scale(0.95)';
                    modalImg.style.opacity = '0.5';
                    setTimeout(() => {
                        modalImg.src = `wedding_cards/${imgSrc}`;
                        modalImg.style.opacity = '1';
                        modalImg.style.transform = 'scale(1)';
                    }, 300);

                    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                    thumbDiv.classList.add('active');
                });

                thumbnailContainer.appendChild(thumbDiv);
            });
            if(typeof attachHoverTargets !== 'undefined') attachHoverTargets();
        }

        currentUnitPrice = parseInt(product.price.replace(/\D/g, ''));
        qtyInput.value = 100;
        calculateTotal();

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function calculateTotal() {
        let qty = parseInt(qtyInput.value);
        if (isNaN(qty) || qty < 100) qty = 100;

        const baseTotal = qty * currentUnitPrice;

        let discountPercent = 0;
        if (qty >= 600) discountPercent = 25;
        else if (qty >= 500) discountPercent = 20;
        else if (qty >= 400) discountPercent = 15;
        else if (qty >= 300) discountPercent = 10;
        else if (qty >= 200) discountPercent = 5;

        const discountAmount = Math.round(baseTotal * (discountPercent / 100));
        const finalTotal = baseTotal - discountAmount;

        calcBaseTotal.textContent = `Rs. ${baseTotal.toLocaleString()}`;
        calcDiscountPct.textContent = discountPercent;
        calcDiscountAmt.textContent = discountAmount.toLocaleString();
        calcFinalTotal.textContent = `Rs. ${finalTotal.toLocaleString()}`;

        const message = `Hello Impressions Atelier!\n\nI am inquiring about a bespoke invitation suite.\n\n` +
                        `*Design Series:* ${currentProductName} (${currentProductCategory} Collection)\n` +
                        `*Required Volume:* ${qty}\n` +
                        `*Estimated Investment:* Rs. ${finalTotal.toLocaleString()}\n\n` +
                        `Please assist me in proceeding with this order.`;
        whatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    qtyInput.addEventListener('input', calculateTotal);
    qtyInput.addEventListener('change', () => {
        if (parseInt(qtyInput.value) < 100) {
            qtyInput.value = 100;
            calculateTotal();
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            applyFilter(e.target.getAttribute('data-filter'));
        });
    });

    showMoreBtn.addEventListener('click', showMoreItems);

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }

    applyFilter('All');
});
