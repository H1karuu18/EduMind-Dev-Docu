import { Button, Typography, Box } from '@mui/material';
import { Check, BookOpen } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

const FREE_FEATURES = [
  '1 active AI knowledge session',
  'Up to 3 lesson plans',
  'Basic version history (last 5 commits)',
  'Public/private toggle',
  '1 collaborator per document',
];

const PRO_FEATURES = [
  'Unlimited AI knowledge sessions',
  'Unlimited lesson plans and roadmaps',
  'Full version history with diff view',
  'Up to 10 collaborators per document',
  'Clone and fork public lesson plans',
  'Pull request and merge workflow',
  'Semantic search across personal library',
  'Priority support',
];

const PRO_PLUS_FEATURES = [
  'Everything in Pro',
  'Advanced analytics (query history, version activity)',
  'Custom metadata tags per subject',
  'Early access to new features',
  'Dedicated onboarding session',
  'API access (beta)',
];

const ENTERPRISE_FEATURES = [
  'Custom domain: edumind.apc.edu.ph',
  'Faculty login via SSO (user@domain)',
  'Executive Director approval workflows',
  'Real-time compliance monitoring',
  'Cross-section delivery alignment monitor',
  'Shared activity bank and PPT bank',
  'Admin panel with full RBAC',
  'Custom institutional taxonomy',
  'Institution-level analytics dashboard',
];

function PlanCard({
  badge, badgeColor, title, price, priceNote, features, cta, ctaColor, highlight,
}: {
  badge: string; badgeColor: string; title: string; price: string; priceNote?: string;
  features: string[]; cta: string; ctaColor: string; highlight?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl p-7 flex flex-col border-2 transition-shadow hover:shadow-lg ${highlight ? 'border-[#6B46C1] shadow-md' : 'border-[#E2E8F0]'}`}>
      <div className="mb-5">
        <span
          className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider"
          style={{ backgroundColor: `${badgeColor}18`, color: badgeColor }}
        >
          {badge}
        </span>
        {highlight && (
          <span className="ml-2 inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#6B46C1] text-white uppercase tracking-wider">
            Most Popular
          </span>
        )}
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A202C', mt: 1 }}>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: badgeColor, mt: 1 }}>{price}</Typography>
        {priceNote && (
          <Typography variant="caption" sx={{ color: '#718096' }}>{priceNote}</Typography>
        )}
      </div>
      <ul className="space-y-2 flex-1 mb-6">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: badgeColor }} />
            <Typography variant="body2" sx={{ color: '#4A5568', lineHeight: 1.5 }}>{f}</Typography>
          </li>
        ))}
      </ul>
      <Button
        fullWidth
        variant={highlight ? 'contained' : 'outlined'}
        sx={{
          bgcolor: highlight ? ctaColor : 'transparent',
          color: highlight ? 'white' : ctaColor,
          borderColor: ctaColor,
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          minHeight: 44,
          '&:hover': { bgcolor: highlight ? ctaColor : `${ctaColor}12` }
        }}
      >
        {cta}
      </Button>
    </div>
  );
}

export default function PricingPage({ onNavigate }: PricingPageProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Nav */}
      <nav className="bg-[#1E3A5F] px-8 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E63946] flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'white' }}>EduMind</Typography>
        </button>
        <div className="flex gap-3">
          <Button
            variant="outlined"
            size="small"
            onClick={() => onNavigate('login')}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', textTransform: 'none', borderRadius: '8px' }}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => onNavigate('login')}
            sx={{ bgcolor: '#E63946', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#cc2f3b' } }}
          >
            Get Started Free
          </Button>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center py-14 px-8">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A202C', mb: 1 }}>
          Simple, transparent pricing
        </Typography>
        <Typography variant="body1" sx={{ color: '#718096' }}>
          Start free. Upgrade when you need more.
        </Typography>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-3 gap-6 mb-16">
          <PlanCard
            badge="Free Forever" badgeColor="#38A169" title="EduMind Free"
            price="₱0" priceNote="/ month"
            features={FREE_FEATURES}
            cta="Get Started Free" ctaColor="#38A169"
          />
          <PlanCard
            badge="Pro" badgeColor="#6B46C1" title="EduMind Pro"
            price="₱299" priceNote="/ month — or ₱2,499 / year"
            features={PRO_FEATURES}
            cta="Upgrade to Pro" ctaColor="#6B46C1"
            highlight
          />
          <PlanCard
            badge="Pro Plus" badgeColor="#2B6CB0" title="EduMind Pro Plus"
            price="₱599" priceNote="/ month — or ₱4,999 / year"
            features={PRO_PLUS_FEATURES}
            cta="Upgrade to Pro Plus" ctaColor="#2B6CB0"
          />
        </div>

        {/* Enterprise */}
        <div className="bg-[#1E3A5F] rounded-2xl p-10">
          <div className="grid grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white uppercase tracking-wider mb-4">
                Enterprise
              </span>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                EduMind Enterprise
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Bring EduMind to your institution under your own domain
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 4 }}>
                EduMind [Institution Name] — a fully governed, white-labeled knowledge management system
                for your faculty and executive directors
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: 'white', borderColor: 'rgba(255,255,255,0.4)',
                  textTransform: 'none', borderRadius: '8px', minHeight: 44, px: 3,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }}
                onClick={() => onNavigate('enterprise-login')}
              >
                Contact Us for Enterprise
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ENTERPRISE_FEATURES.map(f => (
                <div key={f} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#38A169]" />
                  <Typography variant="caption" sx={{ color: '#94a3b8', lineHeight: 1.5 }}>{f}</Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
