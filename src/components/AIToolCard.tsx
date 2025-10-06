import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface AIToolCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  price_monthly?: number;
  price_annual?: number;
  rating?: number;
  features?: string[];
  affiliate_link: string;
  icon_url?: string;
  is_featured?: boolean;
}

export const AIToolCard = ({
  id,
  name,
  description,
  category,
  price_monthly,
  price_annual,
  rating,
  features,
  affiliate_link,
  icon_url,
  is_featured,
}: AIToolCardProps) => {
  const navigate = useNavigate();
  return (
    <Card className="group relative overflow-hidden bg-gradient-card border-border hover:border-primary transition-all duration-300 hover:shadow-elevated hover:scale-105">
      <div className="p-6">
        {is_featured && (
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
        
        <div className="flex items-start gap-4 mb-4">
          {icon_url ? (
            <img src={icon_url} alt={name} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-xl">{name[0]}</span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

        {features && features.length > 0 && (
          <ul className="space-y-1 mb-4">
            {features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary"></span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
            {price_monthly && (
              <span className="text-sm text-muted-foreground">
                ₹{price_monthly}/mo
              </span>
            )}
            {price_annual && (
              <span className="text-xs text-muted-foreground">
                or ₹{price_annual}/year
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-gradient-primary hover:shadow-glow transition-all flex-1"
              onClick={() => navigate(`/payment?tool=${id}&amount=${price_monthly || price_annual || 0}`)}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(affiliate_link, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};