import { useState } from 'react';
import { Paper, Typography, TextField, InputAdornment, Tabs, Tab, Box, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import { Search, FolderOpen, FileText, Download, Eye, MoreVertical, Filter } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'syllabus' | 'module' | 'thesis' | 'research' | 'presentation';
  department: string;
  author: string;
  uploadDate: string;
  fileType: 'PDF' | 'DOCX' | 'PPTX';
  size: string;
  tags: string[];
}

const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Introduction to Programming Syllabus',
    type: 'syllabus',
    department: 'Computer Science',
    author: 'Dr. Juan Dela Cruz',
    uploadDate: '2026-05-05',
    fileType: 'PDF',
    size: '245 KB',
    tags: ['CS101', 'Programming', 'Fundamentals']
  },
  {
    id: '2',
    title: 'Data Structures Week 3 Module',
    type: 'module',
    department: 'Computer Science',
    author: 'Prof. Maria Santos',
    uploadDate: '2026-05-03',
    fileType: 'DOCX',
    size: '1.2 MB',
    tags: ['CS201', 'Data Structures', 'Algorithms']
  },
  {
    id: '3',
    title: 'Machine Learning Applications Research',
    type: 'research',
    department: 'Computer Science',
    author: 'Dr. Pedro Reyes',
    uploadDate: '2026-04-28',
    fileType: 'PDF',
    size: '3.4 MB',
    tags: ['ML', 'AI', 'Research']
  },
  {
    id: '4',
    title: 'Database Design Presentation',
    type: 'presentation',
    department: 'Computer Science',
    author: 'Dr. Ana Garcia',
    uploadDate: '2026-05-01',
    fileType: 'PPTX',
    size: '5.6 MB',
    tags: ['CS301', 'Database', 'SQL']
  },
  {
    id: '5',
    title: 'Web Security Best Practices Thesis',
    type: 'thesis',
    department: 'Computer Science',
    author: 'John Doe',
    uploadDate: '2026-04-15',
    fileType: 'PDF',
    size: '8.9 MB',
    tags: ['Security', 'Web Development', 'Thesis']
  },
  {
    id: '6',
    title: 'Software Engineering Syllabus 2026',
    type: 'syllabus',
    department: 'Computer Science',
    author: 'Dr. Juan Dela Cruz',
    uploadDate: '2026-04-20',
    fileType: 'PDF',
    size: '320 KB',
    tags: ['CS401', 'Software Engineering']
  }
];

export default function DocumentRepository() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, docId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoc(docId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoc(null);
  };

  const filteredDocuments = SAMPLE_DOCUMENTS.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedTab === 0) return matchesSearch;

    const types = ['syllabus', 'module', 'thesis', 'research', 'presentation'];
    return matchesSearch && doc.type === types[selectedTab - 1];
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'syllabus': return '#3b82f6';
      case 'module': return '#10b981';
      case 'thesis': return '#8b5cf6';
      case 'research': return '#f59e0b';
      case 'presentation': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getFileIcon = (fileType: string) => {
    return <FileText className="w-10 h-10" style={{ color: getTypeColor('module') }} />;
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-8 h-8 text-blue-600" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Document Repository
            </Typography>
          </div>
          <Typography variant="body2" className="text-gray-600">
            Centralized library for syllabi, modules, research papers, and institutional documents
          </Typography>
        </div>

        <Paper elevation={2} className="mb-6">
          <Box className="p-4">
            <TextField
              fullWidth
              placeholder="Search by title, author, tags, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="w-5 h-5 text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <Filter className="w-5 h-5" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Documents" />
            <Tab label="Syllabi" />
            <Tab label="Modules" />
            <Tab label="Theses" />
            <Tab label="Research" />
            <Tab label="Presentations" />
          </Tabs>
        </Paper>

        <div className="grid gap-4">
          {filteredDocuments.map((doc) => (
            <Paper key={doc.id} elevation={1} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Typography variant="h6" className="font-semibold text-gray-800">
                        {doc.title}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        by {doc.author} • {doc.department}
                      </Typography>
                    </div>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, doc.id)}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </IconButton>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <span>{doc.fileType}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Chip
                      label={doc.type}
                      size="small"
                      sx={{
                        bgcolor: getTypeColor(doc.type),
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                    {doc.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <IconButton size="small" color="primary">
                    <Eye className="w-5 h-5" />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <Download className="w-5 h-5" />
                  </IconButton>
                </div>
              </div>
            </Paper>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Paper className="p-12 text-center">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              No documents found
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              Try adjusting your search or filter criteria
            </Typography>
          </Paper>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Eye className="w-4 h-4 mr-2" />
            View Document
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <FileText className="w-4 h-4 mr-2" />
            View Metadata
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
