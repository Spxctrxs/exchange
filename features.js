const themeButton = document.getElementById('theme-button');
const copyButton = document.getElementById('copy-button');
const featureStatus = document.getElementById('feature-status');

function setTheme(theme, persist = false) {
    const isDark = theme === 'dark';
    document.body.dataset.theme = isDark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    themeButton.title = `Switch to ${isDark ? 'light' : 'dark'} mode`;
    themeButton.firstElementChild.textContent = isDark ? '☀' : '☾';

    if (persist) {
        try {
            localStorage.setItem('exchange-theme', isDark ? 'dark' : 'light');
        } catch (error) {
            console.error('Could not save the theme preference:', error);
            featureStatus.textContent = 'Your theme changed, but could not be saved for next time.';
        }
    }
}

try {
    const savedTheme = localStorage.getItem('exchange-theme');
    setTheme(savedTheme === 'dark' ? 'dark' : 'light');
} catch (error) {
    console.error('Could not load the saved theme preference:', error);
    setTheme('light');
}

themeButton.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, true);
});

function updateCopyButton() {
    copyButton.disabled = document.getElementById('to-amount').value === '';
}

for (const element of [
    document.getElementById('from-amount'),
    document.getElementById('to-amount'),
    document.getElementById('from-currency'),
    document.getElementById('to-currency')
]) {
    element.addEventListener('input', updateCopyButton);
    element.addEventListener('change', updateCopyButton);
}

copyButton.addEventListener('click', async () => {
    const amount = document.getElementById('to-amount').value;
    const currency = document.getElementById('to-currency').value;
    if (amount === '') {
        return;
    }

    try {
        await navigator.clipboard.writeText(`${amount} ${currency}`);
        featureStatus.textContent = `Copied ${amount} ${currency}.`;
    } catch (error) {
        console.error('Could not copy the converted amount:', error);
        featureStatus.textContent = 'Could not copy the amount. Check clipboard permissions and try again.';
    }
});

updateCopyButton();
