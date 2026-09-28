import { useState } from 'react';
import { TextField, Paper, Typography, Card, CardContent, CardActions, Button, Chip, InputAdornment, Grid, Box } from '@mui/material';
import { Search, BookOpen, Users, Clock, TrendingUp, FileText, Plus, ArrowRight } from 'lucide-react';

interface ClassCard {
  id: string;
  code: string;
  title: string;
  term: string;
  students: number;
  status: 'active' | 'archived' | 'draft';
  lastUpdated: string;
}

const SAMPLE_CLASSES: ClassCard[] = [
  {
    id: '1',
    code: 'CS101',
    title: 'Introduction to Programming',
    term: '1st Semester 2025-2026',
    students: 45,
    status: 'active',
    lastUpdated: '2026-05-05'
  },
  {
    id: '2',
    code: 'CS201',
    title: 'Data Structures and Algorithms',
    term: '1st Semester 2025-2026',
    students: 38,
    status: 'active',
    lastUpdated: '2026-05-03'
  },
  {
    id: '3',
    code: 'CS301',
    title: 'Database Management Systems',
    term: '1st Semester 2025-2026',
    students: 42,
    status: 'active',
    lastUpdated: '2026-05-01'
  },
  {
    id: '4',
    code: 'CS401',
    title: 'Software Engineering',
    term: '1st Semester 2025-2026',
    students: 35,
    status: 'draft',
    lastUpdated: '2026-04-28'
  },
  {
    id: '5',
    code: 'CS205',
    title: 'Web Development',
    term: '2nd Semester 2024-2025',
    students: 50,
    status: 'archived',
    lastUpdated: '2026-03-15'
  },
  {
    id: '6',
    code: 'CS305',
    title: 'Computer Networks',
    term: '1st Semester 2025-2026',
    students: 40,
    status: 'active',
    lastUpdated: '2026-05-04'
  }
];

const SAMPLE_SEARCH_RESULTS = [
  'Introduction to Python Programming - Week 3 Module',
  'Database Normalization Presentation - CS301',
  'Algorithm Analysis Research Paper - Dr. Santos',
  'Web Development Best Practices - Syllabus 2024',
  'Machine Learning Fundamentals - Thesis Repository'
];

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      setTimeout(() => {
        setSearchResults(
          SAMPLE_SEARCH_RESULTS.filter(result =>
            result.toLowerCase().includes(query.toLowerCase())
          )
        );
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Welcome back, Dr. Dela Cruz
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            IknowVate - Smart Assisted Knowledge Management System
          </Typography>
        </div>

        <Paper elevation={3} className="p-6 mb-8 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-blue-600" />
            <Typography variant="h6" className="font-semibold text-gray-800">
              Semantic Search
            </Typography>
          </div>
          <TextField
            fullWidth
            placeholder="Search for syllabi, modules, research papers, or course materials..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-5 h-5 text-gray-400" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {searchResults.length > 0 && (
            <Box className="mt-4">
              <Typography variant="subtitle2" className="text-gray-600 mb-2">
                Found {searchResults.length} results:
              </Typography>
              {searchResults.map((result, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  className="p-3 mb-2 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <Typography variant="body2">{result}</Typography>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Paper>
              ))}
              <Button
                variant="text"
                size="small"
                onClick={() => onNavigate('search')}
                className="mt-2"
              >
                View all results
              </Button>
            </Box>
          )}

          {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
            <Typography variant="body2" className="text-gray-500 text-center py-4">
              No results found for "{searchQuery}"
            </Typography>
          )}

          {isSearching && (
            <Typography variant="body2" className="text-gray-500 text-center py-4">
              Searching...
            </Typography>
          )}
        </Paper>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="font-bold text-blue-600">
                    6
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Active Classes
                  </Typography>
                </div>
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="font-bold text-green-600">
                    250
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Total Students
                  </Typography>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="font-bold text-orange-600">
                    3
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Pending Approvals
                  </Typography>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="font-bold text-purple-600">
                    42
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Documents
                  </Typography>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Typography variant="h5" className="font-bold text-gray-800">
            My Classes
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => onNavigate('create-syllabus')}
            sx={{ textTransform: 'none' }}
          >
            Create New Syllabus
          </Button>
        </div>

        <Grid container spacing={3}>
          {SAMPLE_CLASSES.map((classItem) => (
            <Grid item xs={12} md={6} lg={4} key={classItem.id}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Typography variant="h6" className="font-bold text-gray-800">
                        {classItem.code}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {classItem.title}
                      </Typography>
                    </div>
                    <Chip
                      label={classItem.status}
                      color={getStatusColor(classItem.status)}
                      size="small"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <Typography variant="caption">
                        {classItem.students} students
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <Typography variant="caption">
                        Updated {new Date(classItem.lastUpdated).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>

                  <Typography variant="caption" className="block mt-3 text-gray-500">
                    {classItem.term}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => onNavigate('create-syllabus')}>
                    View Details
                  </Button>
                  <Button size="small" color="primary">
                    Manage
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
