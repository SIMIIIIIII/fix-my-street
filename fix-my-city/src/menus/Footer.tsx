import '../static/nav_style.css'

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear().toString();
  
  return (
    <footer>
        <p>Copyright &copy;{year}</p>
        <a href='https://simeonlama.dev' target="_blank" rel="noopener noreferrer">About me</a>
    </footer>
  )
}

export default Footer