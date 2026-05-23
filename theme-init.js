/**
 * Keep in sync with src/theme/colorScheme.ts (migrateLegacyThemeStorage + initTheme).
 * Runs synchronously before React/CSS so the first paint follows prefers-color-scheme.
 */
;(function () {
  var THEME_STORAGE_KEY = 'portfolio-color-scheme-v2'
  try {
    var v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === 'light' || v === 'dark') {
      localStorage.removeItem(THEME_STORAGE_KEY)
    }
  } catch (_) {}
  document.documentElement.setAttribute('data-theme', 'system')
})()
