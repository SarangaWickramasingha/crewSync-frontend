// Skill name → DB skill_id
export const SKILL_NAME_TO_ID = {
    'Masonry': 1,
    'Carpentry': 2,
    'Electrical': 3,
    'Plumbing': 4,
    'Painting': 5,
    'Tiling': 6,
    'Welding': 7,
    'Roofing': 8,
    'Waterproofing': 9,
    'Landscaping': 10,
    'Aluminium Work': 11,
    'Interior Design': 12,
};


export const MATERIAL_NAME_TO_ID = {
    'Sand': 1,
    'Cement': 2,
    'Gravel / Metal': 3,
    'Stone / Rubble': 4,
    'Cement Blocks': 5,
    'Timber': 6,
    'Bricks': 7,
    'Glass': 8,
    'Other': 9,
};

// Frontend role → backend role string
export const ROLE_MAP = {
    owner: 'property_owner',
    provider: 'service_provider',
    supplier: 'material_supplier',
};