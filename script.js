const fromAmount = document.getElementById('from-amount');
const toAmount = document.getElementById('to-amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const rateText = document.getElementById('rate-text');
const statusText = document.getElementById('status-text');
const swapButton = document.getElementById('swap-button');
const introScreen = document.querySelector('.intro-screen');
const introBrand = document.querySelector('.intro-brand');
const headerBrand = document.querySelector('.page-header .brand');

let rates = { USD: 1, KES: 129.5 };
let lastEdited = 'from';

function finishIntro() {
    window.setTimeout(() => {
        const target = headerBrand.getBoundingClientRect();
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const duration = reducedMotion ? 1 : 650;
        const logoAnimation = introBrand.animate(
            [
                { left: '50%', top: '50%' },
                {
                    left: `${target.left + target.width / 2}px`,
                    top: `${target.top + target.height / 2}px`
                }
            ],
            { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
        );
        const screenAnimation = introScreen.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration, easing: 'ease-out', fill: 'forwards' }
        );

        window.setTimeout(() => {
            logoAnimation.finish();
            screenAnimation.finish();
            document.body.classList.remove('is-loading');
            document.body.classList.add('is-ready');
            introScreen.remove();
        }, duration + 50);
    }, 5000);
}

function getPairRate() {
    const fromRate = rates[fromCurrency.value];
    const toRate = rates[toCurrency.value];
    if (!Number.isFinite(fromRate) || !Number.isFinite(toRate) || fromRate <= 0) {
        return null;
    }
    return toRate / fromRate;
}

function updateRateText() {
    const pairRate = getPairRate();
    if (pairRate === null) {
        rateText.textContent = 'Rate unavailable';
        return;
    }
    const digits = pairRate < 0.01 ? 6 : 4;
    rateText.textContent = `1 ${fromCurrency.value} = ${pairRate.toFixed(digits)} ${toCurrency.value}`;
}

function updateConversion(source) {
    lastEdited = source;
    const pairRate = getPairRate();
    const input = source === 'from' ? fromAmount : toAmount;
    const output = source === 'from' ? toAmount : fromAmount;

    updateRateText();
    if (input.value === '' || pairRate === null) {
        output.value = '';
        return;
    }

    const amount = Number(input.value);
    if (!Number.isFinite(amount) || amount < 0) {
        output.value = '';
        return;
    }

    output.value = (source === 'from' ? amount * pairRate : amount / pairRate).toFixed(2);
}

function refreshConversion() {
    updateConversion(lastEdited);
}

function populateCurrencyOptions(availableRates) {
    const currencies = Object.keys(availableRates).sort();
    for (const select of [fromCurrency, toCurrency]) {
        const selectedCurrency = select.value;
        const options = document.createDocumentFragment();

        for (const currency of currencies) {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            options.append(option);
        }

        select.replaceChildren(options);
        select.value = currencies.includes(selectedCurrency) ? selectedCurrency : 'USD';
    }
}

fromAmount.addEventListener('input', () => updateConversion('from'));
toAmount.addEventListener('input', () => updateConversion('to'));
fromCurrency.addEventListener('change', refreshConversion);
toCurrency.addEventListener('change', refreshConversion);

swapButton.addEventListener('click', () => {
    const oldFromCurrency = fromCurrency.value;
    const oldToCurrency = toCurrency.value;
    const oldFromAmount = fromAmount.value;
    const oldToAmount = toAmount.value;

    fromCurrency.value = oldToCurrency;
    toCurrency.value = oldFromCurrency;
    fromAmount.value = oldToAmount;
    toAmount.value = oldFromAmount;
    lastEdited = 'from';
    refreshConversion();
});

async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) {
            throw new Error(`Exchange-rate request failed: ${response.status}`);
        }

        const data = await response.json();
        if (!data.rates || typeof data.rates !== 'object') {
            throw new Error('The exchange-rate response did not contain valid rates.');
        }

        rates = Object.fromEntries(
            Object.entries(data.rates).filter(([currency, rate]) =>
                /^[A-Z]{3}$/.test(currency) && Number.isFinite(rate) && rate > 0
            )
        );
        rates.USD = 1;
        if (!rates.KES) {
            throw new Error('The exchange-rate response did not include KES.');
        }
        populateCurrencyOptions(rates);
        statusText.textContent = 'Rates shown are indicative.';
        refreshConversion();
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        statusText.textContent = 'Live rates could not load. Some currencies may be unavailable.';
        refreshConversion();
    }
}

updateRateText();
fetchExchangeRates();
finishIntro();
