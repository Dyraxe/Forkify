export function getCurrentTime() {
  return String(
    new Intl.DateTimeFormat('pt-BR', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(Date.now())
  );
}
