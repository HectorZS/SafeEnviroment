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
          <h4>Follow Us</h4>
          <a href="https://www.facebook.com/" target="_blank">Facebook</a>
          <a href="https://x.com/" target='_blank'>X</a>
          <a href='https://www.instagram.com/' target='_blank'>Instagram</a>
        </div>
      </div>
      <div className="copyright">
       2025 SafeEnvironment. All rights reserved.
      </div>
    </footer>
  );
}



