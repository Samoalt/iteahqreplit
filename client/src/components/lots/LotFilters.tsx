import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Leaf, Filter, X } from "lucide-react";

interface FilterOptions {
  grade: string;
  minQuality: number;
  esgCertified: boolean;
  status: string;
  factory: string;
}

interface LotFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  availableFactories: string[];
}

export default function LotFilters({ onFiltersChange, availableFactories }: LotFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    grade: "",
    minQuality: 0,
    esgCertified: false,
    status: "",
    factory: ""
  });

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const grades = ["PF1", "PEKOE", "BOPF", "FBOP", "FBOPF1", "DUST"];
  const statuses = ["live", "bidding", "draft"];

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
    
    // Count active filters
    let count = 0;
    if (updatedFilters.grade) count++;
    if (updatedFilters.minQuality > 0) count++;
    if (updatedFilters.esgCertified) count++;
    if (updatedFilters.status) count++;
    if (updatedFilters.factory) count++;
    setActiveFilterCount(count);
  };

  const clearFilters = () => {
    const clearedFilters = {
      grade: "",
      minQuality: 0,
      esgCertified: false,
      status: "",
      factory: ""
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setActiveFilterCount(0);
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < count ? "text-yellow-400 fill-current" : "text-slate-300"
        }`}
      />
    ));
  };

  return (
    <Card className="feature-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-primary" />
            <CardTitle className="card-title">Filters</CardTitle>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="badge-accent">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-destructive hover:text-destructive/80"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Grade Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Grade</Label>
          <Select 
            value={filters.grade} 
            onValueChange={(value) => updateFilters({ grade: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All grades</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quality Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Minimum Quality</Label>
          <Select 
            value={filters.minQuality.toString()} 
            onValueChange={(value) => updateFilters({ minQuality: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any quality</SelectItem>
              {[1, 2, 3, 4, 5].map((stars) => (
                <SelectItem key={stars} value={stars.toString()}>
                  <div className="flex items-center space-x-2">
                    <span>{stars}+ stars</span>
                    <div className="flex">
                      {renderStars(stars)}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Factory Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Factory</Label>
          <Select 
            value={filters.factory} 
            onValueChange={(value) => updateFilters({ factory: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All factories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All factories</SelectItem>
              {availableFactories.map((factory) => (
                <SelectItem key={factory} value={factory}>
                  {factory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => updateFilters({ status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ESG Certified Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="esg-filter"
            checked={filters.esgCertified}
            onCheckedChange={(checked) => updateFilters({ esgCertified: !!checked })}
          />
          <Label 
            htmlFor="esg-filter" 
            className="text-sm font-medium flex items-center space-x-1 cursor-pointer"
          >
            <Leaf className="w-4 h-4 text-green-600" />
            <span>ESG Certified only</span>
          </Label>
        </div>

        {/* Quick Filter: PF1 Quality 4+ */}
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ grade: "PF1", minQuality: 4 })}
            className="w-full"
          >
            <Star className="w-4 h-4 mr-2 text-yellow-400" />
            PF1 Quality 4+ Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}