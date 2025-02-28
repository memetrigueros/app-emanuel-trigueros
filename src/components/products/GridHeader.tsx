import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Columns2, Columns4 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const gridOptions = [
    { icon: <Columns2 />, cols: 2, label: "2 Columnas", hiddenOnMobile: true },
    { icon: <Columns4 />, cols: 4, label: "4 Columnas", hiddenOnMobile: true },
];

/**
 * Header for Managing the Product Grid
 * @param {Object} props - Component Properties
 * @param {Product} props.gridCols - Columns to Display in the Grid
 */
export function GridHeader({ gridCols, setGridCols }: { gridCols: number; setGridCols: (cols: number) => void }) {
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
                <Button variant="outline">Filtro</Button>
                <Select>
                    <SelectTrigger className="w-[220px] p-5">
                        <SelectValue placeholder="Características" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Características</SelectLabel>
                            <SelectItem value="1">Mas vendidos</SelectItem>
                            <SelectItem value="2">Alfabeticamente, A-Z</SelectItem>
                            <SelectItem value="3">Alfabeticamente, Z-A</SelectItem>
                            <SelectItem value="4">Precio, menor a mayor</SelectItem>
                            <SelectItem value="5">Precio, mayor a menor</SelectItem>
                            <SelectItem value="6">Fecha</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-2">
                {gridOptions.map((option, index) => (
                    <TooltipProvider key={index}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={gridCols === option.cols ? "default" : "outline"}
                                    onClick={() => setGridCols(option.cols)}
                                    className={`p-2 ${option.hiddenOnMobile ? "!hidden sm:!inline-block" : ""}`}
                                >
                                    {option.icon}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{option.label}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
        </div>
    );
}