import React from 'react';
import gif from '../img/loading-gif.gif'
const Loading = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', textAlign: 'center', fontSize: '20pt' }}>
      <p style={{padding: '20px'}}>
        Loading...
      </p>
      <img style={{paddingBottom: '100px', width: '100px', height:'100px'}} src={gif} alt="" />
    </div>
  );
};

export default Loading;
