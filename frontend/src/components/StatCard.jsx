import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeDirection = 'up',
  loading = false,
}) {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-24 mb-4" />
        <div className="h-8 bg-gray-700 rounded w-32" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-100 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Icon className="text-cyan-400" size={24} />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          {changeDirection === 'up' ? (
            <TrendingUp className="text-green-400" size={16} />
          ) : (
            <TrendingDown className="text-red-400" size={16} />
          )}
          <span className={changeDirection === 'up' ? 'text-green-400' : 'text-red-400'}>
            {change}% from last month
          </span>
        </div>
      )}
    </div>
  );
}
