import { DoctorCard } from '@/components/shared/DoctorCard'

interface DoctorRecommendationsProps {
  speciality: string
  doctors: any[]
}

export function DoctorRecommendations({ speciality, doctors }: DoctorRecommendationsProps) {
  if (doctors.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Top Recommended {speciality} Doctors</h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  )
}
