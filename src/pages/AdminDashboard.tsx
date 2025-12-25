import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { LogOut, Search, Eye, Trash2, Users, Calendar, ArrowLeft, X, Download, Copy } from 'lucide-react';
import StarBackground from '@/components/StarBackground';
import rceLogo from '@/assets/rce-logo.avif';

interface Greeting {
  id: string;
  name: string;
  branch: string;
  year: string;
  enrollment_number: string | null;
  goal: string | null;
  email: string | null;
  greeting_title: string;
  greeting_body: string;
  motivational_quote: string;
  language: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [filteredGreetings, setFilteredGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  // Toggle to show only greetings missing an email
  const [showMissingEmail, setShowMissingEmail] = useState(false);
  const [selectedGreeting, setSelectedGreeting] = useState<Greeting | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const branches = ['AIML', 'CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'ADS', 'CS', 'IOT', 'BBA', 'MBA'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  useEffect(() => {
    checkAuthAndFetch();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    filterGreetings();
  }, [searchTerm, branchFilter, yearFilter, greetings]);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin');
      return;
    }

    // Check admin role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roles) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges.',
        variant: 'destructive',
      });
      await supabase.auth.signOut();
      navigate('/admin');
      return;
    }

    fetchGreetings();
  };

  const fetchGreetings = async () => {
    setLoading(true);
    
    const { data, error, count } = await supabase
      .from('greetings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch greetings.',
        variant: 'destructive',
      });
    } else {
      // Ensure `email` exists on each greeting (nullable)
      const normalized = (data || []).map((d: any) => ({ ...d, email: d.email ?? null }));
      setGreetings(normalized);
      setTotalCount(count || 0);
    }
    
    setLoading(false);
  };

  const filterGreetings = () => {
    let filtered = [...greetings];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(term) ||
        g.enrollment_number?.toLowerCase().includes(term) ||
        (g.email || '').toLowerCase().includes(term)
      );
    }

    if (branchFilter !== 'all') {
      filtered = filtered.filter(g => g.branch === branchFilter);
    }

    if (yearFilter !== 'all') {
      filtered = filtered.filter(g => g.year === yearFilter);
    }

    // If toggled, only show rows with missing or blank email
    if (showMissingEmail) {
      filtered = filtered.filter(g => !g.email || (typeof g.email === 'string' && g.email.trim() === ''));
    }

    setFilteredGreetings(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this greeting?')) return;

    const { error } = await supabase
      .from('greetings')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete greeting.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Deleted',
        description: 'Greeting has been deleted.',
      });
      fetchGreetings();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleExportCSV = () => {
    if (!filteredGreetings || filteredGreetings.length === 0) {
      toast({ title: 'No data', description: 'There are no greetings to export.', variant: 'destructive' });
      return;
    }

    const headers = [
      'id',
      'name',
      'email',
      'branch',
      'year',
      'enrollment_number',
      'goal',
      'greeting_title',
      'greeting_body',
      'motivational_quote',
      'language',
      'created_at',
    ];

    const rows = filteredGreetings.map((g) =>
      headers
        .map((h) => {
          const v = (g as any)[h];
          if (v === null || typeof v === 'undefined') return '';
          const s = String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `greetings-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast({ title: 'Exported', description: `Downloaded ${filteredGreetings.length} rows.` });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen relative">
      <StarBackground />
      
      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <header className="glass-card p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={rceLogo} alt="RCE Logo" className="w-10 h-10 rounded-full bg-white/20 p-1" />
            <div>
              <h1 className="text-xl font-display font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage greetings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/')} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>

            <Button
              variant={showMissingEmail ? 'outline' : 'ghost'}
              onClick={() => setShowMissingEmail(prev => !prev)}
              size="sm"
              className={`border-white/10 ${showMissingEmail ? 'bg-destructive/10 text-destructive' : ''}`}
            >
              {showMissingEmail ? 'Showing: Missing' : 'Filter: Missing Email'}
            </Button>

            <Button
              variant="outline"
              onClick={handleExportCSV}
              size="sm"
              className="border-white/20"
              disabled={loading || filteredGreetings.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            <Button variant="outline" onClick={handleLogout} size="sm" className="border-white/20">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCount}</p>
              <p className="text-sm text-muted-foreground">Total Greetings</p>
            </div>
          </div>
          
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-light/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gold-light" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {greetings.filter(g => {
                  const today = new Date().toDateString();
                  return new Date(g.created_at).toDateString() === today;
                }).length}
              </p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-violet/20 flex items-center justify-center">
              <Search className="w-6 h-6 text-violet" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{filteredGreetings.length}</p>
              <p className="text-sm text-muted-foreground">Filtered Results</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>
            </div>
            
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Greetings Table */}
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading greetings...</p>
            </div>
          ) : filteredGreetings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No greetings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Branch</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Year</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Language</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGreetings.map((greeting) => (
                    <tr key={greeting.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{greeting.name}</p>
                        {greeting.enrollment_number && (
                          <p className="text-xs text-muted-foreground">{greeting.enrollment_number}</p>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{greeting.branch}</td>
                      <td className="p-4 text-sm text-muted-foreground">{greeting.year}</td>
                      <td className="p-4 text-sm text-muted-foreground">{greeting.email || <span className="text-xs text-muted-foreground">—</span>}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          greeting.language === 'EN' 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-gold-light/20 text-gold-light'
                        }`}>
                          {greeting.language === 'EN' ? 'English' : 'Telugu'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{formatDate(greeting.created_at)}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedGreeting(greeting)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {/* Copy email to clipboard (if present) */}
                          {greeting.email ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(greeting.email!);
                                toast({ title: 'Copied', description: 'Email copied to clipboard.' });
                              }}
                              className="text-muted-foreground hover:text-foreground hover:bg-white/5"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          ) : null}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(greeting.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedGreeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card-strong p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedGreeting(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <img src={rceLogo} alt="RCE Logo" className="w-8 h-8 rounded-full object-contain bg-white/20" />
                <span className="text-sm text-primary font-medium">Ramachandra College of Engineering</span>
              </div>
              
              <h2 className="text-2xl font-display font-bold gradient-text mb-2">
                {selectedGreeting.greeting_title}
              </h2>
              
              <p className="text-muted-foreground">
                {selectedGreeting.branch} – {selectedGreeting.year} Student
              </p>

              {/* Email (if provided) */}
              {selectedGreeting.email && (
                <p className="text-sm mt-2">
                  <strong>Email:</strong> <a href={`mailto:${selectedGreeting.email}`} className="text-primary underline">{selectedGreeting.email}</a>
                </p>
              )}
            </div>

            <div className="mb-6 text-center">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {selectedGreeting.greeting_body}
              </p>
            </div>

            <div className="glass-card p-6 mb-6">
              <div className="text-4xl text-primary/30 font-serif absolute -mt-4">"</div>
              <p className="text-center text-foreground italic pl-8 pr-8">
                {selectedGreeting.motivational_quote}
              </p>
            </div>

            {selectedGreeting.goal && (
              <div className="text-sm text-muted-foreground">
                <strong>Goal for 2026:</strong> {selectedGreeting.goal}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
