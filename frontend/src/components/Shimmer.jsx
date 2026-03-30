const Shimmer = () => {
  return (
    <div className="animate-pulse">

      {/* Header */}
      <div className="h-6 bg-gray-300 rounded w-40 mx-auto mb-6"></div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-300 rounded-xl"></div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[300px] bg-gray-300 rounded-xl"></div>
        ))}
      </div>

    </div>
  );
};

export default Shimmer;