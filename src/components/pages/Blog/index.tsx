"use client";
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Chip
} from "@mui/material";
import { CalendarToday, ArrowForward } from "@mui/icons-material";
import "./Blog.css";

const blogPosts = [
  {
    title: "10 Ways to Boost Team Productivity",
    excerpt: "Discover proven strategies to help your team work smarter and achieve more in less time.",
    date: "March 15, 2024",
    category: "Productivity",
  },
  {
    title: "The Future of SaaS: Trends to Watch",
    excerpt: "Explore the emerging technologies and trends shaping the future of software as a service.",
    date: "March 10, 2024",
    category: "Industry Insights",
  },
  {
    title: "Security Best Practices for Cloud Apps",
    excerpt: "Learn essential security measures every business should implement to protect their data.",
    date: "March 5, 2024",
    category: "Security",
  },
];

export default function Blog() {
  return (
    <Box id="blog" className="blog-section">
      <Container maxWidth="lg" className="blog-container">
        <div className="blog-header">
          <Typography variant="h2" className="blog-title">
            Latest Insights
          </Typography>
          <Typography variant="h6" color="text.secondary" className="blog-subtitle">
            Stay updated with the latest trends, tips, and best practices
          </Typography>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <Card key={index} className="blog-card">
              <div className="blog-card-image" />
              <CardContent className="blog-card-content">
                <div className="blog-card-stack">
                  <div className="blog-date-container">
                    <CalendarToday className="blog-date-icon" />
                    <Typography variant="body2" className="blog-date-text">
                      {post.date}
                    </Typography>
                  </div>
                  
                  <Chip
                    label={post.category}
                    size="small"
                    className="blog-category-chip"
                  />
                  
                  <Typography variant="h6" className="blog-card-title">
                    {post.title}
                  </Typography>
                  
                  <Typography className="blog-card-excerpt">
                    {post.excerpt}
                  </Typography>
                  
                  <Button
                    variant="text"
                    endIcon={<ArrowForward className="blog-read-more-icon" />}
                    className="blog-read-more-button"
                  >
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="blog-view-all-container">
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            className="blog-view-all-button"
          >
            View All Articles
          </Button>
        </div>
      </Container>
    </Box>
  );
}
