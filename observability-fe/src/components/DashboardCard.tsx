import { Card, CardContent } from "@/components/ui/card"

export function DashboardCard({
  title,
  value,
  change,
}: {
  title: string
  value: string
  change: string
}) {
  const isPositive = change.startsWith("+")
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <div className="text-3xl font-bold mt-2">{value}</div>
        <p
          className={`text-sm mt-1 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change} from last week
        </p>
      </CardContent>
    </Card>
  )
}
