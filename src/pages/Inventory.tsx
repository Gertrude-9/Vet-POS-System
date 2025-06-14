
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";

const Inventory = () => {
  return (
    <div className="flex flex-col gap-4 py-4">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Inventory</h1>
            <Button>
                <FilePlus2 className="mr-2 h-4 w-4" /> Add Product
            </Button>
        </div>
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Product table will be displayed here.
        </div>
    </div>
  );
};
export default Inventory;
