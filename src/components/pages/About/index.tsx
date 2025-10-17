"use client";
import { 
  Container, 
  Typography, 
  Box, 
  Paper
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import "./About.css";

export default function About() {
  const benefits = [
    "Seamless integration with your existing tools",
    "Scalable infrastructure that grows with you",
    "Intuitive interface designed for all skill levels",
    "Continuous updates and new features",
  ];

  return (
    <Box id="about" className="about-section">
      <Container maxWidth="lg" className="about-container">
        <div className="about-grid">
          <div className="about-content">
            <Typography variant="h2" className="about-title">
              Built for Modern Teams
            </Typography>
            <Typography variant="h6" color="text.secondary" className="about-subtitle">
              We have spent years perfecting our platform to deliver the best experience for teams 
              of all sizes. From startups to enterprises, our solution adapts to your needs.
            </Typography>
            <div className="about-benefits">
              {benefits.map((benefit, index) => (
                <div key={index} className="about-benefit-item">
                  <CheckCircle className="about-benefit-icon" />
                  <Typography variant="h6" className="about-benefit-text">
                    {benefit}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          <div className="about-stats">
            <div className="about-stats-container">
              <Paper elevation={0} className="about-stats-paper">
                <div className="about-stats-content">
                  <div className="about-stat-item">
                    <Typography variant="h2" className="about-stat-number">
                      10,000+
                    </Typography>
                    <Typography variant="h6" className="about-stat-label">
                      Happy Customers
                    </Typography>
                  </div>
                  
                  <div className="about-stat-item">
                    <Typography variant="h2" className="about-stat-number">
                      99.9%
                    </Typography>
                    <Typography variant="h6" className="about-stat-label">
                      Uptime Guarantee
                    </Typography>
                  </div>
                  
                  <div className="about-stat-item">
                    <Typography variant="h2" className="about-stat-number">
                      24/7
                    </Typography>
                    <Typography variant="h6" className="about-stat-label">
                      Expert Support
                    </Typography>
                  </div>
                </div>
              </Paper>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  );
}
