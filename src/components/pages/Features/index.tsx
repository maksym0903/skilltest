"use client";
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box
} from "@mui/material";
import { 
  FlashOn, 
  Security, 
  People, 
  BarChart, 
  AccessTime, 
  AutoAwesome 
} from "@mui/icons-material";
import "./Features.css";

const features = [
  {
    icon: FlashOn,
    title: "Lightning Fast",
    description: "Optimized performance ensures your team works at maximum efficiency with zero lag.",
  },
  {
    icon: Security,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with industry standards keep your data safe.",
  },
  {
    icon: People,
    title: "Team Collaboration",
    description: "Real-time collaboration tools that bring your team together, wherever they are.",
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Gain insights with powerful analytics and reporting tools to drive decisions.",
  },
  {
    icon: AccessTime,
    title: "24/7 Support",
    description: "Our dedicated support team is always available to help you succeed.",
  },
  {
    icon: AutoAwesome,
    title: "AI-Powered",
    description: "Leverage artificial intelligence to automate workflows and boost productivity.",
  },
];

export default function Features() {
  return (
    <Box id="features" className="features-section">
      <Container maxWidth="lg" className="features-container">
        <div className="features-header">
          <Typography variant="h2" className="features-title">
            Everything You Need to Succeed
          </Typography>
          <Typography variant="h6" color="text.secondary" className="features-subtitle">
            Powerful features designed to help your business grow faster and work smarter
          </Typography>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="features-card">
                <CardContent className="features-card-content">
                  <div className="features-card-stack">
                    <div className="features-icon-container">
                      <Icon className="features-icon" />
                    </div>
                    
                    <Typography variant="h5" className="features-card-title">
                      {feature.title}
                    </Typography>
                    
                    <Typography color="text.secondary" className="features-card-description">
                      {feature.description}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </Box>
  );
}
