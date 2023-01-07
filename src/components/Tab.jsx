export const Tab = ({
  name,
  onClick = () => {},
  setActiveTab,
  activeTab,
  children,
}) => {
  return (
    <button
      onClick={() => {
        setActiveTab(name);
        onClick();
      }}
      className={`px-3.5 py-1.5 flex gap-2  shadow-lg rounded-md ${
        activeTab === name ? "bg-primary text-white" : "bg-white text-lightBlue"
      }`}
    >
      {name}
      {children}
    </button>
  );
};
