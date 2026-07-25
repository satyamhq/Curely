export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  return <div className="p-8"><h1 className="text-2xl font-bold">Medicine</h1><p className="mt-2 text-muted-foreground">ID: {params.id} — In Phase 7.</p></div>
}
