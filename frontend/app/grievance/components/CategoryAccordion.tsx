"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type Subcategory = {
  id: string;
  title: string;
  scheme_code: string;
  form_template: string;
};

type Category = {
  id: string;
  title: string;
  department_id: string;
  icon: string;
  subcategories: Subcategory[];
};

type CategoryAccordionProps = {
  categories: Category[];
  onSelect: (category: Category, subcategory: Subcategory) => void;
  selectedSubcategory: string | null;
};

export default function CategoryAccordion({
  categories,
  onSelect,
  selectedSubcategory,
}: CategoryAccordionProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-lg overflow-hidden border border-green-200"
        >
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full flex items-center justify-between px-5 py-4 bg-green-100 hover:bg-green-200 transition-colors"
            aria-expanded={openCategory === category.id}
            aria-controls={`category-${category.id}`}
          >
            <span className="font-semibold text-gray-800">{category.title}</span>
            {openCategory === category.id ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Subcategories */}
          {openCategory === category.id && (
            <div
              id={`category-${category.id}`}
              className="bg-white"
              role="region"
            >
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelect(category, sub)}
                  className={`w-full text-left px-6 py-3 border-t border-gray-100 hover:bg-green-50 transition-colors ${
                    selectedSubcategory === sub.id
                      ? "bg-green-100 border-l-4 border-l-green-600"
                      : ""
                  }`}
                  aria-selected={selectedSubcategory === sub.id}
                >
                  <span className="text-gray-700">{sub.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}