import './Footer.css';


export default function Footer() {


  const handleOnFacebook = () => {
    window.location.href = "https://www.facebook.com/"
  }


  const handleOnX = () => {
    window.location.href = "https://x.com/"
  }

  const handleOnInstagram = () => {
    window.location.href = "https://www.instagram.com/"
  }
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: contact@safeenvironment.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <a onClick={handleOnFacebook}>Facebook</a>
          <a onClick={handleOnX}>X</a>
          <a onClick={handleOnInstagram}>Instagram</a>
        </div>
      </div>
      <div className="copyright">
       2025 SafeEnvironment. All rights reserved.
      </div>
    </footer>
  );
}



