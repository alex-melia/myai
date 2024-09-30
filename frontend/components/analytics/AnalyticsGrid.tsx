"use client"

import { DateRangePicker } from "../ui/date-range-picker"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { BarChartComponent } from "./BarChart"
import { OSPieChart } from "../charts/OSPieChart"
import { BrowserPieChart } from "../charts/BrowserPieChart"
import { useState } from "react"
import { InferSelectModel } from "drizzle-orm"
import { analytics, users } from "@/db/schema"

type User = InferSelectModel<typeof users>
type Analytics = InferSelectModel<typeof analytics>

interface AnalyticsGridProps {
  currentUser: User
  analytics: Analytics
}

interface BrowserData {
  [key: string]: number
}

interface OSData {
  [key: string]: number
}

export default function AnalyticsGrid({
  currentUser,
  analytics,
}: AnalyticsGridProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: currentUser?.created_at
      ? new Date(currentUser.created_at)
      : new Date(),
    to: new Date(),
  })
  const browserData = analytics?.browser_data as BrowserData
  const osData = analytics?.browser_data as OSData

  const pageViewsData = {
    labels: [
      "Hit Count",
      "Avg Tokens",
      "Total Tokens",
      "Min Tokens",
      "Max Tokens",
    ],
    datasets: [
      {
        label: "Page Views Data",
        data: [
          analytics.hit_count,
          analytics.avg_tokens_per_request,
          analytics.total_tokens_used,
          analytics.min_tokens_per_request,
          analytics.max_tokens_per_request,
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  }

  const browserChartData = Object.keys(browserData || {}).map((key) => ({
    browser: key,
    visitors: browserData[key] as number,
    fill:
      key === "chrome"
        ? "hsl(var(--chart-1))"
        : key === "firefox"
        ? "hsl(var(--chart-2))"
        : key === "safari"
        ? "hsl(var(--chart-3))"
        : "hsl(var(--chart-4))",
  }))

  const osChartData = Object.keys(osData || {}).map((key) => ({
    os: key,
    visitors: osData[key] as number,
    fill: key === "windows" ? "hsl(var(--chart-1))" : "hsl(var(--chart-5))", // Assign colors
  }))

  return (
    <>
      <div className="flex justify-center xl:justify-end">
        <DateRangePicker
          onUpdate={(values: any) => setDateRange(values)}
          initialDateFrom={currentUser?.created_at as Date}
          initialDateTo={new Date()}
          align="start"
          locale="en-GB"
          showCompare={false}
        />
      </div>
      <div className="flex justify-center mt-4">
        <BarChartComponent data={pageViewsData} dateRange={dateRange} />
      </div>
      <div className="flex flex-col md:grid md:grid-cols-2  xl:grid-cols-3 gap-4 w-full mt-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Operating Systems</CardTitle>
          </CardHeader>
          <CardContent className="my-2">
            <OSPieChart chartData={osChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Browsers</CardTitle>
          </CardHeader>
          <CardContent className="my-2">
            <BrowserPieChart chartData={browserChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Countries</CardTitle>
          </CardHeader>
          <CardContent className="my-2">
            <p>data</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
