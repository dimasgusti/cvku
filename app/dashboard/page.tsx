import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="h-[10rem]">
          <CardHeader>
            <CardTitle>Recent Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div>BISA</div>
          </CardContent>
        </Card>
        <Card className="h-[10rem]">
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div>BISA</div>
          </CardContent>
        </Card>
        <Card className="h-[10rem]">
          <CardHeader>
            <CardTitle>New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div>BISA</div>
          </CardContent>
        </Card>
        <Card className="h-[10rem]">
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div>BISA</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="h-[20rem] p-4">
          <CardHeader>
            <CardTitle>Chart 1</CardTitle>
          </CardHeader>
          <CardContent>
            <div>BISA</div>
          </CardContent>
        </Card>
        <Card className="h-[20rem] p-4">
          <CardHeader>
            <CardTitle>Chart 2</CardTitle>
          </CardHeader>
          <CardContent>
            <div>BISA</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
