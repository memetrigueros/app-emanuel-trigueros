import { useState } from "react";
import { GridHeader } from "@/components/products/GridHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";

/**
 * Component that Provides the Product Grid
 *
 */
export default function ProductGrid() {
    // Products hook
    const { products, loading, error } = useProducts();
    // Columns to Display in the Grid
    const [gridCols, setGridCols] = useState(4);

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="p-4"
        >
            <GridHeader gridCols={gridCols} setGridCols={setGridCols} />
            <motion.div
                layout
                className={`grid mt-8 gap-1 transition-all duration-500 ${
                    gridCols === 2 ? "grid-cols-2" : "md:grid-cols-4 grid-cols-2"
                  }`}
            >
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} gridCols={gridCols} />
                ))}
            </motion.div>
        </motion.div>
    );
}