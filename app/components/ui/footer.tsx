const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="text-center py-4 px-4 text-blue-300 text-sm">
      © {currentYear} CryptoBol
    </footer>
  )
}

export default Footer
