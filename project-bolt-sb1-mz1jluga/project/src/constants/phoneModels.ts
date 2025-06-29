export const PHONE_MODELS = [
  { value: 'iphone-15-pro-max', label: 'iPhone 15 Pro Max' },
  { value: 'iphone-15-pro', label: 'iPhone 15 Pro' },
  { value: 'iphone-15', label: 'iPhone 15' },
  { value: 'iphone-14-pro-max', label: 'iPhone 14 Pro Max' },
  { value: 'iphone-14-pro', label: 'iPhone 14 Pro' },
  { value: 'iphone-14', label: 'iPhone 14' },
  { value: 'iphone-13', label: 'iPhone 13' },
  { value: 'iphone-12', label: 'iPhone 12' },
  { value: 'iphone-11', label: 'iPhone 11' },
  { value: 'samsung-galaxy-s24-ultra', label: 'Samsung Galaxy S24 Ultra' },
  { value: 'samsung-galaxy-s24', label: 'Samsung Galaxy S24' },
  { value: 'samsung-galaxy-s23', label: 'Samsung Galaxy S23' },
  { value: 'samsung-galaxy-a54', label: 'Samsung Galaxy A54' },
  { value: 'google-pixel-8-pro', label: 'Google Pixel 8 Pro' },
  { value: 'google-pixel-8', label: 'Google Pixel 8' },
  { value: 'google-pixel-7', label: 'Google Pixel 7' },
  { value: 'oneplus-12', label: 'OnePlus 12' },
  { value: 'oneplus-11', label: 'OnePlus 11' },
  { value: 'xiaomi-14', label: 'Xiaomi 14' },
  { value: 'huawei-p60', label: 'Huawei P60' },
  { value: 'other', label: 'Other (please specify in description)' }
];

export const URGENCY_LEVELS = [
  {
    value: 'low' as const,
    label: 'Low Priority',
    description: 'Device works, minor issues',
    turnaround: '5-7 business days',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200'
  },
  {
    value: 'medium' as const,
    label: 'Medium Priority',
    description: 'Device partially functional',
    turnaround: '2-3 business days',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200'
  },
  {
    value: 'high' as const,
    label: 'High Priority',
    description: 'Device not working/urgent',
    turnaround: '24-48 hours',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  }
];