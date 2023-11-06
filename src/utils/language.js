export default function isES() {
  const storedValue = window.localStorage.getItem('settings')
  let language = 'es'
  if (storedValue !== null) {
    language = JSON.parse(storedValue).languageSetted || 'es'
  }
  return language === 'es'
}
