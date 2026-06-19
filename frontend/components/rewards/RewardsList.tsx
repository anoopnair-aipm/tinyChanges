'use client';

interface Reward {
  id: string;
  name: string;
  description?: string;
  pointsValue: number;
}

interface RewardsListProps {
  rewards: Reward[];
  isChild?: boolean;
  onCreateClick?: () => void;
  onRedeemClick?: (reward: Reward) => void;
  balances?: Record<string, number>;
}

export default function RewardsList({
  rewards,
  isChild,
  onCreateClick,
  onRedeemClick,
  balances = {},
}: RewardsListProps) {
  if (rewards.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">No rewards set up yet</p>
        {!isChild && (
          <button
            onClick={onCreateClick}
            className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
          >
            + Create First Reward
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rewards.map((reward) => {
        const balance = balances[reward.id] || 0;
        return (
          <div
            key={reward.id}
            className="p-4 bg-white border border-yellow-200 rounded-lg hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎁</span>
                  <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                  <span className="ml-auto text-sm font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                    {reward.pointsValue} pts
                  </span>
                </div>

                {reward.description && (
                  <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                )}

                {isChild && (
                  <p className="text-sm text-gray-700">
                    <strong>Balance:</strong> {balance} {balance === 1 ? 'item' : 'items'}
                  </p>
                )}
              </div>

              {isChild && balance > 0 && (
                <button
                  onClick={() => onRedeemClick?.(reward)}
                  className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition whitespace-nowrap"
                >
                  Redeem
                </button>
              )}

              {isChild && balance === 0 && (
                <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium whitespace-nowrap">
                  Locked
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
