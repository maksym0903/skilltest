"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
} from "@mui/icons-material";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [profile, setProfile] = React.useState({
    name: "Gevorg Mkrtchyan",
    email: "@tymon1024",
    phone: "+1 646 270 4728",
    location: "Armenia",
    jobTitle: "project manager",
    department: "Engineering",
    joinDate: "January 15, 2023",
    bio: "Experienced full-stack developer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.",
    skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "Kubernetes"],
  });

  const [editProfile, setEditProfile] = React.useState(profile);

  const handleEdit = () => {
    setEditProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: "3rem",
                }}
              >
                {profile.name.split(" ").map(n => n[0]).join("")}
              </Avatar>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {isEditing ? editProfile.name : profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {isEditing ? editProfile.jobTitle : profile.jobTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {isEditing ? editProfile.department : profile.department}
              </Typography>
              <Chip
                label={`Joined ${isEditing ? editProfile.joinDate : profile.joinDate}`}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Personal Information
                </Typography>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Stack>

              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <PersonIcon color="action" />
                      <Typography variant="body2" fontWeight={600}>Full Name</Typography>
                    </Stack>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editProfile.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    ) : (
                      <Typography variant="body1">{profile.name}</Typography>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <EmailIcon color="action" />
                      <Typography variant="body2" fontWeight={600}>Email</Typography>
                    </Stack>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editProfile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    ) : (
                      <Typography variant="body1">{profile.email}</Typography>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <PhoneIcon color="action" />
                      <Typography variant="body2" fontWeight={600}>Phone</Typography>
                    </Stack>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editProfile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    ) : (
                      <Typography variant="body1">{profile.phone}</Typography>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <LocationIcon color="action" />
                      <Typography variant="body2" fontWeight={600}>Location</Typography>
                    </Stack>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editProfile.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                      />
                    ) : (
                      <Typography variant="body1">{profile.location}</Typography>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <WorkIcon color="action" />
                      <Typography variant="body2" fontWeight={600}>Job Title</Typography>
                    </Stack>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editProfile.jobTitle}
                        onChange={(e) => handleChange("jobTitle", e.target.value)}
                      />
                    ) : (
                      <Typography variant="body1">{profile.jobTitle}</Typography>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <WorkIcon color="action" />
                      <Typography variant="body2" fontWeight={600}>Department</Typography>
                    </Stack>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editProfile.department}
                        onChange={(e) => handleChange("department", e.target.value)}
                      />
                    ) : (
                      <Typography variant="body1">{profile.department}</Typography>
                    )}
                  </Grid>
                </Grid>

                <Divider />

                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Bio
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={editProfile.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                    />
                  ) : (
                    <Typography variant="body1">{profile.bio}</Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
                    Skills
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {profile.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
