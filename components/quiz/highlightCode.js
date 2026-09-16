const KEYWORDS = new Set([
  "const", "let", "var", "function", "async", "await", "return", "import",
  "export", "from", "default", "if", "else", "new", "throw", "class",
  "extends", "try", "catch", "of", "in", "typeof", "null", "undefined",
  "true", "false",
]);

const TOKEN_REGEX =
  /(\/\/.*$)|('[^']*'|"[^"]*"|`[^`]*`)|\b([a-zA-Z_]\w*)\b(?=\s*\()|\b([a-zA-Z_]\w*)\b/gm;

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlightCode(code) {
  const escaped = escapeHtml(code);

  return escaped.replace(TOKEN_REGEX, (match, comment, string, fnName, word) => {
    if (comment) return `<span class="text-slate-500">${comment}</span>`;
    if (string) return `<span class="text-amber-300">${string}</span>`;
    if (fnName) return `<span class="text-emerald-300">${fnName}</span>`;
    if (word && KEYWORDS.has(word)) {
      return `<span class="text-sky-400">${word}</span>`;
    }
    return match;
  });
}
