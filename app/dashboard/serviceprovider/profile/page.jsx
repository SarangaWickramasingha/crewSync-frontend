"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useProfile,
  useUpdateProfile,
  useSaveSkill,
  useDeleteSkill,
} from "@/src/hooks/provider/useProvider";
import {
  providerProfileSchema,
  skillSchema,
  toProfileForm,
  toSkillPayload,
} from "@/src/lib/validators/provider";
import { SKILL_NAME_TO_ID } from "@/constants/registerMaps";

const ID_TO_SKILL_NAME = Object.fromEntries(
  Object.entries(SKILL_NAME_TO_ID).map(([name, id]) => [id, name])
);

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const DISTRICTS = ['Kandy','Colombo','Gampaha','Matale','Badulla','Nuwaraeliya','Kurunegala','Galle','Matara','Jaffna'];
const SKILL_OPTIONS = Object.keys(SKILL_NAME_TO_ID);
const EXP_YEARS_OPTIONS = Array.from({ length: 40 }, (_, i) => i + 1);

const inputStyle = {
  width: '100%', background: '#fff', border: '1px solid rgba(26,29,35,0.1)',
  borderRadius: '8px', padding: '9px 12px', fontSize: '0.85rem',
  fontFamily: "'DM Sans', sans-serif", color: '#1A1D23', outline: 'none', boxSizing: 'border-box',
};

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: C.slateLight, marginBottom: '5px' }}>{label}</label>
      {children}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem' }}>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>{title}</h3>
      {children}
    </div>
  );
}

function FieldError({ children }) {
  if (!children) return null;
  return <p style={{ fontSize: '0.72rem', color: '#C0392B', marginTop: '3px' }}>{children}</p>;
}

