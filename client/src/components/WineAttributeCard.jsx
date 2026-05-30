export const WineAttributeCard = ({ label, value }) => {
  return (
    <div className="ui-panel">
      <p className="text-xs uppercase tracking-[0.16em] text-label">{label}</p>
      <p className="mt-1 font-semibold text-text">{value}</p>
    </div>
  );
};
