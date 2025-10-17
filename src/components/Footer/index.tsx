"use client";

import { 
  Container, 
  Typography, 
  Box, 
  IconButton,
  Link,
  Divider
} from "@mui/material";
import { 
  Twitter, 
  GitHub, 
  LinkedIn 
} from "@mui/icons-material";
import "./Footer.css";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box component="footer" className="footer-section">
      <Container maxWidth="lg" className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand-column">
            <Box>
              <Typography variant="h4" className="footer-brand-title">
                MoA
              </Typography>
              <Typography className="footer-brand-description">
                Empowering businesses with cutting-edge SaaS solutions.
              </Typography>
              <div className="footer-social-buttons">
                <IconButton
                  size="small"
                  className="footer-social-button"
                >
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  className="footer-social-button"
                >
                  <GitHub fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  className="footer-social-button"
                >
                  <LinkedIn fontSize="small" />
                </IconButton>
              </div>
            </Box>
          </div>

          <div className="footer-column">
            <Box>
              <Typography variant="h6" className="footer-section-title">
                Product
              </Typography>
              <div className="footer-links">
                <Link
                  component="button"
                  onClick={() => scrollToSection("features")}
                  className="footer-link"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="footer-link"
                >
                  Pricing
                </Link>
                <Link
                  href="#"
                  className="footer-link"
                >
                  Security
                </Link>
              </div>
            </Box>
          </div>

          <div className="footer-column">
            <Box>
              <Typography variant="h6" className="footer-section-title">
                Company
              </Typography>
              <div className="footer-links">
                <Link
                  component="button"
                  onClick={() => scrollToSection("about")}
                  className="footer-link"
                >
                  About
                </Link>
                <Link
                  component="button"
                  onClick={() => scrollToSection("blog")}
                  className="footer-link"
                >
                  Blog
                </Link>
                <Link
                  href="#"
                  className="footer-link"
                >
                  Careers
                </Link>
              </div>
            </Box>
          </div>

          <div className="footer-column">
            <Box>
              <Typography variant="h6" className="footer-section-title">
                Support
              </Typography>
              <div className="footer-links">
                <Link
                  component="button"
                  onClick={() => scrollToSection("contact")}
                  className="footer-link"
                >
                  Contact
                </Link>
                <Link
                  href="#"
                  className="footer-link"
                >
                  Documentation
                </Link>
                <Link
                  href="#"
                  className="footer-link"
                >
                  Help Center
                </Link>
              </div>
            </Box>
          </div>
        </div>

        <Divider className="footer-divider" />

        <div className="footer-bottom">
          <Typography className="footer-copyright">
            © 2024 MoA. All rights reserved.
          </Typography>
          <div className="footer-legal-links">
            <Link
              href="#"
              className="footer-legal-link"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="footer-legal-link"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </Box>
  );
}
