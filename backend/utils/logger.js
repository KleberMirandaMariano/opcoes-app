// Logger estruturado com timestamps e níveis

const levels = {
  info: 'ℹ️ INFO',
  warn: '⚠️ WARN',
  error: '❌ ERROR',
  debug: '🔍 DEBUG'
};

function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const levelLabel = levels[level] || level.toUpperCase();
  let output = `[${timestamp}] ${levelLabel} ${message}`;

  if (data) {
    output += `\n${JSON.stringify(data, null, 2)}`;
  }

  console.log(output);
}

module.exports = {
  info: (msg, data) => log('info', msg, data),
  warn: (msg, data) => log('warn', msg, data),
  error: (msg, data) => log('error', msg, data),
  debug: (msg, data) => log('debug', msg, data)
};
