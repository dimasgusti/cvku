
import { FaSignInAlt } from "react-icons/fa";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  pricePeriod: string;
  features: string[];
  onActionClick: () => void;
  actionLabel: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  pricePeriod,
  features,
  onActionClick,
  actionLabel,
}) => {
  return (
    <Card className="max-w-xs">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 py-4">
        <h2 className="text-xl md:text-2xl font-semibold">
          {price} <span className="font-thin text-sm">{pricePeriod}</span>
        </h2>
        <Button onClick={onActionClick} size="sm" className="w-full">
          <FaSignInAlt />
          {actionLabel}
        </Button>
      </CardContent>
      <Separator />
      <CardContent className="space-y-4 py-4">
        <CardDescription>Features</CardDescription>
        <ul>
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex flex-row justify-start items-center gap-2 text-sm text-black/70"
            >
              <Check size={16} color="black" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PricingCard;