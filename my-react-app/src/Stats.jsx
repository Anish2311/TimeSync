import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatsGridTiny({
  title = "Stats",
  stats = [],
}) {
  return (
    <Card className="w-full">

      <CardContent className="" style={{overflowY: "scroll"}}>
        <div className="grid grid-cols-2 gap-2">
          {stats.slice(0, 9).map(([label, value], index) => (
            <div
              key={index}
              className="
                w-full
                h-fit-content
                rounded-md
                border
                p-2
                flex
                flex-col
                justify-center
                bg-muted/30
              "
            >
              <p className="text-[9px] leading-tight text-muted-foreground truncate">
                {label}
              </p>
              <p className="text-sm font-semibold leading-none truncate">
                {value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
