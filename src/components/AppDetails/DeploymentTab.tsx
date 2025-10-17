"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
  Box,
  Button,
} from "@mui/material";
import {
  RocketLaunch as RocketIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { Application } from "@/services/types";

interface DeploymentTabProps {
  app: Application;
  onDeploy: () => void;
  onOpenUrl: () => void;
  canDeploy: boolean;
  deployTooltip: string;
  isDeploying: boolean;
}

export default function DeploymentTab({
  app,
  onDeploy,
  onOpenUrl,
  canDeploy,
  deployTooltip,
  isDeploying,
}: DeploymentTabProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Deployment Information
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          {app.deployed_url && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Deployed URL
              </Typography>
              <Typography variant="body1">
                <a
                  href={app.deployed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {app.deployed_url}
                </a>
              </Typography>
            </Box>
          )}

          {app.base_domain && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Base Domain
              </Typography>
              <Typography variant="body1">{app.base_domain}</Typography>
            </Box>
          )}

          {app.amplify_app_id && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Amplify App ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                {app.amplify_app_id}
              </Typography>
            </Box>
          )}

          {app.last_deployment_status && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Last Deployment Status
              </Typography>
              <Chip
                label={app.last_deployment_status}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          )}

          {app.last_deployment_id && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Last Deployment ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                {app.last_deployment_id}
              </Typography>
            </Box>
          )}

          {app.last_amplify_job_id && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Last Amplify Job ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                {app.last_amplify_job_id}
              </Typography>
            </Box>
          )}

          {/* Deployment Actions */}
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2}>
            {app.deployed_url && (
              <Button
                variant="outlined"
                startIcon={<OpenInNewIcon />}
                onClick={onOpenUrl}
              >
                Open App
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<RocketIcon />}
              onClick={onDeploy}
              disabled={!canDeploy}
              title={deployTooltip}
            >
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
