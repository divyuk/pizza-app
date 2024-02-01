import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";

function Header() {
  return (
    <header>
      <Link to="/">Reactive Pizza 🍕</Link>
      <SearchOrder />
      <p>DK</p>
    </header>
  );
}

export default Header;
