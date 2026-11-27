import { Paper, Typography, Card, CardContent, Chip, Button, Avatar, Box } from '@mui/material';
import { Lightbulb, TrendingUp, FileText, Users, Star, ArrowRight } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'document' | 'course' | 'resource' | 'collaboration';
  title: string;
  description: string;
  reason: string;
  relevance: number;
  tags: string[];
}

const SAMPLE_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    type: 'document',
    title: 'Advanced Algorithm Analysis Research Paper',
    description: 'Based on your interest in Data Structures, this research explores advanced time complexity analysis techniques.',
    reason: 'Similar to your recent searches on algorithm optimization',
    relevance: 95,
    tags: ['Algorithms', 'Research', 'CS201']
  },
  {
    id: '2',
    type: 'course',
    title: 'Machine Learning Fundamentals Module',
    description: 'Recommended course material for faculty teaching AI-related subjects.',
    reason: 'Aligns with your teaching profile in Computer Science',
    relevance: 88,
    tags: ['Machine Learning', 'AI', 'Module']
  },
  {
    id: '3',
    type: 'resource',
    title: 'Database Design Best Practices Presentation',
    description: 'Updated presentation with modern database design patterns and normalization techniques.',
    reason: 'Frequently accessed by faculty teaching CS301',
    relevance: 82,
    tags: ['Database', 'Design', 'Best Practices']
  },
  {
    id: '4',
    type: 'collaboration',
    title: 'Prof. Maria Santos - Data Structures Collaboration',
    description: 'Prof. Santos recently updated her CS201 syllabus with new assessment techniques.',
    reason: 'Teaching similar courses this semester',
    relevance: 90,
    tags: ['Collaboration', 'CS201', 'Faculty']
  },
  {
    id: '5',
    type: 'document',
    title: 'Web Security Implementation Guide',
    description: 'Comprehensive guide on implementing security best practices in web applications.',
    reason: 'Related to your Web Development course materials',
    relevance: 75,
    tags: ['Security', 'Web Development', 'Guide']
  },
  {
    id: '6',
    type: 'resource',
    title: 'Python Programming Exercise Bank',
    description: 'Collection of 100+ programming exercises for introductory courses.',
    reason: 'Perfect for CS101 assignments and assessments',
    relevance: 92,
    tags: ['Python', 'Programming', 'Exercises']
  }
];

export default function Recommendations() {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'document':
        return { icon: FileText, color: '#3b82f6', label: 'Document' };
      case 'course':
        return { icon: TrendingUp, color: '#10b981', label: 'Course Material' };
      case 'resource':
        return { icon: Star, color: '#f59e0b', label: 'Resource' };
      case 'collaboration':
        return { icon: Users, color: '#8b5cf6', label: 'Collaboration' };
      default:
        return { icon: FileText, color: '#6b7280', label: 'Unknown' };
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-8 h-8 text-blue-600" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Intelligent Recommendations
            </Typography>
          </div>
          <Typography variant="body2" className="text-gray-600">
            AI-powered suggestions based on your profile, search behavior, and coursework
          </Typography>
        </div>

        <Paper elevation={2} className="p-6 mb-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="w-8 h-8" />
            <Typography variant="h6" className="font-bold">
              Personalized for You
            </Typography>
          </div>
          <Typography variant="body2" className="mb-4">
            These recommendations are tailored based on your teaching subjects, recent activity,
            and what other faculty members with similar profiles are accessing.
          </Typography>
          <div className="flex gap-2">
            <Chip
              label="6 Active Courses"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              label="42 Documents Accessed"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              label="Computer Science Focus"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </div>
        </Paper>

        <div className="space-y-4">
          {SAMPLE_RECOMMENDATIONS.map((rec) => {
            const config = getTypeConfig(rec.type);
            const RecommendationIcon = config.icon;

            return (
              <Card key={rec.id} elevation={2} className="hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar
                      sx={{
                        bgcolor: config.color,
                        width: 48,
                        height: 48
                      }}
                    >
                      <RecommendationIcon className="w-6 h-6" />
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Typography variant="h6" className="font-semibold text-gray-800">
                            {rec.title}
                          </Typography>
                          <Chip
                            label={config.label}
                            size="small"
                            sx={{
                              bgcolor: config.color,
                              color: 'white',
                              fontWeight: 500,
                              mt: 0.5
                            }}
                          />
                        </div>
                        <Box className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <Typography variant="body2" className="font-semibold text-gray-700">
                            {rec.relevance}%
                          </Typography>
                        </Box>
                      </div>

                      <Typography variant="body2" className="text-gray-700 mb-3">
                        {rec.description}
                      </Typography>

                      <Box className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                          <Typography variant="caption" className="text-blue-800">
                            <strong>Why this is recommended:</strong> {rec.reason}
                          </Typography>
                        </div>
                      </Box>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {rec.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </div>

                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<ArrowRight className="w-4 h-4" />}
                          sx={{ textTransform: 'none' }}
                        >
                          View Resource
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Paper className="p-8 text-center mt-8">
          <Typography variant="body2" className="text-gray-600">
            Recommendations update daily based on your activity and new content in the repository.
          </Typography>
        </Paper>
      </div>
    </div>
  );
}
