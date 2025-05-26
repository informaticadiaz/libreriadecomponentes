"use client"

import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Download,
  Share
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface MetricCardProps {
  title: string
  value: string
  change: number
  trend: "up" | "down"
  icon: React.ReactNode
  description?: string
  target?: number
  current?: number
}

function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  description,
  target,
  current 
}: MetricCardProps) {
  const isPositive = trend === "up"
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            <span className="font-medium">
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
          <span>from last month</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
        {target && current && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress to target</span>
              <span className="font-medium">{Math.round((current / target) * 100)}%</span>
            </div>
            <Progress value={(current / target) * 100} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface RecentActivityProps {
  activities: Array<{
    id: string
    user: string
    action: string
    target: string
    timestamp: string
    status: "success" | "warning" | "error"
  }>
}

function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and events from your team
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View all
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-2 w-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
              <Badge 
                variant={
                  activity.status === 'success' ? 'default' :
                  activity.status === 'warning' ? 'secondary' : 'destructive'
                }
                className="capitalize"
              >
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface TopPerformersProps {
  performers: Array<{
    id: string
    name: string
    role: string
    score: number
    avatar?: string
    trend: "up" | "down" | "stable"
  }>
}

function TopPerformers({ performers }: TopPerformersProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>
          Highest performing team members this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performers.map((performer, index) => (
            <div key={performer.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {performer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium">{performer.name}</p>
                  <p className="text-xs text-muted-foreground">{performer.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{performer.score}</span>
                {performer.trend === 'up' && (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                )}
                {performer.trend === 'down' && (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                {performer.trend === 'stable' && (
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricsDashboard() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: 12.5,
      trend: "up" as const,
      icon: <DollarSign className="h-4 w-4" />,
      description: "Revenue is up 12.5% from last month",
      target: 50000,
      current: 45231.89
    },
    {
      title: "Total Users",
      value: "12,234",
      change: 8.2,
      trend: "up" as const,
      icon: <Users className="h-4 w-4" />,
      description: "New user registrations increased",
      target: 15000,
      current: 12234
    },
    {
      title: "Active Sessions",
      value: "2,345",
      change: -3.1,
      trend: "down" as const,
      icon: <Activity className="h-4 w-4" />,
      description: "Slightly down from last week"
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: 1.8,
      trend: "up" as const,
      icon: <ShoppingCart className="h-4 w-4" />,
      description: "Great improvement in conversions"
    }
  ]

  const recentActivities = [
    {
      id: "1",
      user: "Sarah Chen",
      action: "completed project",
      target: "Website Redesign",
      timestamp: "2 minutes ago",
      status: "success" as const
    },
    {
      id: "2",
      user: "Mike Johnson",
      action: "updated task",
      target: "API Integration",
      timestamp: "15 minutes ago",
      status: "warning" as const
    },
    {
      id: "3",
      user: "Emma Davis",
      action: "created new",
      target: "Marketing Campaign",
      timestamp: "1 hour ago",
      status: "success" as const
    },
    {
      id: "4",
      user: "Alex Rodriguez",
      action: "flagged issue in",
      target: "Payment System",
      timestamp: "2 hours ago",
      status: "error" as const
    }
  ]

  const topPerformers = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Lead Developer",
      score: 98,
      trend: "up" as const
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Product Manager",
      score: 94,
      trend: "stable" as const
    },
    {
      id: "3",
      name: "Emma Davis",
      role: "UI/UX Designer",
      score: 92,
      trend: "up" as const
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      role: "Backend Engineer",
      score: 89,
      trend: "down" as const
    }
  ]

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Secondary Grid */}
      <div className="grid gap-4 md:grid-cols-5">
        <RecentActivity activities={recentActivities} />
        <TopPerformers performers={topPerformers} />
      </div>
    </div>
  )
}