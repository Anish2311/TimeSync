import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function ErrorList({
  errors = [],
  title = "Errors",
}) {
  if (!errors.length) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            No errors detected
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-destructive">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="destructive">
          {errors.length}
        </Badge>
      </CardHeader>

      <CardContent>
        <ScrollArea className="max-h-80 pr-3">
          <div className="space-y-2">
            {errors.map((err, i) => (
              <Alert
                key={err.id ?? i}
                variant={
                  err.severity === "warning"
                    ? "default"
                    : "destructive"
                }
              >
                {/* <AlertTitle className="text-sm font-semibold">
                  {err.type}
                </AlertTitle> */}

                <AlertDescription className="text-sm">
                  {err.message}

                  {(err.row !== undefined ||
                    err.col !== undefined) && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {err.row !== undefined &&
                        `Row ${err.row + 1} `}
                      {err.col !== undefined &&
                        `Col ${err.col + 1}`}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
