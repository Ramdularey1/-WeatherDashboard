import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between p-4 bg-gray-800 text-white">
      <h1 className="font-bold">Weather Dashboard</h1>
      <div className="space-x-4">
        <Link to="/">Today</Link>
        <Link to="/history">History</Link>
      </div>
    </div>
  );
};

export default Navbar;