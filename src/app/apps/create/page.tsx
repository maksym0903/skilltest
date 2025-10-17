"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import AppsService from "@/services/apps";

export default function CreateAppPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  

  const handleTextFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "App name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare request data
      const requestData = {
        name: formData.name,
        description: formData.description,
        creation_type: 'create_new' as const,
        // repo_id will be added when adopting from existing repos
      };

      console.log("Creating app with data:", requestData);
      
      // Call the API to create the app
      const response = await AppsService.createApp(requestData);
      
      if (response.success) {
        // Show success message
        enqueueSnackbar("App created successfully!", { 
          variant: "success",
          autoHideDuration: 3000 
        });
        
        // Navigate back to apps page after a short delay
        setTimeout(() => {
          router.push("/apps");
        }, 1000);
      } else {
        throw new Error(response.message || "Failed to create app");
      }
      
    } catch (error) {
      console.error("Error creating app:", error);
      enqueueSnackbar("Failed to create app. Please try again.", { 
        variant: "error",
        autoHideDuration: 4000 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/apps"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          size="small"
        >
          Back to Apps
        </Button>
        <Typography variant="h4" fontWeight={700}>
          Create New App
        </Typography>
      </Stack>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="App Name"
                value={formData.name}
                onChange={handleTextFieldChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
                placeholder="Enter app name"
              />
              
              <TextField
                label="Description"
                value={formData.description}
                onChange={handleTextFieldChange("description")}
                multiline
                rows={3}
                fullWidth
                required
                error={!!errors.description}
                helperText={errors.description || "Describe your application"}
                placeholder="Describe your application"
              />
              

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
                <Button
                  component={Link}
                  href="/apps"
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || !formData.name.trim() || !formData.description.trim()}
                  sx={{ minWidth: 120 }}
                >
                  {isSubmitting ? "Creating..." : "Create App"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
