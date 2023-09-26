export const OverallyLoader = ({ active }) => {
  return (
    active && (
      <div id="overally-loader">
        <div className="loader"></div>
      </div>
    )
  );
};
