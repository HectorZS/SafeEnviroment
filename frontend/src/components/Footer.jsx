import './Footer.css';


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: contact@safeenvironment.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="#">About Us</a>
          <a href="#">FAQ</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>
      </div>
      <div className="copyright">
       2025 SafeEnvironment. All rights reserved.
      </div>
    </footer>
  );
}



