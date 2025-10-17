"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
} from "@mui/material";
import Link from "next/link";
import { Application } from "@/services/types";

interface RepositoryEnvironmentTabProps {
  app: Application;
  appId: string;
  searchParams: URLSearchParams;
  onPickRepository: () => void;
  onPickEnvironment: () => void;
}

export default function RepositoryEnvironmentTab({
  app,
  appId,
  searchParams,
  onPickRepository,
  onPickEnvironment,
}: RepositoryEnvironmentTabProps) {
  // Repository logic
  const getRepositoryInfo = () => {
    const repoCreatedParam = searchParams.get("repoCreated");
    const repoNameParam = searchParams.get("repoName");
    const urlAppIdParam = searchParams.get("appId");
    
    let hasRepo = false;
    let repoName = null;
    let repoUrl = null;
    
    if (repoCreatedParam === "true" && urlAppIdParam === appId && repoNameParam) {
      // 1. Just created a repo, show from URL params
      hasRepo = true;
      repoName = repoNameParam;
    } else if (app.repo_id && app.repository) {
      // 2. Has repo_id and repository object - use directly
      hasRepo = true;
      repoName = app.repository.name || "Unknown Repository";
      repoUrl = app.repository.url || null;
    }
    
    return { hasRepo, repoName, repoUrl };
  };

  // Environment logic
  const getEnvironmentInfo = () => {
    const envCreatedParam = searchParams.get("envCreated");
    const envNameParam = searchParams.get("envName");
    const urlAppIdParam = searchParams.get("appId");
    
    let hasEnv = false;
    let envName = null;
    let envBranch = null;
    
    if (envCreatedParam === "true" && urlAppIdParam === appId && envNameParam) {
      // 1. Just created an env, show from URL params
      hasEnv = true;
      envName = envNameParam;
    } else if (app.env_id && app.environment) {
      // 2. Has env_id and environment object - use directly
      hasEnv = true;
      envName = app.environment.name || "Unknown Environment";
      envBranch = app.environment.branch || null;
    }
    
    return { hasEnv, envName, envBranch };
  };

  const { hasRepo, repoName, repoUrl } = getRepositoryInfo();
  const { hasEnv, envName, envBranch } = getEnvironmentInfo();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Repository & Environment
        </Typography>

        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, 
          gap: 3,
          mt: 2
        }}>
          {/* Repository Section */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Repository
            </Typography>
            <Box>
              {hasRepo ? (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body1" fontWeight={500}>
                    {repoName}
                  </Typography>
                  {repoUrl && (
                    <Typography variant="body2" color="text.secondary">
                      {repoUrl}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontStyle: "italic" }}>
                  Not set
                </Typography>
              )}
              
              <Stack direction="row" spacing={1}>
                <Button
                  component={Link}
                  href={`/repos/create?appId=${encodeURIComponent(appId)}&returnTo=appDetail`}
                  variant="outlined"
                  size="small"
                >
                  Create New
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onPickRepository}
                >
                  Pick Existing
                </Button>
              </Stack>
            </Box>
          </Box>

          {/* Environment Section */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Environment
            </Typography>
            <Box>
              {hasEnv ? (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body1" fontWeight={500}>
                    {envName}
                  </Typography>
                  {envBranch && (
                    <Typography variant="body2" color="text.secondary">
                      Branch: {envBranch}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontStyle: "italic" }}>
                  Not set
                </Typography>
              )}
              
              <Stack direction="row" spacing={1}>
                <Button
                  component={Link}
                  href={`/environment/create?appId=${encodeURIComponent(appId)}&returnTo=appDetail`}
                  variant="outlined"
                  size="small"
                >
                  Create New
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onPickEnvironment}
                >
                  Pick Existing
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
