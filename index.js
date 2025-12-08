/**
 * Receitable - Simple Receipt Generator
 * @version 2.2.0
 * @author Tetsuaki Baba and Rubens Braz
 */

const receiptApp = (function () {
    // ==========================================================================
    // 1. CONFIGURATION & STATE
    // ==========================================================================

    const config = {
        defaultColor: "#001c9a",
        defaultCurrency: "USD"
    };

    let state = {
        currency: config.defaultCurrency,
        lang: "en",
        dateFormat: "us",
        timeFormat: "24h"
    };

    let signaturePad = null;

    // ==========================================================================
    // 2. DATA CONSTANTS
    // ==========================================================================

    // Currencies
    const currencies = [
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
        { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
        { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
        { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
        { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
        { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
        { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
        { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
        { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
        { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
        { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
        { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'ZAR', symbol: 'R', name: 'South African Rand' }
    ];

    const translations = {
        en: {
            receipt_title: "RECEIPT",
            date_label: "Date:",
            time_label: "Time:",
            receipt_number_label: "Receipt #",
            received_from_title: "Received From",
            from_title: "Issuer / Merchant",
            notes_title: "Notes",
            col_description: "Payment For",
            total_label: "Amount",
            signature_title: "Signature",
            received_by_label: "Received By",
            sign_here: "Sign Here",
            btn_clear_sign: "Clear signature",
            btn_copy_link: "Copy Link",
            btn_link_copied: "Copied!",
            btn_download_pdf: "Download PDF",
            btn_clear: "Clear all inputs",
            confirm_clear: "Are you sure you want to clear all data? This action cannot be undone.",
            pdf_recreate_link: "Click here to recreate this receipt.",
            footer_privacy: "Data is saved locally in your browser. The author assumes no responsibility for any damage or loss caused by this system.",
            placeholders: {
                received_from_name: "Name",
                received_from_address: "Address",
                issuer_name: "Company",
                issuer_address: "Address",
                issuer_phone: "Phone",
                issuer_email: "Email",
                received_from_phone: "Phone",
                received_from_email: "Email",
                received_by: "Name",
                receipt_notes: "Additional notes...",
                item_desc: "Description of service..."
            }
        },
        pt: {
            receipt_title: "RECIBO",
            date_label: "Data:",
            time_label: "Hora:",
            receipt_number_label: "Recibo Nº",
            received_from_title: "Recebido De",
            from_title: "Emitente",
            notes_title: "Obs.",
            col_description: "Referente a",
            total_label: "Valor",
            signature_title: "Assinatura",
            received_by_label: "Recebido Por",
            sign_here: "Assine Aqui",
            btn_clear_sign: "Limpar assinatura",
            btn_copy_link: "Copiar Link",
            btn_link_copied: "Copiado!",
            btn_download_pdf: "Baixar PDF",
            btn_clear: "Limpar tudo",
            confirm_clear: "Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.",
            pdf_recreate_link: "Clique aqui para recriar essa fatura.",
            footer_privacy: "Os dados são salvos localmente no seu navegador. O autor não assume qualquer responsabilidade por danos ou perdas causados ​​por este sistema.",
            placeholders: {
                received_from_name: "Nome",
                received_from_address: "Endereço",
                issuer_name: "Nome",
                issuer_address: "Endereço",
                issuer_phone: "Telefone",
                issuer_email: "Email",
                received_from_phone: "Telefone",
                received_from_email: "Email",
                received_by: "Nome",
                receipt_notes: "Observações...",
                item_desc: "Descrição do serviço..."
            }
        },
        jp: {
            receipt_title: "領収書",
            date_label: "日付:",
            time_label: "時間:",
            receipt_number_label: "No.",
            received_from_title: "宛名",
            from_title: "発行者",
            notes_title: "備考",
            col_description: "但し書き",
            total_label: "金額",
            signature_title: "署名",
            received_by_label: "受領者",
            sign_here: "ここに署名",
            btn_clear_sign: "明確な署名",
            btn_copy_link: "リンク作成",
            btn_link_copied: "完了!",
            btn_download_pdf: "PDF保存",
            btn_clear: "すべて消去",
            confirm_clear: "すべてのデータを消去してもよろしいですか？この操作は取り消せません。",
            pdf_recreate_link: "この領収書を再発行するためのリンク。",
            footer_privacy: "データはブラウザ内にローカルに保存されます。このシステムによって生じたいかなる損害または損失についても、作者は一切責任を負いません。",
            placeholders: {
                received_from_name: "顧客名",
                received_from_address: "住所",
                issuer_name: "自社名",
                issuer_address: "自社住所",
                issuer_phone: "電話番号",
                issuer_email: "メール",
                received_from_phone: "電話番号",
                received_from_email: "メール",
                received_by: "担当者名",
                receipt_notes: "備考...",
                item_desc: "品目内容..."
            }
        }
    };

    // ==========================================================================
    // 3. INITIALIZATION
    // ==========================================================================

    /**
     * Initializes the application, sets up listeners, and loads data.
     */
    function init() {
        populateCurrencySelect();
        setupSignaturePad();
        setupEventListeners();
        
        // PRIORITY: Handle URL parameters first
        // If data is found in URL, we use it and SKIP LocalStorage to ensure the link is the source of truth
        const loadedFromUrl = handleUrlParameters();
        // FALLBACK: Only load from LocalStorage if no URL data was present
        if (!loadedFromUrl) {
            loadFromLocal();
        }

        // Sync UI Elements with State
        document.getElementById('languageSelect').value = state.lang;
        document.getElementById('currencySelect').value = state.currency;
        document.getElementById('dateFormatSelect').value = state.dateFormat;
        document.getElementById('timeFormatSelect').value = state.timeFormat;

        // Apply visual settings
        changeLanguage(state.lang);
        updateDateDisplay();
        updateTimeDisplay();

        // Ensure Receipt Number exists
        const recNumField = document.querySelector('#receipt_number');
        if (!recNumField.innerText.trim()) {
            recNumField.innerText = generateReceiptNumber();
        }

        // Start Auto-save loop (every 5 seconds)
        setInterval(() => {
            saveToLocal();
            updateLiveUrl();
        }, 5000);
    }

    /**
     * Init the signature pad.
     */
    function setupSignaturePad() {
        const canvas = document.querySelector('#signature-pad canvas');
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);

        signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(33, 37, 41)'
        });

        signaturePad.addEventListener("beginStroke", () => {
            document.querySelector('.signature-placeholder').style.display = 'none';
        });

        signaturePad.addEventListener("endStroke", () => {
            saveToLocal();
        });
    }

    /**
     * Clear the signature pad.
     */
    function clearSignature() {
        if (signaturePad) {
            signaturePad.clear();
            document.querySelector('.signature-placeholder').style.display = 'block';
            saveToLocal();
        }
    }

    /**
     * Populates the currency dropdown from the sorted array.
     */
    function populateCurrencySelect() {
        const select = document.getElementById('currencySelect');
        select.innerHTML = '';
        currencies.forEach(curr => {
            const option = document.createElement('option');
            option.value = curr.code;
            option.text = `${curr.code} (${curr.symbol})`;
            select.appendChild(option);
        });
    }

    /**
     * Sets up all DOM event listeners.
     */
    function setupEventListeners() {
        document.getElementById('colorPicker').addEventListener('input', (e) => changeColor(e.target.value));

        document.getElementById('languageSelect').addEventListener('change', (e) => changeLanguage(e.target.value));

        document.getElementById('currencySelect').addEventListener('change', (e) => {
            state.currency = e.target.value;
            updateCurrencySymbols();
        });

        document.getElementById('dateFormatSelect').addEventListener('change', (e) => {
            state.dateFormat = e.target.value;
            updateDateDisplay();
        });

        document.getElementById('timeFormatSelect').addEventListener('change', (e) => {
            state.timeFormat = e.target.value;
            updateTimeDisplay();
        });

        // Prevents pasting HTML formatting into editable fields
        document.querySelectorAll('[contenteditable]').forEach(el => {
            el.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = (e.originalEvent || e).clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            });
        });

        // Signature clear already handled in setupSignaturePad helpers or direct binding
        document.getElementById('btn_clear_sign').addEventListener('click', clearSignature);
    }

    // ==========================================================================
    // 4. CORE LOGIC (Dates, Format, Calc)
    // ==========================================================================

    /**
     * Updates the date INPUT value.
     * Note: Inputs type='date' always require YYYY-MM-DD value.
     * The visual format (DD/MM or MM/DD) is controlled by the user's browser locale
     * until we generate the PDF.
     */
    function updateDateDisplay() {
        const dateInput = document.getElementById('date');

        // If the input already has a value (user selected), don't overwrite it automatically unless it's empty (initial load)
        if (!dateInput.value) {
            const today = new Date();
            // Local date to YYYY-MM-DD
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            dateInput.value = `${year}-${month}-${day}`;
        }
    }

    /**
     * Updates the time INPUT value.
     */
    function updateTimeDisplay() {
        const timeInput = document.getElementById('time');
        if (!timeInput.value) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            timeInput.value = `${hours}:${mins}`;
        }
    }

    /**
     * Generates a random Receipt ID.
     * @returns {string} The formatted receipt number.
     */
    function generateReceiptNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `REC-${year}${month}${day}-${rand}`;
    }

    /**
     * Handles Language Switching and Placeholder updates.
     * @param {string} langCode - The language code (en, pt, jp).
     */
    function changeLanguage(langCode) {
        state.lang = langCode;
        if (!translations[langCode]) return;

        const t = translations[langCode];

        // Update static text elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerText = t[key];
        });

        const mapping = {
            'received_from_name': t.placeholders.received_from_name,
            'received_from_address': t.placeholders.received_from_address,
            'received_from_phone': t.placeholders.received_from_phone,
            'received_from_email': t.placeholders.received_from_email,
            'issuer_name': t.placeholders.issuer_name,
            'issuer_address': t.placeholders.issuer_address,
            'issuer_phone': t.placeholders.issuer_phone,
            'issuer_email': t.placeholders.issuer_email,
            'received_by': t.placeholders.received_by,
            'receipt_notes': t.placeholders.receipt_notes
        };

        for (const [id, text] of Object.entries(mapping)) {
            const el = document.getElementById(id);
            if (el) el.setAttribute('data-placeholder', text);
        }

        document.getElementById('payment_description').placeholder = t.placeholders.item_desc;
    }

    /**
     * Updates CSS variable for the theme color.
     * @param {string} color - Hex color code.
     */
    function changeColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
    }

    /**
     * Gets symbol for current state currency.
     * @returns {string} Currency symbol.
     */
    function getSymbol() {
        const curr = currencies.find(c => c.code === state.currency);
        return curr ? curr.symbol : '$';
    }

    // ==========================================================================
    // 5. PERSISTENCE (LocalStorage)
    // ==========================================================================

    /**
     * Saves current state to LocalStorage.
     */
    function saveToLocal() {
        const data = collectReceiptData();
        localStorage.setItem('receiptData', JSON.stringify(data));
    }

    /**
     * Loads state from LocalStorage.
     */
    function loadFromLocal() {
        const raw = localStorage.getItem('receiptData');
        if (raw) {
            try {
                const data = JSON.parse(raw);
                restoreData(data);
            } catch (e) {
                console.error("Failed to load local data", e);
            }
        }
    }

    /**
     * Generates the shareable URL based on current data.
     * @returns {string} Full URL with query parameters.
     */
    function generateShareUrl() {
        const data = collectReceiptData();
        const { signature_data, ...urlData } = data;

        // Convert to URL params
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(urlData)) {
            if (value) params.append(key, value);
        }

        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    }

    /**
     * Restores UI from a data object.
     * @param {object} data - The receipt data object.
     */
    function restoreData(data) {
        if (data.lang) state.lang = data.lang;
        if (data.currency) state.currency = data.currency;
        if (data.dateFormat) state.dateFormat = data.dateFormat;
        if (data.timeFormat) state.timeFormat = data.timeFormat;

        if (data.color) {
            document.getElementById('colorPicker').value = data.color;
            changeColor(data.color);
        }

        const setTxt = (id, val) => { if (val) document.getElementById(id).innerText = val; };
        const setVal = (id, val) => { if (val) document.getElementById(id).value = val; };

        // Restore text fields
        ['receipt_number', 'issuer_name', 'issuer_address', 'issuer_phone', 'issuer_email',
            'received_from_name', 'received_from_address', 'received_from_phone', 'received_from_email',
            'received_by', 'receipt_notes'].forEach(id => setTxt(id, data[id]));

        // Restore Items
        ['date', 'time', 'payment_description', 'payment_amount'].forEach(id => setVal(id, data[id]));

        if (data.signature_data && signaturePad) {
            signaturePad.fromDataURL(data.signature_data);
            if (data.signature_data) {
                document.querySelector('.signature-placeholder').style.display = 'none';
            }
        }
    }

    // ==========================================================================
    // 6. EXPORT & SHARE
    // ==========================================================================

    /**
     * Collects all current receipt data into an object.
     * @returns {object} Data object.
     */
    function collectReceiptData() {
        const getTxt = (id) => document.getElementById(id).innerText;
        const getVal = (id) => document.getElementById(id).value;

        return {
            receipt_number: getTxt('receipt_number'),
            date: getVal('date'),
            time: getVal('time'),
            issuer_name: getTxt('issuer_name'),
            issuer_address: getTxt('issuer_address'),
            issuer_phone: getTxt('issuer_phone'),
            issuer_email: getTxt('issuer_email'),
            received_from_name: getTxt('received_from_name'),
            received_from_address: getTxt('received_from_address'),
            received_from_phone: getTxt('received_from_phone'),
            received_from_email: getTxt('received_from_email'),
            payment_description: getVal('payment_description'),
            payment_amount: getVal('payment_amount'),
            received_by: getTxt('received_by'),
            receipt_notes: getTxt('receipt_notes'),
            signature_data: signaturePad ? signaturePad.toDataURL() : null,
            lang: state.lang,
            currency: state.currency,
            dateFormat: state.dateFormat,
            timeFormat: state.timeFormat,
            color: document.getElementById('colorPicker').value
        };
    }

    /**
     * Clears content fields but keeps configuration (Lang, Currency, etc).
     */
    function clearData() {
        const t = translations[state.lang] || translations['en'];
        
        if (confirm(t.confirm_clear)) {
            // 1. Clear all editable text fields (except Receipt Number, which we regen)
            document.querySelectorAll('.editable-field').forEach(el => {
                if (el.id !== 'receipt_number') {
                    el.innerText = '';
                }
            });

            // 2. Reset Receipt Number
            document.getElementById('receipt_number').innerText = generateReceiptNumber();

            // 3. Reset Dates to Today/Now
            document.getElementById('date').value = '';
            document.getElementById('time').value = '';
            updateDateDisplay();
            updateTimeDisplay();

            // 4. Clear URL parameters
            window.history.replaceState({}, '', window.location.pathname);

            // 5. Force Save to overwrite LocalStorage with the clean state
            // Note: This preserves 'state' (lang, currency, etc) because saveToLocal reads from the UI Selects which we didn't touch
            saveToLocal();
        }
    }

    /**
     * Copies the current state URL to clipboard.
     */
    function copyShareLink() {
        saveToLocal();
        const link = generateShareUrl();

        navigator.clipboard.writeText(link).then(() => {
            const btn = document.getElementById('btn_copy_link');
            const originalContent = btn.innerHTML;
            const t = translations[state.lang] || translations['en'];

            btn.classList.remove('btn-dark');
            btn.classList.add('btn-success');
            btn.innerHTML = `<i class="bi bi-check-lg"></i> ${t.btn_link_copied}`;
            document.getElementById('share_link').value = link;

            setTimeout(() => {
                btn.classList.remove('btn-success');
                btn.classList.add('btn-dark');
                btn.innerHTML = originalContent;
            }, 2000);
        });
    }

    /**
     * Parses URL parameters on load.
     * @returns {boolean} True if data was loaded from URL, False otherwise.
     */
    function handleUrlParameters() {
        const params = new URLSearchParams(window.location.search);
        
        // We consider it "loaded from URL" if there is at least an receipt number or items
        if (!params.has('receipt_number') && !params.has('payment_description')) return false;

        const data = {};
        for (const [key, value] of params.entries()) {
            data[key] = value;
        }

        restoreData(data);
        return true;
    }

    /**
     * Generates and downloads the PDF using html2pdf.js.
     */
    function downloadPDF() {
        const element = document.getElementById('pdf_element');
        const receiptNum = document.getElementById('receipt_number').innerText || 'receipt';

        // Clone DOM to clean up for print without affecting UI
        const clone = element.cloneNode(true);
        clone.classList.add('pdf-clean-mode');

        // Inject the current share URL into the footer link
        const currentUrl = generateShareUrl();
        const linkElement = clone.querySelector('#pdf_recreate_link');
        if (linkElement) linkElement.href = currentUrl;

        // Cleanup: Remove UI-only elements
        clone.querySelectorAll('.no-print').forEach(el => el.remove());

        // Force Notes Wrapping
        const notesField = clone.querySelector('#receipt_notes');
        if (notesField) {
            notesField.style.whiteSpace = "pre-wrap"; 
            notesField.style.wordBreak = "break-word";
            notesField.style.overflowWrap = "break-word";
            notesField.style.width = "100%";
            notesField.style.display = "block";
        }

        // Signature Handling (Canvas -> Image)
        const originalCanvas = document.querySelector('#signature-pad canvas');
        const cloneWrapper = clone.querySelector('.signature-wrapper');
        
        // We check if we have the original canvas, the wrapper in the clone, and if a signature has been made
        if (originalCanvas && cloneWrapper && signaturePad && !signaturePad.isEmpty()) {
            // Converts the original signature into a Base64 image
            const imgData = originalCanvas.toDataURL('image/png');
            
            // Create an image element.
            const img = document.createElement('img');
            img.src = imgData;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain'; // Ensures the signature doesn't get distorted
            
            // Clear the cloned wrapper (remove the empty canvas and the placeholder)
            cloneWrapper.innerHTML = ''; 
            
            // Insert the image
            cloneWrapper.appendChild(img);
        } else {
            // If there is no signature, we can leave it blank
            if (cloneWrapper) {
                 cloneWrapper.innerHTML = '';
                 cloneWrapper.style.height = '50px';
            }
        }

        // Cleanup: Remove empty Contact Lines (Phone/Email)
        clone.querySelectorAll('.contact-line').forEach(line => {
            const field = line.querySelector('.editable-field');
            if (field && !field.innerText.trim()) {
                line.remove();
            }
        });

        // Cleanup: Remove empty Addresses
        ['issuer_address', 'received_from_address'].forEach(id => {
            const field = clone.querySelector(`#${id}`);
            if (field && !field.innerText.trim()) {
                const parent = field.closest('.d-flex');
                if (parent) parent.remove();
            }
        });

        // Remove contenteditable to fix cursor issues
        clone.querySelectorAll('[contenteditable]').forEach(el => {
            el.removeAttribute('contenteditable');
        });

        // Handle Inputs: Convert to Text spans
        clone.querySelectorAll('input').forEach(input => {
            if ((input.type === 'date' || input.type === 'time') && !input.value) {
                const wrapper = input.closest('.d-flex');
                if (wrapper) wrapper.remove();
                return;
            }

            const span = document.createElement('span');
            span.className = input.className;
            span.style.border = "none";
            span.style.padding = "0";
            span.style.backgroundColor = "transparent";
            span.classList.remove('form-control');

            // Date Formatting
            if (input.type === 'date') {
                const rawDate = input.value;
                let formattedDate = rawDate;
                if (rawDate) {
                    const [y, m, d] = rawDate.split('-');
                    if (state.dateFormat === 'jp') formattedDate = `${y}-${m}-${d}`;
                    else if (state.dateFormat === 'us') formattedDate = `${m}/${d}/${y}`;
                    else if (state.dateFormat === 'br') formattedDate = `${d}/${m}/${y}`;
                }
                span.innerText = formattedDate;
                span.style.textAlign = "right";
            }
            // Time Formatting
            else if (input.type === 'time') {
                const rawTime = input.value;
                let formattedTime = rawTime;
                if (rawTime && state.timeFormat === '12h') {
                    const [h, m] = rawTime.split(':');
                    const hours = parseInt(h);
                    const suffix = hours >= 12 ? 'PM' : 'AM';
                    const h12 = hours % 12 || 12;
                    formattedTime = `${h12}:${m} ${suffix}`;
                }
                span.innerText = formattedTime;
                span.style.textAlign = "right";
            }
            // Standard Inputs
            else {
                span.innerText = input.value;
                span.style.textAlign = input.style.textAlign || "center";
                if (input.classList.contains('item-description')) span.style.textAlign = "left";
            }

            if (input.parentNode) input.parentNode.replaceChild(span, input);
        });

        // Styling Overrides for PDF
        clone.style.backgroundColor = "#ffffff";
        clone.style.padding = "20px";

        // Append clone to body so html2canvas can parse computed styles
        document.body.appendChild(clone);

        // Configuration
        const opt = {
            margin: [5, 5, 5, 5],
            filename: `receipt_${receiptNum}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf()
            .set(opt)
            .from(clone)
            .save()
            .then(() => {
                document.body.removeChild(clone);
            })
            .catch((err) => {
                console.error('PDF Generation Error:', err);
                // Ensure cleanup happens even on error
                if (document.body.contains(clone)) {
                    document.body.removeChild(clone);
                }
            });
    }

    // Public API
    return { init, clearData, copyShareLink, downloadPDF };
})();

// Start App
window.addEventListener('DOMContentLoaded', receiptApp.init);