import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { BrandCardProps } from "@/types/components";
import { sanitizeUrl, sanitizeText, getExternalLinkAttributes } from "@/lib/security";

export const BrandCard = ({ name, description, pros, cons, website, isIndian = false }: BrandCardProps) => {
  // Sanitize all input data for security
  const sanitizedName = sanitizeText(name);
  const sanitizedDescription = sanitizeText(description);
  const sanitizedPros = pros.map(pro => sanitizeText(pro)).filter(Boolean);
  const sanitizedCons = cons.map(con => sanitizeText(con)).filter(Boolean);
  const sanitizedWebsite = website ? sanitizeUrl(website) : null;
  
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground">{sanitizedName}</h3>
          {sanitizedWebsite && (
            <a 
              href={sanitizedWebsite}
              {...getExternalLinkAttributes()}
              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
              aria-label={`Visit ${sanitizedName} website`}
            >
              Visit Website <ExternalLink size={12} />
            </a>
          )}
        </div>
        {isIndian && (
          <Badge className="bg-gradient-to-r from-primary to-primary-glow text-white border-0">
            🇮🇳 Indian
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground mb-4 leading-relaxed">{sanitizedDescription}</p>
      
      <div className="space-y-3">
        {sanitizedPros.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-secondary mb-2 flex items-center gap-1">
              <CheckCircle2 size={16} />
              Pros
            </h4>
            <ul className="space-y-1">
              {sanitizedPros.map((pro, idx) => (
                <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {sanitizedCons.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-1">
              <XCircle size={16} />
              Cons
            </h4>
            <ul className="space-y-1">
              {sanitizedCons.map((con, idx) => (
                <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}


      </div>
    </Card>
  );
};
