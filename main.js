/* ==========================================================================
   نظام إدارة خدمات الطباعة والتصوير - الملف المتكامل والمميز (main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. حاسبة الأسعار التلقائية والتفاعلية (new-order.html)
       ---------------------------------------------------------------------- */
    const newOrderForm = document.querySelector('form[action="track-orders.html"]');
    if (newOrderForm) {
        // إنشاء ملخص التكلفة بتصميم أنيق ومباشر
        const costSummary = document.createElement('div');
        costSummary.className = 'cost-summary-card';
        costSummary.style.cssText = `
            background-color: #f8f9fa;
            border: 2px dashed #2A363B;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 1.1em;
            color: #2A363B;
        `;
        costSummary.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span><strong>💰 التكلفة الإجمالية التقديرية:</strong></span>
                <span style="font-size: 1.3em; color: #e84a5f; font-weight: bold;"><span id="total-price">0</span> جنيه سوداني</span>
            </div>
            <small style="color: #666; display: block; margin-top: 5px;">* يتم التحديث تلقائياً بناءً على نوع الخدمة والخيارات والكمية.</small>
        `;

        const submitBtn = newOrderForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            newOrderForm.insertBefore(costSummary, submitBtn);
        }

        const serviceSelect = document.getElementById('service');
        const colorSelect = document.getElementById('color');
        const quantityInput = document.getElementById('quantity');

        function calculateCost() {
            const service = serviceSelect ? serviceSelect.value : '';
            const color = colorSelect ? colorSelect.value : '';
            const qty = parseInt(quantityInput ? quantityInput.value : 0) || 0;
            
            let unitPrice = 0;

            if (service === 'printing') {
                unitPrice = (color === 'color') ? 500 : 100;
            } else if (service === 'copying') {
                unitPrice = (color === 'color') ? 400 : 80;
            } else if (service === 'binding') {
                unitPrice = 2000;
            } else if (service === 'scanning') {
                unitPrice = 150;
            } else if (service === 'formatting') {
                unitPrice = 5000;
            }

            const total = unitPrice * qty;
            const priceSpan = document.getElementById('total-price');
            if (priceSpan) {
                priceSpan.textContent = total.toLocaleString('ar-SD');
            }
        }

        if (serviceSelect) serviceSelect.addEventListener('change', calculateCost);
        if (colorSelect) colorSelect.addEventListener('change', calculateCost);
        if (quantityInput) quantityInput.addEventListener('input', calculateCost);
    }

    /* ----------------------------------------------------------------------
       2. الإشعارات التفاعلية وتأكيد الأزرار (Toast Notifications & Alerts)
       ---------------------------------------------------------------------- */
    // إشعار تغيير حالة الطلب في لوحة الإدارة (admin.html)
    const adminSelects = document.querySelectorAll('main section select[name^="status"]');
    adminSelects.forEach(select => {
        select.addEventListener('change', function() {
            const row = this.closest('tr');
            const orderId = row ? row.cells[0].textContent : '';
            const newStatus = this.value;

            if (row && row.cells[3]) {
                row.cells[3].textContent = newStatus;
                row.cells[3].style.color = '#e84a5f';
                row.cells[3].style.fontWeight = 'bold';
            }

            showToast(`تم تغيير حالة الطلب ${orderId} إلى "${newStatus}" بنجاح!`);
        });
    });

    // التحقق من تطابق كلمات المرور وإظهار إشعار عند الخطأ (register.html)
    const registerForm = document.querySelector('form[action="login.html"]');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            const password = document.getElementById('newpassword');
            const confirm = document.getElementById('confirm');
            
            if (password && confirm && password.value !== confirm.value) {
                e.preventDefault();
                showToast('عذراً، كلمة المرور وتأكيد كلمة المرور غير متطابقين!', 'error');
                confirm.focus();
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. الإخفاء والإظهار التفاعلي للحقول حسب الاختيار (Dynamic Field Toggling)
       ---------------------------------------------------------------------- */
    if (newOrderForm) {
        const serviceSelect = document.getElementById('service');
        const colorSelect = document.getElementById('color');
        const sidesSelect = document.getElementById('sides');

        function toggleFields() {
            const service = serviceSelect ? serviceSelect.value : '';
            const isPrintOrCopy = (service === 'printing' || service === 'copying');
            
            if (colorSelect) {
                const label = colorSelect.previousElementSibling;
                if (label) label.style.display = isPrintOrCopy ? 'inline' : 'none';
                colorSelect.style.display = isPrintOrCopy ? 'inline-block' : 'none';
            }

            if (sidesSelect) {
                const label = sidesSelect.previousElementSibling;
                if (label) label.style.display = isPrintOrCopy ? 'inline' : 'none';
                sidesSelect.style.display = isPrintOrCopy ? 'inline-block' : 'none';
            }
        }

        if (serviceSelect) {
            serviceSelect.addEventListener('change', toggleFields);
            toggleFields();
        }
    }

    /* ----------------------------------------------------------------------
       4. تمييز رابط الصفحة الحالية في شريط القائمة تلقائياً
       ---------------------------------------------------------------------- */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.style.fontWeight = 'bold';
            link.style.textDecoration = 'underline';
            link.style.color = '#e84a5f';
        }
    });

    /* ----------------------------------------------------------------------
       محرك الإشعارات المنزلقة (Toast Engine)
       ---------------------------------------------------------------------- */
    function showToast(message, type = 'info') {
        let toast = document.createElement('div');
        toast.textContent = message;
        
        const bgColor = type === 'error' ? '#d32f2f' : '#2A363B';
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: ${bgColor};
            color: #fff;
            padding: 12px 24px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 0.95em;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

});
