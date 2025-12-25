import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface FormData {
  name: string;
  branch: string;
  year: string;
  rollNumber: string;
  goal: string;
  language: 'EN' | 'TE';
  // Optional: user's Gmail to receive the greeting image
  email?: string;
}

interface GreetingFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const GreetingForm = ({ onSubmit, isLoading }: GreetingFormProps) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    branch: '',
    year: '',
    rollNumber: '',
    goal: '',
    language: language,
  });

  const branches = ['AIML', 'CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'ADS', 'CS', 'IOT', 'BBA', 'MBA'];
  const years = ['1', '2', '3', '4'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your full name.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.branch) {
      toast({
        title: 'Branch Required',
        description: 'Please select your branch.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.year) {
      toast({
        title: 'Year Required',
        description: 'Please select your year.',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="form" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="glass-card-strong p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold gradient-text mb-3">
              {t.form.title}
            </h2>
            <p className="text-muted-foreground">{t.form.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t.form.name} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.form.namePlaceholder}
                className="input-glass w-full"
                disabled={isLoading}
              />
            </div>

            {/* Branch & Year Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.form.branch} <span className="text-destructive">*</span>
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="input-glass w-full appearance-none cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="">{t.form.branchPlaceholder}</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch} className="bg-card text-foreground">
                      {t.branches[branch as keyof typeof t.branches]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.form.year} <span className="text-destructive">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="input-glass w-full appearance-none cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="">{t.form.yearPlaceholder}</option>
                  {years.map(year => (
                    <option key={year} value={year} className="bg-card text-foreground">
                      {t.years[year as keyof typeof t.years]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email id and Roll Number */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email id(Mandatory) and Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="Enter your Email id and Roll Number"
                className="input-glass w-full"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">Email Mandatory --Enter your email id and roll number (separate with a comma if entering both).</p>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t.form.goal}
              </label>
              <textarea
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder={t.form.goalPlaceholder}
                rows={3}
                className="input-glass w-full resize-none"
                disabled={isLoading}
              />
            </div>



            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t.form.language}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value="EN"
                    checked={formData.language === 'EN'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                    disabled={isLoading}
                  />
                  <span className="text-foreground">English</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value="TE"
                    checked={formData.language === 'TE'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                    disabled={isLoading}
                  />
                  <span className="text-foreground">తెలుగు</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-glow bg-gradient-to-r from-primary to-gold-light text-primary-foreground py-6 text-lg font-semibold rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t.form.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t.form.submit}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GreetingForm;
