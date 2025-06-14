
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Send } from "lucide-react";

const SecretaryDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Secretary Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incoming Loan Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 New Applications</div>
            <p className="text-xs text-muted-foreground">Register and process new loan forms.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forward to Chairperson</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Send registered forms for approval.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default SecretaryDashboard;
