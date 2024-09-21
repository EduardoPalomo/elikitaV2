import { PatientTable } from './PatientTable'
import { PatientStats } from './PatientStats'
import { PatientDistribution } from './PatientDistribution'
import { HealthMetrics } from './HealthMetrics'
import { ClinicalObservations } from './ClinicalObservations'

export default function PatientsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 animate-fade-in">FHIR Patient Analytics Dashboard</h1>
        <PatientTable />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
          <PatientStats />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <PatientDistribution />
          <HealthMetrics />
        </div>
        <ClinicalObservations />
      </div>
    </div>
  )
}