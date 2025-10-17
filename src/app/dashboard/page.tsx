"use client";

import * as React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const kpi = [
  { label: "MRR", value: "$12,340", delta: "+4.1% WoW" },
  { label: "Active Users", value: "2,481", delta: "+2.3% WoW" },
  { label: "Churn", value: "1.2%", delta: "-0.2 pts" },
  { label: "NPS", value: "51", delta: "+3" },
];

const data = [
  { d: "Mon", v: 120 }, { d: "Tue", v: 180 }, { d: "Wed", v: 140 },
  { d: "Thu", v: 220 }, { d: "Fri", v: 190 }, { d: "Sat", v: 240 }, { d: "Sun", v: 260 }
];

export default function DashboardPage() {
  return (
    <Stack spacing={2}>
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight={700}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">
          Sample data — wire to your API later
        </Typography>
      </Box>

      {/* KPI cards */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2 
        }}
      >
        {kpi.map((k) => (
          <Card key={k.label}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">{k.label}</Typography>
              <Typography variant="h4" sx={{ my: 0.5 }}>{k.value}</Typography>
              <Typography variant="body2" color="success.main">{k.delta}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Trend chart */}
      <Card>
        <CardContent style={{ height: 360 }}>
          <Typography variant="h6" gutterBottom>Weekly trend</Typography>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
              <XAxis dataKey="d" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Stack>
  );
}
