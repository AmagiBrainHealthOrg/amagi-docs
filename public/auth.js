(function () {
  var KEY = 'amagi-auth-v1';
  var HASH = 'c08c0adcee9100877c1e6e90c1bd3dc3e3d2cdccb15fa20762973394ab497f69';

  try {
    if (localStorage.getItem(KEY) === HASH) return;
  } catch (e) { /* storage disabled — fall through and prompt */ }

  document.documentElement.style.visibility = 'hidden';

  function sha256Hex(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (buf) {
      return Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  function mount() {
    document.documentElement.style.visibility = '';

    var overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'amagi-auth-title');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:2147483647',
      'background:#FBF7F0', 'display:flex', 'align-items:center', 'justify-content:center',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif',
      'color:#0B1F3B'
    ].join(';');

    overlay.innerHTML =
      '<form style="background:#fff;border:1px solid #E7DFD1;border-radius:16px;padding:32px 32px 28px;' +
        'box-shadow:0 1px 2px rgba(11,31,59,.04),0 8px 32px rgba(11,31,59,.06);' +
        'width:min(360px,calc(100vw - 32px));">' +
        '<div style="display:inline-flex;align-items:center;gap:10px;font-size:13px;font-weight:600;' +
          'letter-spacing:.14em;text-transform:uppercase;color:#7A3E0B;margin-bottom:20px;">' +
          '<span style="width:22px;height:22px;border-radius:50%;' +
            'background:radial-gradient(circle at 30% 30%,#F4C48A 0%,#C87A2F 70%);' +
            'box-shadow:0 0 0 4px #F4E4D0;display:inline-block;"></span>' +
          '<span>Amagi</span>' +
        '</div>' +
        '<h1 id="amagi-auth-title" style="font-size:22px;letter-spacing:-.01em;font-weight:700;' +
          'margin:0 0 6px;color:#0B1F3B;">Sign in</h1>' +
        '<p style="font-size:14px;color:#3B4A5E;margin:0 0 18px;line-height:1.45;">' +
          'Enter the password to view the documentation.</p>' +
        '<input type="password" id="amagi-pw" autocomplete="current-password" ' +
          'style="width:100%;padding:10px 12px;border:1px solid #C9BFA9;border-radius:10px;' +
          'font-size:15px;background:#FBF7F0;color:#0B1F3B;outline:none;font-family:inherit;" />' +
        '<p id="amagi-err" role="alert" aria-live="polite" ' +
          'style="font-size:13px;color:#B4453F;margin:10px 0 0;min-height:18px;"></p>' +
        '<button type="submit" style="margin-top:14px;width:100%;padding:10px 14px;border:0;' +
          'border-radius:10px;background:#C87A2F;color:#fff;font-size:14px;font-weight:600;' +
          'cursor:pointer;letter-spacing:.02em;font-family:inherit;">Continue</button>' +
      '</form>';

    document.body.appendChild(overlay);

    var form = overlay.querySelector('form');
    var input = overlay.querySelector('#amagi-pw');
    var err = overlay.querySelector('#amagi-err');
    var btn = overlay.querySelector('button');
    input.focus();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      btn.disabled = true;
      sha256Hex(input.value).then(function (hex) {
        btn.disabled = false;
        if (hex === HASH) {
          try { localStorage.setItem(KEY, HASH); } catch (e) { /* ignore */ }
          overlay.remove();
        } else {
          err.textContent = 'That password is incorrect.';
          input.select();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
