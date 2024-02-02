function Button({ children, disabled }) {
  return (
    <button
      disabled={disabled}
      className="inline-block rounded-full bg-purple-400 px-3 py-4 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-purple-300 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-offset-2 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export default Button;
