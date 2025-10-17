"use client";

import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import {
  Domain as DomainIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

interface Domain {
  name: string;
  status: string;
}

interface ChooseDomainStepProps {
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
  domains: Domain[];
}

export default function ChooseDomainStep({
  selectedDomain,
  onDomainChange,
  domains,
}: ChooseDomainStepProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight={600}>
        Choose a domain from Route 53
      </Typography>
      <Stack spacing={2}>
        {domains.map((domain) => (
          <Card
            key={domain.name}
            variant="outlined"
            sx={{
              cursor: 'pointer',
              border: selectedDomain === domain.name ? 2 : 1,
              borderColor: selectedDomain === domain.name ? 'primary.main' : 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => onDomainChange(domain.name)}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <DomainIcon color="primary" />
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {domain.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {domain.status}
                    </Typography>
                  </Box>
                </Stack>
                {selectedDomain === domain.name && (
                  <CheckCircleIcon color="primary" />
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
