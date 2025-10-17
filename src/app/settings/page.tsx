"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card, CardContent, Grid, TextField, Button, Snackbar, Alert, Typography, Stack
} from "@mui/material";

const Schema = z.object({
  orgName: z.string().min(2, "Organization name is required"),
  adminEmail: z.string().email("Enter a valid email"),
  domain: z
    .string()
    .regex(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i, "Enter a valid domain like example.com"),
});
type FormData = z.infer<typeof Schema>;

export default function SettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: "onBlur",
    defaultValues: {
      orgName: "Acme Inc.",
      adminEmail: "admin@example.com",
      domain: "example.com",
    },
  });

  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      // simulate API call
      await new Promise((r) => setTimeout(r, 800));
      setSaved(true);
      reset(data); // clear dirty state to what we just "saved"
    } catch {
      setError("Could not save settings. Please try again.");
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>Settings</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Organization name"
                fullWidth
                error={!!errors.orgName}
                helperText={errors.orgName?.message}
                {...register("orgName")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Admin email"
                fullWidth
                error={!!errors.adminEmail}
                helperText={errors.adminEmail?.message}
                {...register("adminEmail")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Primary domain"
                placeholder="example.com"
                fullWidth
                error={!!errors.domain}
                helperText={errors.domain?.message}
                {...register("domain")}
              />
            </Grid>

            <Grid size={12}>
              <Stack direction="row" gap={1} justifyContent="flex-end">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => reset()}
                  disabled={isSubmitting || !isDirty}
                >
                  Reset
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={saved}
        autoHideDuration={2000}
        onClose={() => setSaved(false)}
        message="Settings saved"
      />
    </Stack>
  );
}
