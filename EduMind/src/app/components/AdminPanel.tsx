import { useState } from 'react';
import {
  Paper, Typography, Box, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Chip, Switch, IconButton, TextField, InputAdornment
} from '@mui/material';
import { UserPlus, Search, Edit, UserX, Key } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  teachingFlag: boolean;
}

const ACCOUNTS: Account[] = [
  { id: '1', name: 'Dr. Juan Dela Cruz', role: 'Faculty', department: 'SOCIT', status: 'Active', teachingFlag: false },
  { id: '2', name: 'Dr. Maria Santos', role: 'Executive Director', department: 'SOCIT', status: 'Active', teachingFlag: true },
  { id: '3', name: 'Prof. Ana Reyes', role: 'Faculty', department: 'SOCIT', status: 'Active', teachingFlag: false },
  { id: '4', name: 'Dr. Ramon Santos', role: 'Faculty', department: 'SOCIT', status: 'Active', teachingFlag: false },
  { id: '5', name: 'Prof. Liza Cruz', role: 'Faculty', department: 'SOCIT', status: 'Active', teachingFlag: false },
  { id: '6', name: 'Dr. Jose Mendoza', role: 'Faculty', department: 'SOCIT', status: 'Inactive', teachingFlag: false },
  { id: '7', name: 'Pending Faculty 1', role: 'Faculty', department: 'SOCIT', status: 'Pending', teachingFlag: false },
  { id: '8', name: 'Admin User', role: 'System Administrator', department: 'IT', status: 'Active', teachingFlag: false },
];

const STATUS_COLORS: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  Active: 'success',
  Inactive: 'error',
  Pending: 'warning',
};

export default function AdminPanel() {
  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = accounts.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTeachingFlag = (id: string) => {
    setAccounts(prev =>
      prev.map(a => a.id === id ? { ...a, teachingFlag: !a.teachingFlag } : a)
    );
  };

  const stats = {
    total: accounts.length,
    faculty: accounts.filter(a => a.role === 'Faculty').length,
    eds: accounts.filter(a => a.role === 'Executive Director').length,
    pending: accounts.filter(a => a.status === 'Pending').length,
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <Box className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>System Administrator Panel</Typography>
            <Typography variant="body2" className="text-gray-500">Manage accounts, roles, and system settings</Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<UserPlus className="w-4 h-4" />}
            sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44 }}
          >
            Create New Account
          </Button>
        </div>
      </Box>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Summary Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Accounts', value: stats.total, color: '#3b82f6' },
            { label: 'Active Faculty', value: stats.faculty, color: '#16a34a' },
            { label: 'Active Executive Directors', value: stats.eds, color: '#7c3aed' },
            { label: 'Pending Account Requests', value: stats.pending, color: '#d97706' },
          ].map(card => (
            <Paper key={card.label} sx={{ borderRadius: '8px', p: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: card.color }}>{card.value}</Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">{card.label}</Typography>
            </Paper>
          ))}
        </div>

        {/* Search */}
        <Box className="mb-4">
          <TextField
            size="small"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-4 h-4 text-gray-400" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 320 }}
          />
        </Box>

        {/* Accounts Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Teaching Flag</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(account => (
                <TableRow key={account.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{account.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{account.role}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{account.department}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={account.status}
                      size="small"
                      color={STATUS_COLORS[account.status] || 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {account.role === 'Executive Director' ? (
                      <Switch
                        checked={account.teachingFlag}
                        onChange={() => toggleTeachingFlag(account.id)}
                        size="small"
                      />
                    ) : (
                      <Typography variant="caption" className="text-gray-300">—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-1 justify-center">
                      <IconButton size="small" title="Edit" sx={{ minHeight: 44, borderRadius: '8px' }}>
                        <Edit className="w-4 h-4 text-blue-500" />
                      </IconButton>
                      <IconButton size="small" title="Deactivate" sx={{ minHeight: 44, borderRadius: '8px' }}>
                        <UserX className="w-4 h-4 text-red-500" />
                      </IconButton>
                      <IconButton size="small" title="Reset Password" sx={{ minHeight: 44, borderRadius: '8px' }}>
                        <Key className="w-4 h-4 text-gray-500" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
