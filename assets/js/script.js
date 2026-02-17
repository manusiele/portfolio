'use strict';

// ───────────────────────────────────────────────
// Anti-features (right-click / devtools block) — consider removing later for better UX
// ───────────────────────────────────────────────
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    if (e.buttons !== undefined && e.button === 2) {
        showNotification('Right-click is disabled on this page!');
    }
});

document.addEventListener('keydown', function(e) {
    if (
        e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J') ||
        e.key === 'F12' ||
        e.ctrlKey && e.key === 'U'
    ) {
        e.preventDefault();
        showNotification('Developer tools are disabled on this page!');
    }
});

let devToolsOpen = false;
const threshold = 160;
setInterval(() => {
    if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
    ) {
        if (!devToolsOpen) {
            devToolsOpen = true;
            showNotification('Developer tools detected! Please close them.');
        }
    } else {
        devToolsOpen = false;
    }
}, 1000);

// ───────────────────────────────────────────────
// Notification function
// ───────────────────────────────────────────────
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '-100px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.backgroundColor = '#3fc4ce86';
    notification.style.color = 'white';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    notification.style.transition = 'all 0.5s ease-in-out';
    notification.style.fontFamily = 'Arial, sans-serif';
    notification.style.fontSize = '14px';
    notification.style.maxWidth = '300px';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';

    const icon = document.createElement('span');
    icon.innerHTML = '&#x2705;';
    icon.style.marginRight = '10px';
    icon.style.fontSize = '18px';

    const text = document.createElement('span');
    text.textContent = message || 'Operation successful!';

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.marginLeft = '15px';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.opacity = '0.7';
    closeBtn.style.marginLeft = 'auto';

    closeBtn.addEventListener('mouseover', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseout', () => closeBtn.style.opacity = '0.7');
    closeBtn.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 500);
    });

    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    document.body.appendChild(notification);

    setTimeout(() => { notification.style.top = '20px'; }, 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// ───────────────────────────────────────────────
// Utility & Sidebar & Modal & Filter & Navigation
// ───────────────────────────────────────────────
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); };

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn.addEventListener("click", () => elementToggleFunc(sidebar));

const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
};

testimonialsItem.forEach(item => {
    item.addEventListener("click", () => {
        modalImg.src = item.querySelector("[data-testimonials-avatar]").src;
        modalImg.alt = item.querySelector("[data-testimonials-avatar]").alt;
        modalTitle.innerHTML = item.querySelector("[data-testimonials-title]").innerHTML;
        modalText.innerHTML = item.querySelector("[data-testimonials-text]").innerHTML;
        testimonialsModalFunc();
    });
});

modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
    filterItems.forEach(item => {
        if (selectedValue === "all" || selectedValue === item.dataset.category) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
};

select.addEventListener("click", () => elementToggleFunc(select));

selectItems.forEach(item => {
    item.addEventListener("click", () => {
        const selectedValue = item.innerText.toLowerCase();
        selectValue.innerText = item.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);
    });
});

let lastClickedBtn = filterBtn[0];
filterBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        const selectedValue = btn.innerText.toLowerCase();
        selectValue.innerText = btn.innerText;
        filterFunc(selectedValue);
        lastClickedBtn.classList.remove("active");
        btn.classList.add("active");
        lastClickedBtn = btn;
    });
});

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach(link => {
    link.addEventListener("click", () => {
        const targetPage = link.innerHTML.toLowerCase();
        pages.forEach((page, i) => {
            if (page.dataset.page === targetPage) {
                page.classList.add("active");
                navigationLinks[i].classList.add("active");
            } else {
                page.classList.remove("active");
                navigationLinks[i].classList.remove("active");
            }
        });
        window.scrollTo(0, 0);
    });
});

// ───────────────────────────────────────────────
// Contact Form → Telegram via Cloudflare Worker
// ───────────────────────────────────────────────
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const successMessage = document.getElementById("success-message");

let isSubmitting = false;

formInputs.forEach(input => {
    input.addEventListener("input", () => {
        formBtn.disabled = !form.checkValidity();
    });
});

form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (isSubmitting) return;

    // Honeypot spam protection (add <input name="honeypot" style="display:none;"> to HTML)
    const honeypot = this.honeypot?.value?.trim();
    if (honeypot) {
        successMessage.textContent = "Message sent successfully!";
        successMessage.style.color = "yellow";
        successMessage.style.display = "block";
        form.reset();
        setTimeout(() => successMessage.style.display = "none", 4000);
        isSubmitting = false;
        return;
    }

    isSubmitting = true;
    formBtn.disabled = true;
    formInputs.forEach(inp => inp.disabled = true);
    formBtn.querySelector("span").textContent = "Sending...";

    const fullname = this.fullname.value.trim();
    const email    = this.email.value.trim();
    const message  = this.message.value.trim();

    // Basic client-side validation
    if (!fullname || !email || !message || message.length < 5) {
        showNotification("Please fill all fields properly.");
        resetFormUI();
        return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    fetch('https://portfolio-telegram-proxy.manusiele254.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, message }),
        signal: controller.signal
    })
    .then(async response => {
        clearTimeout(timeoutId);
        console.log('Worker response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'No details');
            throw new Error(`Worker error ${response.status}: ${errorText}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonErr) {
            console.error('Invalid JSON from Worker:', jsonErr);
            throw new Error('Worker returned invalid response');
        }

        if (data.success) {
            successMessage.textContent = "Message sent successfully! I'll get back to you soon.";
            successMessage.style.color = "yellow";
            successMessage.style.display = "block";
            form.reset();
        } else {
            throw new Error(data.error || 'Unknown Worker response');
        }
    })
    .catch(err => {
        console.error('Fetch/Worker failed:', err);
        let msg = "Failed to send. Please try again.";
        if (err.name === 'AbortError') msg = "Request timed out – check connection.";
        if (err.message.includes('Worker error')) msg = err.message;
        successMessage.textContent = msg;
        successMessage.style.color = "#ff6b6b";
        successMessage.style.display = "block";
    })
    .finally(() => {
        clearTimeout(timeoutId);
        formBtn.querySelector("span").textContent = "Send Message";
        formBtn.disabled = !form.checkValidity();
        formInputs.forEach(inp => inp.disabled = false);
        setTimeout(() => {
            successMessage.style.display = "none";
            successMessage.textContent = "";
            isSubmitting = false;
        }, 8000);
    });

    function resetFormUI() {
        formBtn.querySelector("span").textContent = "Send Message";
        formBtn.disabled = !form.checkValidity();
        formInputs.forEach(inp => inp.disabled = false);
        isSubmitting = false;
    }
});