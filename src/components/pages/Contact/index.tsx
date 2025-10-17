"use client";
import { useState } from "react";
import { 
  Container, 
  Typography, 
  Stack, 
  TextField, 
  Button, 
  Card, 
  Box,
  InputLabel
} from "@mui/material";
import { 
  Email, 
  Send,
  Chat
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enqueueSnackbar("Message sent! We'll get back to you as soon as possible.", {
      variant: "success",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Box id="contact" className="contact-section">
      <Container maxWidth="lg" className="contact-container">
        <div className="contact-header">
          <Typography variant="h2" className="contact-title">
            Get in Touch
          </Typography>
          <Typography variant="h6" color="text.secondary" className="contact-subtitle">
            Have questions? We had love to hear from you. Send us a message and we will respond as soon as possible.
          </Typography>
        </div>

        <div className="contact-grid">
          <div className="contact-form-container">
            <Card className="contact-form-card">
              <Stack component="form" onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-field">
                  <InputLabel htmlFor="name" className="contact-form-label">
                    Name
                  </InputLabel>
                  <TextField
                    id="name"
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="contact-form-input"
                  />
                </div>
                
                <div className="contact-form-field">
                  <InputLabel htmlFor="email" className="contact-form-label">
                    Email
                  </InputLabel>
                  <TextField
                    id="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="contact-form-input"
                  />
                </div>
                
                <div className="contact-form-field">
                  <InputLabel htmlFor="message" className="contact-form-label">
                    Message
                  </InputLabel>
                  <TextField
                    id="message"
                    multiline
                    minRows={6}
                    fullWidth
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    required
                    className="contact-form-input"
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={<Send />}
                  className="contact-form-submit-button"
                >
                  Send Message
                </Button>
              </Stack>
            </Card>
          </div>

          <div className="contact-info-container">
            <div className="contact-info-stack">
              <Card className="contact-info-card">
                <div className="contact-info-row">
                  <div className="contact-info-icon-container">
                    <Email className="contact-info-icon" />
                  </div>
                  <div className="contact-info-content">
                    <Typography variant="h6" className="contact-info-title">
                      Email Us
                    </Typography>
                    <Typography className="contact-info-text">
                      hello@saasify.com
                    </Typography>
                    <Typography className="contact-info-text">
                      support@saasify.com
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="contact-info-card">
                <div className="contact-info-row">
                  <div className="contact-info-icon-container">
                    <Chat className="contact-info-icon" />
                  </div>
                  <div className="contact-info-content">
                    <Typography variant="h6" className="contact-info-title">
                      Live Chat
                    </Typography>
                    <Typography className="contact-chat-description">
                      Our support team is available 24/7 to help you with any questions.
                    </Typography>
                    <Button
                      variant="outlined"
                      className="contact-chat-button"
                    >
                      Start Chat
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="contact-cta-box">
                <Typography variant="h6" className="contact-cta-title">
                  Ready to get started?
                </Typography>
                <Typography className="contact-cta-description">
                  Join thousands of businesses already using our platform to transform their operations.
                </Typography>
                <Button
                  variant="contained"
                  className="contact-cta-button"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  );
}
