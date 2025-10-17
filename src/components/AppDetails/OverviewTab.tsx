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
  Link,
} from "@mui/material";
import {
  RocketLaunch as RocketIcon,
  Code as CodeIcon,
  Language as DomainIcon,
  Business as OrgIcon,
} from "@mui/icons-material";
import { Application } from "@/services/types";

interface OverviewTabProps {
  app: Application;
  searchParams: URLSearchParams;
  appId: string;
}

export default function OverviewTab({ app, searchParams, appId }: OverviewTabProps) {
  // Get repository info with priority: URL params > app state
  const getRepositoryInfo = () => {
    const repoCreatedParam = searchParams.get("repoCreated");
    const repoNameParam = searchParams.get("repoName");
    const urlAppIdParam = searchParams.get("appId");
    
    if (repoCreatedParam === "true" && urlAppIdParam === appId && repoNameParam) {
      return {
        name: repoNameParam,
        url: null, // URL params don't include URL
        status: "Just created"
      };
    } else if (app.repository) {
      return {
        name: app.repository.name,
        url: app.repository.url,
        status: app.repository.status || "Active"
      };
    } else if (app.repo_name) {
      return {
        name: app.repo_name,
        url: null,
        status: "Linked"
      };
    }
    return null;
  };

  // Get environment info with priority: URL params > app state
  const getEnvironmentInfo = () => {
    const envCreatedParam = searchParams.get("envCreated");
    const envNameParam = searchParams.get("envName");
    const urlAppIdParam = searchParams.get("appId");
    
    if (envCreatedParam === "true" && urlAppIdParam === appId && envNameParam) {
      return {
        name: envNameParam,
        branch: null,
        status: "Just created"
      };
    } else if (app.environment) {
      return {
        name: app.environment.name,
        branch: app.environment.branch,
        status: app.environment.status || "Active"
      };
    }
    return null;
  };

  const repositoryInfo = getRepositoryInfo();
  const environmentInfo = getEnvironmentInfo();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Application Summary
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, 
          gap: 3 
        }}>
          {/* App Summary Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <OrgIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Application Details
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {app.name}
                </Typography>
              </Box>

              {app.description && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {app.description}
                  </Typography>
                </Box>
              )}

              {app.org && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Organization
                  </Typography>
                  <Typography variant="body1">{app.org}</Typography>
                </Box>
              )}

              {app.creation_type && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Chip
                    label={app.creation_type === "create_new" ? "New App" : "Adopted App"}
                    size="small"
                    color={app.creation_type === "create_new" ? "primary" : "secondary"}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              )}
            </Stack>
          </Box>

          {/* Deployment Status Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RocketIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Deployment Status
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={app.status || "Unknown"}
                  color={
                    app.status === "active"
                      ? "success"
                      : app.status === "building"
                      ? "warning"
                      : "default"
                  }
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              {app.deployed_url && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Live URL
                  </Typography>
                  <Link
                    href={app.deployed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main', textDecoration: 'underline' }}
                  >
                    {app.deployed_url}
                  </Link>
                </Box>
              )}

              {app.last_deployment_status && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last Deployment
                  </Typography>
                  <Chip
                    label={app.last_deployment_status}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              )}

              {app.amplify_app_id && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Amplify App ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: '0.875rem' }}>
                    {app.amplify_app_id}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Repository Link Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Repository
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              {repositoryInfo ? (
                <>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Repository Name
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {repositoryInfo.name}
                    </Typography>
                  </Box>

                  {repositoryInfo.url && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Repository URL
                      </Typography>
                      <Link
                        href={repositoryInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'primary.main', textDecoration: 'underline' }}
                      >
                        {repositoryInfo.url}
                      </Link>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Repository Status
                    </Typography>
                    <Chip
                      label={repositoryInfo.status}
                      size="small"
                      color={repositoryInfo.status === "Active" ? "success" : "default"}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                    No repository linked
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Domain Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DomainIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Domain & Environment
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              {environmentInfo && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Environment
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {environmentInfo.name}
                  </Typography>
                  {environmentInfo.branch && (
                    <Typography variant="body2" color="text.secondary">
                      Branch: {environmentInfo.branch}
                    </Typography>
                  )}
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

              {app.domain_status && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Domain Status
                  </Typography>
                  <Chip
                    label={app.domain_status}
                    size="small"
                    color={app.domain_status === "active" ? "success" : "default"}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              )}

              {!environmentInfo && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                    No environment configured
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
