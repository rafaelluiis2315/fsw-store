import { CategoryAndPercentageOfSales } from "@/actions/get-percentage-of-sales-by-category";
import { Progress } from "@/components/ui/progress";

interface PercentageOfCategorySalesProps {
  categories: CategoryAndPercentageOfSales[];
}

const PercentageOfCategorySales = ({
  categories,
}: PercentageOfCategorySalesProps) => {
  return (
    <div className="flex flex-col gap-5">
      {categories.map((category) => (
        <div key={category.id} className="flex w-full flex-col gap-3">
          <div className="flex justify-between">
            <p>{category.name}</p>
            <p>{category.percentage.toFixed(2)}%</p>
          </div>
          <Progress value={category.percentage} />
        </div>
      ))}
    </div>
  );
};

export default PercentageOfCategorySales;
