export default function Logo() {
  const space = 100;

  return(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={space} height={space}>
      <g data-name="Chat Lock" id="Chat_Lock">
        <path d="M25,5H7A3,3,0,0,0,4,8V20a3,3,0,0,0,3,3H8v3a1,1,0,0,0,.53.88,1,1,0,0,0,1-.05L15.3,23H25a3,3,0,0,0,3-3V8A3,3,0,0,0,25,5Z" fill="#d8e1ef"/>
        <path d="M18,14H14a1,1,0,0,1-1-1V11a3,3,0,0,1,6,0v2A1,1,0,0,1,18,14Zm-3-2h2V11a1,1,0,0,0-2,0Z" fill="#0e6ae0"/>
        <rect height="8" rx="2" ry="2" width="8" x="12" y="12" fill="#0593ff"/>
        <path d="M16,17a1,1,0,0,1-1-1,1,1,0,0,1,2,0A1,1,0,0,1,16,17Z" fill="#0e6ae0"/>
      </g>
    </svg>
  );
};