import * as React from "react";
import Link from "next/link";
import {
  Box, Container, Stack, Typography, Button, IconButton
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import "./Hero.css";

export default function Hero() {
  const images = [
    '/hero-bg.jpg',
    '/ai.jpg',
    '/communication.jpg',
    '/digital.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const nextImage = React.useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevImage = React.useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // Auto-advance carousel every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <Box 
      id="hero" 
      component="section" 
      className="hero-section"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      {/* Navigation Arrows */}
      <IconButton
        onClick={prevImage}
        className="hero-nav-button hero-nav-button-left"
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={nextImage}
        className="hero-nav-button hero-nav-button-right"
      >
        <ChevronRight />
      </IconButton>

      <Container maxWidth="lg" className="hero-container">
        <Stack className="hero-content">
          <Typography variant="overline" className="hero-overline">
            Multi-tenant SaaS Starter
          </Typography>
          <Typography variant="h2" className="hero-title">
            Build a modern SaaS UI fast—<span className="hero-title-highlight">Next.js + MUI</span>
          </Typography>
          <Typography variant="h6" className="hero-subtitle">
            Accessible, responsive patterns. Hook up Cognito later—start shipping now.
          </Typography>
          <Stack className="hero-buttons">
            <Button variant="contained" size="large" component={Link} href="/dashboard">
              Enter Dashboard
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              href="#about"
              className="hero-button-outlined"
            >
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* Carousel Dots */}
      <Box className="hero-dots-container">
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`hero-dot ${index === currentImageIndex ? 'hero-dot-active' : 'hero-dot-inactive'}`}
          />
        ))}
      </Box>
    </Box>
  );
}
