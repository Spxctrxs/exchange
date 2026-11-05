# Exchange

A lightweight, responsive currency converter built with plain HTML, CSS, and JavaScript. Check indicative exchange rates, convert between currencies, and copy a result without installing dependencies.

## Features

- Converts in either direction as you type.
- Shows the current rate for the selected currency pair and lets you swap currencies.
- Loads supported currencies and indicative rates from [ExchangeRate-API](https://www.exchangerate-api.com/).
- Copies the converted amount and currency to the clipboard.
- Offers a dark theme and remembers your preference in the browser.
- Adapts to small screens and respects reduced-motion preferences.

## Run locally

The project has no build step or package dependencies. Open `exchanger.html` in a modern browser, or serve this folder with a local static web server:

```powershell
python -m http.server 8000
```

Then visit <http://localhost:8000/exchanger.html>.

An internet connection is needed to retrieve live rates. If the rate service is unavailable, the converter displays a status message and uses its built-in USD/KES fallback rates. Rates are indicative, not a quote or guarantee; check with your provider before making a transfer.

Clipboard access depends on browser permissions and may require a secure context, such as HTTPS or localhost.

## Project files

- `exchanger.html` — converter page and controls.
- `script.js` — exchange-rate loading, currency selection, and conversion behavior.
- `features.js` — saved theme and copy-to-clipboard behavior.
- `style.css` — layout, responsive styling, and light/dark themes.

## License

No license has been specified for this project.