export default function ServiceProviderProfilePage() {
  const { data, isPending } = useProfile();
  const updateProfile = useUpdateProfile();
  const saveSkill = useSaveSkill();
  const deleteSkill = useDeleteSkill();

  const profile = data?.personal_info;
  const rawSkills = data?.skills ?? [];

  const profileForm = useForm({
    resolver: zodResolver(providerProfileSchema),
    values: profile ? toProfileForm(profile) : undefined,
  });
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty },
  } = profileForm;

  const skillForm = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: { skill: '', years: '1', description: '' },
  });
  const {
    register: registerSkill,
    handleSubmit: handleSubmitSkill,
    reset: resetSkill,
    formState: { errors: skillErrors },
  } = skillForm;

  const skills = rawSkills.map(s => ({
    skill_id: s.skill_id,
    name: ID_TO_SKILL_NAME[s.skill_id] || `Skill #${s.skill_id}`,
    years: s.years,
    desc: s.desc,
  }));

  const [editingExpSkill, setEditingExpSkill] = useState(null);

  async function handleUpdatePersonalInfo(values) {
    try {
      await updateProfile.mutateAsync(values);
      alert('Personal information updated successfully!');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function handleAddSkill(values) {
    try {
      await saveSkill.mutateAsync(toSkillPayload(values));
      resetSkill({ skill: '', years: '1', description: '' });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function removeSkill(skillId) {
    try {
      await deleteSkill.mutateAsync(skillId);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateSkillExperience(skillId, newYears) {
    const skill = skills.find(s => s.skill_id === skillId);
    if (!skill) return;
    const yearsNum = Number(newYears) || 1;

    try {
      await saveSkill.mutateAsync({ skill_id: skillId, years: yearsNum, description: skill.desc });
    } catch (err) {
      console.error('Failed to update years:', err);
    }
  }

  if (isPending || !profile) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>Loading profile…</div>;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>My Profile</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Showcase your skills to property owners</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Personal Info Card */}
        <Card title="Personal Info">
          <form onSubmit={handleSubmitProfile(handleUpdatePersonalInfo)}>
            <FormGroup label="Full Name">
              <input
                style={inputStyle}
                {...registerProfile('full_name')}
              />
              <FieldError>{profileErrors.full_name?.message}</FieldError>
            </FormGroup>

            <FormGroup label="District">
              <select
                style={inputStyle}
                {...registerProfile('district')}>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <FieldError>{profileErrors.district?.message}</FieldError>
            </FormGroup>

            <FormGroup label="Daily Rate (LKR)">
              <input
                style={inputStyle}
                type="number"
                {...registerProfile('daily_rate')}
              />
              <FieldError>{profileErrors.daily_rate?.message}</FieldError>
            </FormGroup>

            <FormGroup label="Bio">
              <textarea
                style={{ ...inputStyle, resize: 'vertical' }}
                rows={3}
                {...registerProfile('bio')}
              />
            </FormGroup>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}` }}>
              <input
                type="checkbox"
                id="outRegion"
                {...registerProfile('out_region')}
                style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: C.amber, cursor: 'pointer' }}
              />
              <div>
                <label htmlFor="outRegion" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Willing to work outside my region</label>
                <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '2px' }}>Your profile will be visible to property owners across Sri Lanka.</div>
              </div>
            </div>

            <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={!isDirty || updateProfile.isPending}
                style={{
                  background: (isDirty && !updateProfile.isPending) ? C.amber : '#CBD5E1',
                  color: '#fff', border: 'none', padding: '9px 20px', borderRadius: C.radiusSm,
                  fontSize: '0.82rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  cursor: (isDirty && !updateProfile.isPending) ? 'pointer' : 'not-allowed',
                  opacity: (isDirty && !updateProfile.isPending) ? 1 : 0.65, transition: 'all 0.2s ease'
                }}>
                {updateProfile.isPending ? 'Saving…' : 'Update Personal Info'}
              </button>
            </div>
          </form>
        </Card>

        {/* Skills Card */}
        <Card title="Skills">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.2rem' }}>
            {skills.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: C.muted }}>No skills added yet.</p>
            )}

            {skills.map(skill => (
              <div key={skill.skill_id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 14px', background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}` }}>
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: C.slate }}>{skill.name}</span>
                  <span style={{ fontSize: '0.75rem', color: C.amberDark, fontWeight: 600, marginLeft: '8px' }}>
                    ({skill.years ? `${skill.years} Year${skill.years > 1 ? 's' : ''} Experience` : 'No experience specified'})
                  </span>
                </div>

                {skill.desc && (
                  <div style={{ fontSize: '0.78rem', color: C.slateLight, lineHeight: 1.4 }}>{skill.desc}</div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  {editingExpSkill === skill.skill_id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <select
                        value={skill.years}
                        onChange={e => updateSkillExperience(skill.skill_id, e.target.value)}
                        style={{ ...inputStyle, width: '100px', padding: '4px 8px', fontSize: '0.78rem' }}>
                        {EXP_YEARS_OPTIONS.map(y => (
                          <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      <button onClick={() => setEditingExpSkill(null)}
                        style={{ background: C.slate, color: '#fff', border: 'none', padding: '5px 10px', borderRadius: C.radiusSm, fontSize: '0.74rem', cursor: 'pointer' }}>
                        Done
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingExpSkill(skill.skill_id)}
                      style={{ background: C.amberLight, color: C.amberDark, border: `1px solid ${C.amber}`, padding: '5px 10px', borderRadius: C.radiusSm, fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      Edit Experience
                    </button>
                  )}

                  <button onClick={() => removeSkill(skill.skill_id)} title="Remove skill"
                    style={{ background: '#FDECEC', color: '#B3261E', border: '1px solid rgba(179,38,30,0.2)', padding: '5px 10px', borderRadius: C.radiusSm, fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Remove Skill
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitSkill(handleAddSkill)}>
            <div style={{ padding: '12px', background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.slateLight, marginBottom: '8px' }}>Add / Update Skill</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: '160px' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: C.muted, marginBottom: '3px' }}>Skill Category</label>
                    <select {...registerSkill('skill')} style={inputStyle}>
                      <option value="">-- Select Skill --</option>
                      {SKILL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <FieldError>{skillErrors.skill?.message}</FieldError>
                  </div>

                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: C.muted, marginBottom: '3px' }}>Experience (Years)</label>
                    <select {...registerSkill('years')} style={inputStyle}>
                      {EXP_YEARS_OPTIONS.map(y => <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: C.muted, marginBottom: '3px' }}>Description</label>
                  <textarea
                    {...registerSkill('description')}
                    placeholder="Describe your expertise, tools, or specializations in this skill…"
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saveSkill.isPending}
                  style={{
                    alignSelf: 'flex-start',
                    background: saveSkill.isPending ? '#CBD5E1' : C.amber,
                    color: '#fff', border: 'none', padding: '8px 16px', borderRadius: C.radiusSm,
                    fontSize: '0.82rem', fontWeight: 600,
                    cursor: saveSkill.isPending ? 'not-allowed' : 'pointer',
                    fontFamily: "'DM Sans', sans-serif", marginTop: '4px'
                  }}>
                  {saveSkill.isPending ? 'Saving…' : '+ Add Skill'}
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
