const MandalaDivider = () => {
  return (
    <div className="my-8 flex items-center justify-center">
      <svg width="200" height="50" viewBox="0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 25h80" stroke="#FF0000" strokeWidth="2"/>
        <circle cx="100" cy="25" r="20" stroke="#FF0000" strokeWidth="2"/>
        <path d="M90 25a10 10 0 0120" stroke="#FF0000" strokeWidth="2"/>
        <path d="M95 20a5 5 0 0110" stroke="#FF0000" strokeWidth="2"/>
        <circle cx="100" cy="25" r="2" fill="#FF0000"/>
        <path d="M120 25h80" stroke="#FF0000" strokeWidth="2"/>
      </svg>
    </div>
  )
}

export default MandalaDivider

