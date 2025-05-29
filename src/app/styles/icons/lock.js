export default function Lock() {
  const small = 15;
  const large = 30;

  return(
    <svg className="mt-1" width={large} height={large} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path className="fill-(--dark-blue)" d="M19,14H13a1,1,0,0,1-1-1V10a4,4,0,0,1,8,0v3A1,1,0,0,1,19,14Zm-5-2h4V10a2,2,0,0,0-4,0Z" />
        <rect className="fill-(--blue)" width={small} height={small} rx="3" ry="3" x="9" y="12" />
        <path className="fill-(--dark-blue)" d="M18,18a2,2,0,1,0-3,1.72V21a1,1,0,0,0,2,0V19.72A2,2,0,0,0,18,18Z" />
      </g>
    </svg>
  );
};