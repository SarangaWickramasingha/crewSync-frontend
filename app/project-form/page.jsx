'use client'

import { useState } from 'react'
import Navbar from '@/Components/layout/Navbar'

export default function StartProjectPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [budget, setBudget] = useState('')

  const [formData, setFormData] = useState({
    projName: '',
    projStartDate: '',
    projEndDate: '',
    projDistrict: '',
    projAddress: '',
    phases: [],
    agreeTerms: false
  })

  const today = new Date().toISOString().split('T')[0]

  const districts = [
    'Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya',
    'Galle','Matara','Hambantota','Jaffna','Kilinochchi','Mannar',
    'Vavuniya','Mullaitivu','Batticaloa','Ampara','Trincomalee',
    'Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla',
    'Monaragala','Ratnapura','Kegalle'
  ]

  const phasesList = [
    { order: 1,  name: 'Architectural Design',     desc: 'House planning, blueprints, structural drawings and approvals' },
    { order: 2,  name: 'Site Preparation',         desc: 'Land clearing, excavation, soil testing and levelling' },
    { order: 3,  name: 'Foundation',               desc: 'Footings, foundation walls and base structure' },
    { order: 4,  name: 'Wall Structure',           desc: 'Brickwork, columns, beams and structural frame' },
    { order: 5,  name: 'Slab',                     desc: 'Ground floor and upper floor concrete slab work' },
    { order: 6,  name: 'Roofing',                  desc: 'Roof frame, tiles, sheets and waterproofing' },
    { order: 7,  name: 'Ceiling',                  desc: 'False ceiling, board installation and finishing' },
    { order: 8,  name: 'Flooring',                 desc: 'Sub-floor preparation and floor base installation' },
    { order: 9,  name: 'Doors & Windows',          desc: 'Door frames, window frames, shutters and fittings' },
    { order: 10, name: 'Electrical',               desc: 'Wiring, conduits, distribution panels and fixtures' },
    { order: 11, name: 'Plumbing',                 desc: 'Water supply, drainage and sanitary fittings' },
    { order: 12, name: 'Wall & Ceiling Plastering',desc: 'Internal and external plastering work' },
    { order: 13, name: 'Tiling',                   desc: 'Floor and wall tile laying and grouting' },
    { order: 14, name: 'Painting',                 desc: 'Interior and exterior painting and finishing coats' },
    { order: 15, name: 'Boundary Wall & Gate',     desc: 'Perimeter wall construction and gate installation' },
    { order: 16, name: 'Landscaping',              desc: 'Driveway, garden, paving and outdoor finishing' },
    { order: 17, name: 'Other',                    desc: 'Any custom or additional task not listed above — rename from the timeline' },
  ]

  const fmt = (n) => {
    const num = parseInt(n) || 0
    if (num >= 1000000) return (num/1000000).toFixed(1).replace(/\.0$/,'') + 'M'
    if (num >= 1000) return (num/1000).toFixed(0) + 'K'
    return num.toLocaleString()
  }

  const fmtDate = (d) => {
    if (!d) return '—'
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
  }

  const togglePhase = (name) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.includes(name)
        ? prev.phases.filter(p => p !== name)
        : [...prev.phases, name]
    }))
  }

  const validate = () => {
    if (!formData.projName.trim()) return 'Please enter a project name.'
    if (!formData.projDistrict) return 'Please select your project district.'
    if (!formData.projAddress.trim()) return 'Please enter the site address.'
    if (formData.phases.length === 0) return 'Please select at least one task.'
    if (!formData.projStartDate) return 'Please enter a planned start date.'
    if (!formData.projEndDate) return 'Please enter a target completion date.'
    if (new Date(formData.projEndDate) <= new Date(formData.projStartDate)) return 'Target completion date must be after the start date.'
    if (!budget || Number(budget) <= 0) return 'Please enter a valid estimated budget.'
    if (!formData.agreeTerms) return 'Please agree to the Terms of Service to continue.'
    return null
  }

  const nextStep = () => {
    setError('')
    if (currentPage === 1) {
      const err = validate()
      if (err) {
        setError(err)
        return
      }
      setCurrentPage(2)
    } else {
      submitProject()
    }
  }

  const goBack = () => {
    setError('')
    setCurrentPage(1)
  }

  const submitProject = async () => {
    setError('')
    setSuccess(false)
    setSubmitting(true)

    try {
      const res = await fetch("http://localhost/CrewSync/backend/index.php/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.projName,
          total_budget: budget,
          start_date: formData.projStartDate,
          end_date: formData.projEndDate,
          district: formData.projDistrict,
          address: formData.projAddress,
          status: 'planning',
          tasks: formData.phases
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = `/dashboard/propertyowner/timeline?project_id=${data.project_id}`;
        }, 2000);
      } else {
        setError(data.message || "Failed to create project. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1A1D23] flex flex-col">
      <Navbar variant="projectForm" />

      {/* WRAPPER */}
      <div className="flex-1 flex items-start justify-center py-10 px-4 pb-16 relative overflow-hidden">
        <div className="absolute -top-[100px] -right-[120px] w-[500px] h-[500px] pointer-events-none" style={{background: 'radial-gradient(circle, rgba(232,130,12,0.08) 0%, transparent 65%)'}}></div>
        <div className="absolute -bottom-[80px] -left-[80px] w-[400px] h-[400px] pointer-events-none" style={{background: 'radial-gradient(circle, rgba(27,110,58,0.06) 0%, transparent 65%)'}}></div>

        <div className="flex gap-8 w-full max-w-[960px] items-start max-lg:flex-col">

          {/* LEFT PANEL */}
          <aside className="w-[240px] shrink-0 sticky top-[80px] max-lg:w-full max-lg:static">
            <div className="font-[Syne] text-[1.6rem] font-extrabold text-[#E8820C] tracking-[-0.5px] mb-1">
              Crew<span className="text-[#1A1D23]">Sync</span>
            </div>
            <div className="text-[0.88rem] text-[#8A8FA8] mb-6 leading-[1.5]">
              Set up your construction project in minutes. Get matched with verified crews and suppliers.
            </div>

            {/* STEPS */}
            <div className="flex flex-col gap-0 mb-[1.8rem]">
              {[1,2].map(i => (
                <div key={i} className="flex gap-3 items-start relative">
                  {i < 2 && (
                    <div
                      className={`absolute left-[13px] top-7 w-0.5 z-0 h-[calc(100%+2px)] ${
                        currentPage > i ? 'bg-[#E8820C]' : 'bg-[rgba(26,29,35,0.1)]'
                      }`}
                    ></div>
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.72rem] font-bold border-2 z-10 relative transition-all ${
                    currentPage === i ? 'bg-[#E8820C] border-[#E8820C] text-white' :
                    currentPage > i  ? 'bg-[#E8820C] border-[#E8820C] text-white' :
                    'bg-white border-[rgba(26,29,35,0.1)] text-[#8A8FA8]'
                  }`}>
                    {currentPage > i ? '✓' : i}
                  </div>
                  <div className="pb-[22px] pt-1">
                    <div className={`text-[0.8rem] font-semibold leading-none ${
                      currentPage === i ? 'text-[#B85A00]' :
                      currentPage > i  ? 'text-[#4A5068]' : 'text-[#8A8FA8]'
                    }`}>
                      {i === 1 ? 'Project Details' : 'Review & Submit'}
                    </div>
                    <div className="text-[0.72rem] text-[#8A8FA8] mt-[3px]">
                      {i === 1 ? 'Name, location, tasks, dates, budget' : 'Confirm & go live'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[rgba(26,29,35,0.1)] rounded-[10px] p-[14px] text-[0.77rem] text-[#4A5068] leading-[1.5]">
              <strong className="block text-[0.8rem] text-[#1A1D23] mb-1">💡 Tip</strong>
              The more detail you provide, the faster service providers and suppliers can respond to your project.
            </div>
          </aside>

          {/* FORM CARD */}
          <div className="flex-1 bg-white border border-[rgba(26,29,35,0.1)] rounded-[12px] shadow-[0_2px_16px_rgba(26,29,35,0.08)] overflow-hidden">

            {/* PROGRESS */}
            <div className="h-1 bg-[#EEECEA]">
              <div className="h-full bg-[#E8820C] transition-[width] duration-400 rounded-r" style={{width: currentPage === 1 ? '50%' : '100%'}}></div>
            </div>

            {/* CARD HEADER */}
            <div className="p-6 px-8 border-b border-[rgba(26,29,35,0.1)] flex items-center justify-between">
              <div>
                <h2 className="text-[1.15rem] font-bold">
                  {currentPage === 1 ? 'Project Details' : 'Review & Submit'}
                </h2>
                <p className="text-[0.8rem] text-[#8A8FA8] mt-0.5">
                  {currentPage === 1 ? 'Fill in everything about your project' : 'Confirm your project details before going live'}
                </p>
              </div>
              <span className="bg-[#FFF3E0] text-[#B85A00] text-[0.72rem] font-bold py-1 px-3 rounded-[20px] whitespace-nowrap">
                Step {currentPage} of 2
              </span>
            </div>

            <div className="p-8">
              {error && (
                <div className="bg-[#FDECEA] text-[#C0392B] border border-[rgba(192,57,43,0.2)] rounded-[8px] p-[10px] px-[13px] text-[0.82rem] mb-5 flex items-center gap-2">
                  <span>⚠</span> {error}
                </div>
              )}

              {success && (
                <div className="bg-[#E6F4EC] text-[#1B6E3A] border border-[rgba(27,110,58,0.2)] rounded-[8px] p-[10px] px-[13px] text-[0.82rem] mb-5 flex items-center gap-2">
                  <span>✓</span> Project created successfully! Redirecting to owner dashboard...
                </div>
              )}

              {/* PAGE 1 */}
               {currentPage === 1 && (
                <div className="animate-[fadeIn_0.25s_ease]">

                  {/* Project Basics */}
                  <div className="mb-[1.8rem]">
                    <div className="font-[Syne] text-[0.82rem] font-bold text-[#1A1D23] uppercase tracking-[0.8px] mb-4 pb-2 border-b border-[rgba(26,29,35,0.1)] flex items-center gap-2">
                      <img src="/icons/project-form/basics.png" alt="Basics" className="h-4.5 w-4.5 object-contain" /> Project Basics
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                      <div className="flex flex-col gap-[5px] col-span-2">
                        <label className="text-[0.73rem] font-semibold text-[#4A5068] uppercase tracking-[0.3px]">Project Name <span className="text-[#C0392B] ml-0.5">*</span></label>
                        <input
                          className="p-[10px] px-[13px] border border-[rgba(26,29,35,0.1)] rounded-[8px] font-[DM_Sans] text-[0.88rem] text-[#1A1D23] bg-white outline-none transition focus:border-[#E8820C] focus:shadow-[0_0_0_3px_rgba(232,130,12,0.1)] placeholder:text-[#8A8FA8]"
                          type="text"
                          placeholder="e.g. My House Build – Kandy"
                          value={formData.projName}
                          onChange={e => setFormData({...formData, projName: e.target.value})}
                          disabled={submitting || success}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location (District & Site Address) */}
                  <div className="mb-[1.8rem]">
                    <div className="font-[Syne] text-[0.82rem] font-bold text-[#1A1D23] uppercase tracking-[0.8px] mb-4 pb-2 border-b border-[rgba(26,29,35,0.1)] flex items-center gap-2">
                      <img src="/icons/project-form/location.png" alt="Location" className="h-4.5 w-4.5 object-contain" /> Location
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                      <div className="flex flex-col gap-[5px] col-span-2">
                        <label className="text-[0.73rem] font-semibold text-[#4A5068] uppercase tracking-[0.3px]">District <span className="text-[#C0392B] ml-0.5">*</span></label>
                        <select
                          className="p-[10px] px-[13px] border border-[rgba(26,29,35,0.1)] rounded-[8px] font-[DM_Sans] text-[0.88rem] text-[#1A1D23] bg-white outline-none transition focus:border-[#E8820C] focus:shadow-[0_0_0_3px_rgba(232,130,12,0.1)] cursor-pointer"
                          value={formData.projDistrict}
                          onChange={e => setFormData({...formData, projDistrict: e.target.value})}
                          disabled={submitting || success}
                        >
                          <option value="">Select district</option>
                          {districts.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-[5px] col-span-2">
                        <label className="text-[0.73rem] font-semibold text-[#4A5068] uppercase tracking-[0.3px]">Site Address <span className="text-[#C0392B] ml-0.5">*</span></label>
                        <input
                          className="p-[10px] px-[13px] border border-[rgba(26,29,35,0.1)] rounded-[8px] font-[DM_Sans] text-[0.88rem] text-[#1A1D23] bg-white outline-none transition focus:border-[#E8820C] focus:shadow-[0_0_0_3px_rgba(232,130,12,0.1)] placeholder:text-[#8A8FA8]"
                          type="text"
                          placeholder="e.g. No. 12, Rajapihilla Road, Kandy"
                          value={formData.projAddress}
                          onChange={e => setFormData({...formData, projAddress: e.target.value})}
                          disabled={submitting || success}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Selected Tasks */}
                  <div className="mb-[1.8rem]">
                    <div className="font-[Syne] text-[0.82rem] font-bold text-[#1A1D23] uppercase tracking-[0.8px] mb-4 pb-2 border-b border-[rgba(26,29,35,0.1)] flex items-center gap-2">
                      <img src="/icons/project-form/tasks.png" alt="Tasks" className="h-4.5 w-4.5 object-contain" /> Associated Project Tasks <span className="text-[0.72rem] font-normal tracking-normal normal-case text-[#8A8FA8] font-[DM_Sans]">— select all that apply <span className="text-[#C0392B]">*</span></span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {phasesList.map(phase => (
                        <label key={phase.name} className={`flex items-start gap-3 border rounded-[10px] p-3 px-[14px] cursor-pointer transition-all ${formData.phases.includes(phase.name) ? 'bg-[#FFF3E0] border-[rgba(232,130,12,0.4)]' : 'bg-[#F7F6F2] border-[rgba(26,29,35,0.1)]'}`}>
                          <span className="w-6 h-6 rounded-full bg-[#E8820C] text-white text-[0.72rem] font-bold flex items-center justify-center shrink-0 mt-0.5">{phase.order}</span>
                          <input type="checkbox" checked={formData.phases.includes(phase.name)} onChange={() => togglePhase(phase.name)} className="w-4 h-4 accent-[#E8820C] cursor-pointer mt-0.5 shrink-0" disabled={submitting || success} />
                          <div className="flex-1">
                            <div className="text-[0.85rem] font-semibold text-[#1A1D23] flex items-center gap-2">
                              {phase.name}
                            </div>
                            <div className="text-[0.73rem] text-[#8A8FA8] mt-0.5">{phase.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mb-[1.8rem]">
                    <div className="font-[Syne] text-[0.82rem] font-bold text-[#1A1D23] uppercase tracking-[0.8px] mb-4 pb-2 border-b border-[rgba(26,29,35,0.1)] flex items-center gap-2">
                      <img src="/icons/timeline.png" alt="Timeline" className="h-4.5 w-4.5 object-contain" /> Project Timeline
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                      <div className="flex flex-col gap-[5px]">
                        <label className="text-[0.73rem] font-semibold text-[#4A5068] uppercase tracking-[0.3px]">Start Date <span className="text-[#C0392B] ml-0.5">*</span></label>
                        <input
                          className="p-[10px] px-[13px] border border-[rgba(26,29,35,0.1)] rounded-[8px] font-[DM_Sans] text-[0.88rem] text-[#1A1D23] bg-white outline-none transition focus:border-[#E8820C] focus:shadow-[0_0_0_3px_rgba(232,130,12,0.1)] w-full"
                          type="date"
                          min={today}
                          value={formData.projStartDate}
                          onChange={e => setFormData({...formData, projStartDate: e.target.value})}
                          disabled={submitting || success}
                        />
                      </div>
                      <div className="flex flex-col gap-[5px]">
                        <label className="text-[0.73rem] font-semibold text-[#4A5068] uppercase tracking-[0.3px]">Target Completion Date <span className="text-[#C0392B] ml-0.5">*</span></label>
                        <input
                          className="p-[10px] px-[13px] border border-[rgba(26,29,35,0.1)] rounded-[8px] font-[DM_Sans] text-[0.88rem] text-[#1A1D23] bg-white outline-none transition focus:border-[#E8820C] focus:shadow-[0_0_0_3px_rgba(232,130,12,0.1)] w-full"
                          type="date"
                          min={today}
                          value={formData.projEndDate}
                          onChange={e => setFormData({...formData, projEndDate: e.target.value})}
                          disabled={submitting || success}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="mb-[1.8rem]">
                    <div className="font-[Syne] text-[0.82rem] font-bold text-[#1A1D23] uppercase tracking-[0.8px] mb-4 pb-2 border-b border-[rgba(26,29,35,0.1)] flex items-center gap-2">
                      <img src="/icons/project-form/budget.png" alt="Budget" className="h-4.5 w-4.5 object-contain" /> Estimated Budget
                    </div>
                    <div className="bg-[#1A1D23] text-white rounded-[10px] p-4 px-[18px] flex items-center justify-between mb-4">
                      <div>
                        <div className="text-[0.72rem] text-white/50 uppercase tracking-[0.5px]">Estimated Project Budget</div>
                        <div className="font-[Syne] text-[1.6rem] font-bold text-[#E8820C]">LKR {budget ? fmt(budget) : '0'}</div>
                        <div className="text-[0.75rem] text-white/45 mt-0.5">Sri Lankan Rupees</div>
                      </div>
                      <div className="text-[2rem] h-10 w-10 flex items-center justify-center bg-white/10 rounded-full p-2">
                        <img src="/icons/project-form/budget.png" alt="Budget Icon" className="h-full w-full object-contain filter invert" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-[5px]">
                      <label className="text-[0.73rem] font-semibold text-[#4A5068] uppercase tracking-[0.3px]">Estimated Budget (LKR) <span className="text-[#C0392B] ml-0.5">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[0.82rem] text-[#8A8FA8] pointer-events-none">LKR</span>
                        <input
                          className="p-[10px] px-[13px] pl-[50px] border border-[rgba(26,29,35,0.1)] rounded-[8px] font-[DM_Sans] text-[0.88rem] text-[#1A1D23] bg-white outline-none transition focus:border-[#E8820C] focus:shadow-[0_0_0_3px_rgba(232,130,12,0.1)] w-full placeholder:text-[#8A8FA8]"

                          type="number"
                          placeholder="e.g. 6500000"
                          value={budget}
                          onChange={e => setBudget(e.target.value)}
                          disabled={submitting || success}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="mb-0">
                    <label className="flex items-start gap-[10px] cursor-pointer text-[0.85rem] text-[#1A1D23] mt-2">
                      <input type="checkbox" checked={formData.agreeTerms} onChange={e => setFormData({...formData, agreeTerms: e.target.checked})} className="w-4 h-4 accent-[#E8820C] cursor-pointer mt-0.5 shrink-0" disabled={submitting || success} />
                      <div>I confirm that the project details are accurate and I agree to CrewSync's <a href="/terms" className="text-[#E8820C] font-semibold no-underline">Terms of Service</a> and <a href="/privacy" className="text-[#E8820C] font-semibold no-underline">Privacy Policy</a>. <span className="text-[#C0392B]">*</span></div>
                    </label>
                  </div>
                </div>
              )}

              {/* PAGE 2 - REVIEW */}
              {currentPage === 2 && (
                <div className="animate-[fadeIn_0.25s_ease]">
                  <div className="mb-[1.4rem]">
                    <div className="font-[Syne] text-[0.82rem] font-bold text-[#1A1D23] uppercase tracking-[0.8px] mb-4 pb-2 border-b border-[rgba(26,29,35,0.1)] flex items-center gap-2">
                      <img src="/icons/project-form/review.png" alt="Review" className="h-4.5 w-4.5 object-contain" /> Review Your Project
                    </div>
                    <p className="text-[0.84rem] text-[#8A8FA8] leading-[1.5]">Please review all details before submitting. Your project will be visible to verified service providers and suppliers immediately after submission.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-[1.4rem] max-sm:grid-cols-1">
                    {[
                      { label: 'Project Name', value: formData.projName },
                      { label: 'District', value: formData.projDistrict },
                      { label: 'Site Address', value: formData.projAddress },
                      { label: 'Start Date', value: fmtDate(formData.projStartDate) },
                      { label: 'Target Completion', value: fmtDate(formData.projEndDate) },
                      { label: 'Estimated Budget', value: 'LKR ' + fmt(budget), highlight: true }
                    ].map(item => (
                      <div key={item.label} className="bg-[#F7F6F2] rounded-[10px] p-3 px-[14px] border border-[rgba(26,29,35,0.1)]">
                        <div className="text-[0.68rem] font-semibold text-[#8A8FA8] uppercase tracking-[0.4px] mb-1">{item.label}</div>
                        <div className={`text-[0.88rem] font-semibold text-[#1A1D23] ${item.highlight ? 'text-[#B85A00]' : ''}`}>{item.value}</div>
                      </div>
                    ))}

                  </div>

                  <div className="mb-[1.4rem]">
                    <div className="font-[Syne] text-[0.82rem] font-bold text-[#1A1D23] uppercase tracking-[0.8px] mb-4 pb-2 border-b border-[rgba(26,29,35,0.1)] flex items-center gap-2">
                      <img src="/icons/project-form/tasks.png" alt="Tasks" className="h-4.5 w-4.5 object-contain" /> Selected Tasks ({formData.phases.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.phases.map(p => (
                        <span key={p} className="bg-[#E6F4EC] text-[#1B6E3A] rounded-[20px] py-1 px-3 text-[0.78rem] font-semibold inline-flex items-center gap-1">✓ {p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FORM ACTION BAR */}
            <div className="p-[1.4rem] px-8 border-t border-[rgba(26,29,35,0.1)] flex items-center justify-between bg-[#F7F6F2] gap-4 flex-wrap">
              <div className="flex gap-[10px]">
                {currentPage === 2 && !success && (
                  <button onClick={goBack} disabled={submitting} className="py-[11px] px-5 bg-transparent text-[#4A5068] border border-[rgba(26,29,35,0.1)] rounded-[8px] text-[0.88rem] font-medium cursor-pointer transition hover:bg-[#EEECEA] font-[DM_Sans] disabled:opacity-50">← Back</button>
                )}
              </div>
              <div className="text-[0.73rem] text-[#8A8FA8] max-w-[300px] leading-[1.4]">
                {currentPage === 1 ? 'Your project info is protected and shared only with verified CrewSync members.' : 'Once submitted, service providers can begin sending you proposals.'}
              </div>
              <button onClick={nextStep} disabled={submitting || success} className="py-[11px] px-7 bg-[#E8820C] text-white border-none rounded-[8px] text-[0.92rem] font-semibold cursor-pointer transition-all whitespace-nowrap hover:bg-[#B85A00] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(232,130,12,0.3)] font-[DM_Sans] disabled:opacity-50">
                {submitting ? 'Submitting...' : currentPage === 1 ? 'Review & Submit →' : 'Submit Project →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}