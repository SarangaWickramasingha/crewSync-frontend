const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara',
    'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota',
    'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa',
    'Ampara', 'Trincomalee', 'Kurunegala',
    'Puttalam', 'Anuradhapura', 'Polonnaruwa',
    'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle',
];

export default function DistrictSelect({ id, value, onChange, className = '', ...props }) {
    return (
        <select
            id={id}
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-[10px] border border-border rounded-lg text-sm text-slate
        bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
        cursor-pointer ${className}`}
            {...props}
        >
            <option value="">Select district</option>
            {DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
            ))}
        </select>
    );
}
