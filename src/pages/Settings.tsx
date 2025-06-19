import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Printer, Bell, Shield, Database } from "lucide-react";

const SettingsPage = () => {
  // Mock settings state - in a real app, these would come from your backend/context
  const [settings, setSettings] = React.useState({
    notifications: true,
    prescriptionPrinting: true,
    lowStockAlerts: true,
    theme: "light",
    language: "en",
    taxRate: 7.5,
    inventoryThreshold: 10,
    backupFrequency: "weekly",
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto py-8">
     

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="printing">
            <Printer className="mr-2 h-4 w-4" /> Printing
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Database className="mr-2 h-4 w-4" /> Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleChange("taxRate", parseFloat(e.target.value))}
                    min="0"
                    max="30"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inventoryThreshold">Low Stock Threshold</Label>
                  <Input
                    id="inventoryThreshold"
                    type="number"
                    value={settings.inventoryThreshold}
                    onChange={(e) => handleChange("inventoryThreshold", parseInt(e.target.value))}
                    min="1"
                  />
                  <p className="text-sm text-muted-foreground">
                    System will alert when stock falls below this level
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive system notifications
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleChange("notifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div>
                  <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get alerts when inventory is low
                  </p>
                </div>
                <Switch
                  id="lowStockAlerts"
                  checked={settings.lowStockAlerts}
                  onCheckedChange={(checked) => handleChange("lowStockAlerts", checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="printing">
          <Card>
            <CardHeader>
              <CardTitle>Printing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <Label htmlFor="prescriptionPrinting">Auto-Print Prescriptions</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically print prescriptions after creation
                  </p>
                </div>
                <Switch
                  id="prescriptionPrinting"
                  checked={settings.prescriptionPrinting}
                  onCheckedChange={(checked) => handleChange("prescriptionPrinting", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="printerName">Default Printer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select printer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt-printer">Receipt Printer (EPSON TM-T20)</SelectItem>
                    <SelectItem value="laser-printer">Laser Printer (HP LaserJet)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prescription Template</Label>
                <div className="flex gap-2">
                  <Badge variant="outline">Default</Badge>
                  <Badge variant="secondary">Compact</Badge>
                  <Badge variant="secondary">Detailed</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Password Requirements</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="require-strong-passwords" />
                    <Label htmlFor="require-strong-passwords">Require strong passwords</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="two-factor-auth" />
                    <Label htmlFor="two-factor-auth">Enable two-factor authentication</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="15 minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select
                  value={settings.backupFrequency}
                  onValueChange={(value) => handleChange("backupFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Last Backup</Label>
                <p className="text-sm text-muted-foreground">
                  June 15, 2023 at 2:30 AM
                </p>
              </div>

              <div className="space-y-2">
                <Label>Backup Location</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline">Local Storage</Button>
                  <Button variant="outline">Cloud Storage</Button>
                  <Button variant="outline">External Drive</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Restore Backup</Button>
              <div className="space-x-2">
                <Button variant="secondary">Backup Now</Button>
                <Button>Save Changes</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;