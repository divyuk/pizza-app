import { Link } from 'react-router-dom';

function Button({ children, disabled, to }) {
  const className =
    'inline-block rounded-full bg-purple-400 px-3 py-4 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-purple-300 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-offset-2 disabled:cursor-not-allowed sm:px-6 sm:py-4';
  if (to)
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  return (
    <button disabled={disabled} className={className}>
      {children}
    </button>
  );
}

export default Button;
