'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Heart,
  Search,
  AlertCircle,
  CheckCircle2,
  Users,
  IndianRupee,
  BookOpen,
  Wrench,
  Award,
  List,
  FileText
} from 'lucide-react';

import schemesData from '@/app/mock/schemes.json';

// Define TypeScript interfaces
interface Scheme {
  id: string;
  name: string;
  category: string;
  targetAudience: string[];
  benefit: string;
  benefitAmount?: string;
  eligibility: string[];
  documents: string[];
  incomeLimit?: string;
  ageLimit?: string;
  portal: string;
  portalUrl?: string;
  description: string;
  community?: string[];
  specialNotes?: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

// Icon mapping for categories
const iconMap: Record<string, React.ReactNode> = {
  List: <List className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  IndianRupee: <IndianRupee className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />
};

export default function SchemesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [incomeFilter, setIncomeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const schemes: Scheme[] = schemesData.schemes;
  const categories: Category[] = schemesData.categories;
  const categoryMapping: Record<string, string> = schemesData.categoryMapping;

  // Filter and sort schemes
  const filteredSchemes = useMemo(() => {
    let filtered = [...schemes];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scheme => {
        const schemeCategory = categoryMapping[scheme.category];
        return schemeCategory === selectedCategory;
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(query) ||
        scheme.description.toLowerCase().includes(query) ||
        scheme.targetAudience.some(audience => audience.toLowerCase().includes(query))
      );
    }

    // Income filter
    if (incomeFilter !== 'all') {
      filtered = filtered.filter(scheme => {
        const incomeLimit = scheme.incomeLimit;
        if (!incomeLimit) return true;

        if (incomeFilter === 'low' && incomeLimit.includes('₹2,00,000')) return true;
        if (incomeFilter === 'mid' && (incomeLimit.includes('₹1,50,000') || incomeLimit.includes('Rural'))) return true;
        return false;
      });
    }

    // Sort
    if (sortBy === 'benefit') {
      filtered.sort((a, b) => {
        const extractAmount = (benefit?: string) => {
          if (!benefit) return 0;
          const match = benefit.match(/₹([\d,]+)/);
          return match ? parseInt(match[1].replace(/,/g, '')) : 0;
        };
        return extractAmount(b.benefitAmount) - extractAmount(a.benefitAmount);
      });
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, selectedCategory, incomeFilter, sortBy, schemes, categoryMapping]);

  return (
    <div className="min-h-screen bg-gradient-to-b  dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Telangana Minority Welfare Schemes
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Comprehensive guide to government schemes for minority communities
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-8 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
          <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-900 dark:text-green-100">Apply Now!</AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200">
            Visit the official government portals to apply for schemes. All applications are processed online through e-governance platforms.
          </AlertDescription>
        </Alert>

        {/* Search and Filter Section */}
        <Card className="mb-8 border-green-100 dark:border-green-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Search className="w-5 h-5" />
              Find Your Scheme
            </CardTitle>
            <CardDescription>Search and filter schemes that match your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by scheme name, benefit, or target audience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-green-200 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          {iconMap[cat.icon]}
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Income Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Income Level
                </label>
                <Select value={incomeFilter} onValueChange={setIncomeFilter}>
                  <SelectTrigger className="border-green-200 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Income Levels</SelectItem>
                    <SelectItem value="low">₹1-2,00,000</SelectItem>
                    <SelectItem value="mid">₹1-1,50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-green-200 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Scheme Name</SelectItem>
                    <SelectItem value="benefit">Benefit Amount (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-green-700 dark:text-green-400">{filteredSchemes.length}</span> of{' '}
          <span className="font-semibold text-green-700 dark:text-green-400">{schemes.length}</span> schemes
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredSchemes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {filteredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              No schemes found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto mt-12 border-t border-green-200 dark:border-green-900 pt-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{schemes.length}+</div>
            <p className="text-slate-600 dark:text-slate-400">Active Schemes</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">₹50,000+</div>
            <p className="text-slate-600 dark:text-slate-400">Average Benefit</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">5</div>
            <p className="text-slate-600 dark:text-slate-400">Minority Communities</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scheme Card Component
function SchemeCard({ scheme }: { scheme: Scheme }) {
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Marriage Support':
        return 'bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-200 border-pink-200';
      case 'Women Empowerment':
        return 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-200';
      case 'Financial Assistance':
        return 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200';
      case 'Education':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-200';
      case 'Skill Development':
        return 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border-orange-200';
      case 'Special Categories':
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border-indigo-200';
      default:
        return 'bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-slate-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-green-100 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-700">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 text-slate-900 dark:text-white">{scheme.name}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge className={getCategoryColor(scheme.category)}>{scheme.category}</Badge>
              {scheme.benefitAmount && (
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                  <IndianRupee className="w-3 h-3 mr-1" />
                  {scheme.benefitAmount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-slate-700 dark:text-slate-300">{scheme.description}</p>

        {/* Key Details */}
        <Accordion type="single" collapsible className="w-full">
          {/* Eligibility */}
          <AccordionItem value="eligibility" className="border-green-100 dark:border-green-900/50">
            <AccordionTrigger className="text-sm font-semibold hover:text-green-600 dark:hover:text-green-400">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                Eligibility Criteria
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {scheme.eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Required Documents */}
          <AccordionItem value="documents" className="border-green-100 dark:border-green-900/50">
            <AccordionTrigger className="text-sm font-semibold hover:text-green-600 dark:hover:text-green-400">
              <span className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                Required Documents
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {scheme.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">•</span>
                    <span className="text-slate-700 dark:text-slate-300">{doc}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Additional Info */}
          <AccordionItem value="info" className="border-green-100 dark:border-green-900/50">
            <AccordionTrigger className="text-sm font-semibold hover:text-green-600 dark:hover:text-green-400">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                More Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {scheme.ageLimit && (
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 text-sm">Age Limit</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">{scheme.ageLimit}</p>
                </div>
              )}
              {scheme.incomeLimit && (
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 text-sm">Income Limit</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">{scheme.incomeLimit}</p>
                </div>
              )}
              {scheme.community && (
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 text-sm">Target Communities</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">{scheme.community.join(', ')}</p>
                </div>
              )}
              {scheme.specialNotes && (
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 text-sm">Special Notes</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">{scheme.specialNotes}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Application Button */}
        <div className="pt-4 border-t border-green-100 dark:border-green-900/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Portal:</span> {scheme.portal}
            </p>
            {scheme.portalUrl && (
              <Button
                asChild
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <a href={scheme.portalUrl} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
