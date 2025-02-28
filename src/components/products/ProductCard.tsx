import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Scale } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddToCartDialog } from "@/components/products/AddToCartDialog";
import { Product } from "@/types/product";
import { useState } from "react";

/**
 * Component that Displays the Product in a Card
 * @param {Object} props - Product in the card
 * @param {Product} props.gridCols - Columns to Display in the Grid
 */
export function ProductCard({
    product,
    gridCols
}: {
    product: Product;
    gridCols: number;
}) {

    // Controls cart dialog visibility
    const [openCartDialog, setOpenCartDialog] = useState(false);

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-white rounded-lg lg:p-6 md:p-2 sm:p-2 overflow-hidden cursor-pointer transition-transform duration-300 group"
        >
            <div className="relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={`w-full ${gridCols === 2 ? "object-contain" : "object-cover"}`}
                />
                {/* cart & compare options hover */}
                <div className="absolute inset-0 flex justify-center items-center gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    {/* Add to cart button */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center"
                                    onClick={ () => setOpenCartDialog(true)}
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                </Button>

                            </TooltipTrigger>
                            <TooltipContent>Agregar al carrito</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {/* Add to cart dialog */}
                    <AddToCartDialog product={product} setOpenDialog={setOpenCartDialog} openDialog={openCartDialog} />
                    
                     {/* compare button */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary-hover text-black flex items-center justify-center">
                                    <Scale className="w-6 h-6 text-black" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Comparar</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <div className="pt-2">
                <h3 className="text-md font-semibold">{product.name}</h3>
                <p className="text-md font-bold">Q{product.price}</p>
            </div>
        </motion.div>
    );
}
