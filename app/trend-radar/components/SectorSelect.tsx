"use client";

interface SectorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const sectors = [
  { value: "", label: "Sektör Seçiniz" },
  { value: "moda", label: "Moda" },
  { value: "emlak", label: "Emlak" },
  { value: "egitim", label: "Eğitim" },
  { value: "teknoloji", label: "Teknoloji" },
  { value: "saglik", label: "Sağlık" },
  { value: "finans", label: "Finans" },
  { value: "oyun", label: "Oyun" },
  { value: "muzik", label: "Müzik" },
  { value: "gida", label: "Gıda" },
];

export default function SectorSelect({ value, onChange }: SectorSelectProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sektör Seçiniz
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 appearance-none cursor-pointer transition-all duration-200 hover:border-purple-300"
      >
        {sectors.map((sector) => (
          <option key={sector.value} value={sector.value}>
            {sector.label}
          </option>
        ))}
      </select>
    </div>
  );
}

