import React from 'react';
import Image from 'next/image';

const Watermark = () => {
  return ( <Image src="/Logo.png" width={10} height={5} alt="Picture of the SSNC" />);
};

export default Watermark;
