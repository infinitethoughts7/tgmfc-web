'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const schemeId = searchParams.get('id');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const schemes: Scheme[] = schemesData.schemes;
  const categories: Category[] = schemesData.categories;
  const categoryMapping: Record<string, string> = schemesData.categoryMapping;

  // If schemeId is provided, find that specific scheme
  const selectedScheme = schemeId ? schemes.find(s => s.id === schemeId) : null;

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
  }, [searchQuery, selectedCategory, sortBy, schemes, categoryMapping]);

  // If a specific scheme is selected, show only that scheme
  if (selectedScheme) {
    return (
      <div className="min-h-screen bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 px-3 py-4 sm:px-4 sm:py-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="outline"
            className="mb-6 border-green-300 text-green-700 hover:bg-green-50"
            onClick={() => window.history.back()}
          >
            ← Back to All Schemes
          </Button>

          {/* Single Scheme Card */}
          <SchemeCard scheme={selectedScheme} />

          {/* View All Link */}
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              <a href="/schemes">View All Schemes</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 px-3 py-4 sm:px-4 sm:py-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Telangana Minority Welfare Schemes
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 px-2">
            Comprehensive guide to government schemes for minority communities
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 md:mb-8 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
          <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-900 dark:text-green-100 text-sm sm:text-base">Apply Now!</AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200 text-xs sm:text-sm">
            Visit the official government portals to apply for schemes. All applications are processed online.
          </AlertDescription>
        </Alert>

        {/* Search and Filter Section */}
        <Card className="mb-6 md:mb-8 border-green-100 dark:border-green-900/50">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex text-lg sm:text-xl md:text-2xl font-bold items-center gap-2 text-green-700 dark:text-green-400">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              Find Your Scheme
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Search and filter schemes that match your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2 block">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-green-200 focus:ring-green-500 text-sm sm:text-base">
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

              {/* Sort By */}
              <div>
                <label className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2 block">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-green-200 focus:ring-green-500 text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Scheme Name</SelectItem>
                    <SelectItem value="benefit">Benefit Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-green-700 dark:text-green-400">{filteredSchemes.length}</span> of{' '}
          <span className="font-semibold text-green-700 dark:text-green-400">{schemes.length}</span> schemes
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredSchemes.length > 0 ? (
          <div className="grid gap-4 sm:gap-6">
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
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12 border-t border-green-200 dark:border-green-900 pt-6 sm:pt-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">{schemes.length}+</div>
            <p className="text-xs sm:text-sm md:text-lg text-slate-600 dark:text-slate-400">Active Schemes</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">₹70K+</div>
            <p className="text-xs sm:text-sm md:text-lg text-slate-600 dark:text-slate-400">Avg Benefit</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">5</div>
            <p className="text-xs sm:text-sm md:text-lg text-slate-600 dark:text-slate-400">Communities</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get portal URL
function getPortalUrl(scheme: Scheme): string | null {
  // First check if portalUrl exists
  if (scheme.portalUrl) {
    return scheme.portalUrl;
  }
  // Check if portal is a URL (starts with http or https)
  if (scheme.portal && (scheme.portal.startsWith('http://') || scheme.portal.startsWith('https://'))) {
    return scheme.portal;
  }
  return null;
}

// Helper function to get portal display name
function getPortalDisplayName(scheme: Scheme): string {
  // If portal is a URL, extract the domain name
  if (scheme.portal.startsWith('http://') || scheme.portal.startsWith('https://')) {
    try {
      const url = new URL(scheme.portal);
      return url.hostname;
    } catch {
      return scheme.portal;
    }
  }
  return scheme.portal;
}

// Scheme Card Component
function SchemeCard({ scheme }: { scheme: Scheme }) {
  const portalUrl = getPortalUrl(scheme);
  const portalDisplayName = getPortalDisplayName(scheme);

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
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-white leading-tight">{scheme.name}</CardTitle>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Badge className={`text-xs sm:text-sm ${getCategoryColor(scheme.category)}`}>{scheme.category}</Badge>
              {scheme.benefitAmount && (
                <Badge variant="outline" className="text-xs sm:text-sm bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                  <IndianRupee className="w-3 h-3 mr-0.5 sm:mr-1" />
                  {scheme.benefitAmount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
        {/* Description */}
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">{scheme.description}</p>

        {/* Key Details */}
        <Accordion type="single" collapsible className="w-full">
          {/* Eligibility */}
          <AccordionItem value="eligibility" className="border-green-100 dark:border-green-900/50">
            <AccordionTrigger className="text-sm sm:text-base font-semibold hover:text-green-600 dark:hover:text-green-400 py-3 sm:py-4">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 dark:text-green-400" />
                Eligibility Criteria
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 sm:space-y-3">
                {scheme.eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm sm:text-base">
                    <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Required Documents */}
          <AccordionItem value="documents" className="border-green-100 dark:border-green-900/50">
            <AccordionTrigger className="text-sm sm:text-base font-semibold hover:text-green-600 dark:hover:text-green-400 py-3 sm:py-4">
              <span className="flex items-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 dark:text-green-400" />
                Required Documents
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 sm:space-y-3">
                {scheme.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm sm:text-base">
                    <span className="text-green-600 dark:text-green-400">•</span>
                    <span className="text-slate-700 dark:text-slate-300">{doc}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Additional Info */}
          <AccordionItem value="info" className="border-green-100 dark:border-green-900/50">
            <AccordionTrigger className="text-sm sm:text-base font-semibold hover:text-green-600 dark:hover:text-green-400 py-3 sm:py-4">
              <span className="flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 dark:text-green-400" />
                More Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 sm:space-y-4">
              {scheme.ageLimit && (
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 text-sm sm:text-base">Age Limit</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">{scheme.ageLimit}</p>
                </div>
              )}
              {scheme.incomeLimit && (
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 text-sm sm:text-base">Income Limit</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">{scheme.incomeLimit}</p>
                </div>
              )}
              {scheme.community && (
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 text-sm sm:text-base">Target Communities</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">{scheme.community.join(', ')}</p>
                </div>
              )}
              {scheme.specialNotes && (
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 text-sm sm:text-base">Special Notes</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">{scheme.specialNotes}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Application Button */}
        <div className="pt-3 sm:pt-4 border-t border-green-100 dark:border-green-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
              <span className="font-medium">Portal:</span> {portalDisplayName}
            </p>
            {portalUrl && (
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 w-full sm:w-auto text-sm sm:text-base"
              >
                <a href={portalUrl} target="_blank" rel="noopener noreferrer">
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
