export default function Logo() {
  const small = 8;
  const large = 100;

  return(
    <svg width={large} height={large} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <g>
        <path className="fill-(--secondary) transition-(--transition)" d="M25,5H7A3,3,0,0,0,4,8V20a3,3,0,0,0,3,3H8v3a1,1,0,0,0,.53.88,1,1,0,0,0,1-.05L15.3,23H25a3,3,0,0,0,3-3V8A3,3,0,0,0,25,5Z" />
        <path className="fill-(--dark-blue)" d="M18,14H14a1,1,0,0,1-1-1V11a3,3,0,0,1,6,0v2A1,1,0,0,1,18,14Zm-3-2h2V11a1,1,0,0,0-2,0Z" />
        <rect className="fill-(--blue)" width={small} height={small} rx="2" ry="2" x="12" y="12" />
        <path className="fill-(--dark-blue)" d="M16,17a1,1,0,0,1-1-1,1,1,0,0,1,2,0A1,1,0,0,1,16,17Z" />
      </g>
    </svg>
  );
};